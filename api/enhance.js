// Vercel Serverless Function — POST /api/enhance
// Routes prompt enhancement requests to Anthropic Claude or Google Gemini APIs.
// API keys are read from environment variables and never exposed to the client.

import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPTS = {
  Enhance:
    'You are a world-class prompt engineer. Your task is to take the user\'s prompt and enhance it to be more specific, effective, and likely to produce excellent results from an AI model. Preserve the original intent but add clarity, structure, and detail. Return ONLY the enhanced prompt text — no commentary.',
  Expand:
    'You are a world-class prompt engineer. Your task is to take the user\'s prompt and expand it with additional context, constraints, examples, and detail that will produce richer, more comprehensive AI responses. Return ONLY the expanded prompt text — no commentary.',
  Clarify:
    'You are a world-class prompt engineer. Your task is to take the user\'s prompt and clarify it — removing ambiguity, adding precision, and restructuring for maximum clarity. Make it unambiguous and well-organized. Return ONLY the clarified prompt text — no commentary.',
  Rewrite:
    'You are a world-class prompt engineer. Your task is to completely rewrite the user\'s prompt from scratch using best practices for prompt engineering. The rewritten prompt should achieve the same goal but be significantly more effective. Return ONLY the rewritten prompt text — no commentary.',
};

const MODEL_MAP = {
  'Anthropic Claude Sonnet 4.6': { provider: 'anthropic', model: 'claude-sonnet-4-6-20260217' },
  'Anthropic Claude Haiku 4.5': { provider: 'anthropic', model: 'claude-haiku-4-5-20251001' },
  'Google Gemini 2.5 Pro': { provider: 'google', model: 'gemini-2.5-pro' },
  'Google Gemini 2.5 Flash': { provider: 'google', model: 'gemini-2.5-flash' },
};

const MAX_PROMPT_LENGTH = 10_000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB base64 (~3.75 MB raw)

function detectMediaType(base64) {
  const sig = base64.slice(0, 12);
  if (sig.startsWith('iVBOR')) return 'image/png';
  if (sig.startsWith('/9j/')) return 'image/jpeg';
  if (sig.startsWith('R0lGOD')) return 'image/gif';
  if (sig.startsWith('UklGR')) return 'image/webp';
  return 'image/png'; // safe default
}

function validateRequest(body) {
  const { prompt, image, mode, targetModel } = body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return 'A non-empty prompt is required.';
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return `Prompt must be ${MAX_PROMPT_LENGTH.toLocaleString()} characters or fewer.`;
  }

  if (image !== null && image !== undefined) {
    if (typeof image !== 'string') {
      return 'Image must be a base64-encoded string or null.';
    }
    if (image.length > MAX_IMAGE_BYTES) {
      return 'Image exceeds the 5 MB size limit.';
    }
  }

  const validModes = ['Enhance', 'Expand', 'Clarify', 'Rewrite'];
  if (!validModes.includes(mode)) {
    return `Invalid mode. Must be one of: ${validModes.join(', ')}`;
  }

  if (!MODEL_MAP[targetModel]) {
    return `Invalid target model. Must be one of: ${Object.keys(MODEL_MAP).join(', ')}`;
  }

  return null;
}

async function callAnthropic(modelId, systemPrompt, userPrompt, imageBase64) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured.');

  const client = new Anthropic({ apiKey });

  const content = [];

  if (imageBase64) {
    const mediaType = detectMediaType(imageBase64);
    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: mediaType,
        data: imageBase64,
      },
    });
  }

  content.push({ type: 'text', text: userPrompt });

  const message = await client.messages.create({
    model: modelId,
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content }],
  });

  const textBlock = message.content.find((b) => b.type === 'text');
  return textBlock?.text ?? '';
}

async function callGoogle(modelId, systemPrompt, userPrompt, imageBase64) {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_AI_API_KEY is not configured.');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelId,
    systemInstruction: systemPrompt,
  });

  const parts = [];

  if (imageBase64) {
    const mimeType = detectMediaType(imageBase64);
    parts.push({
      inlineData: {
        mimeType,
        data: imageBase64,
      },
    });
  }

  parts.push({ text: userPrompt });

  const result = await model.generateContent(parts);
  return result.response.text();
}

// Known safe error messages that can be surfaced to clients.
const SAFE_ERROR_MESSAGES = new Set([
  'ANTHROPIC_API_KEY is not configured.',
  'GOOGLE_AI_API_KEY is not configured.',
]);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const validationError = validateRequest(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { prompt, image, mode, targetModel } = req.body;
  const { provider, model: modelId } = MODEL_MAP[targetModel];
  const systemPrompt = SYSTEM_PROMPTS[mode];

  try {
    let enhancedPrompt;

    if (provider === 'anthropic') {
      enhancedPrompt = await callAnthropic(modelId, systemPrompt, prompt, image);
    } else {
      enhancedPrompt = await callGoogle(modelId, systemPrompt, prompt, image);
    }

    return res.status(200).json({ enhancedPrompt });
  } catch (err) {
    console.error('Enhancement API error:', err);
    const raw = err instanceof Error ? err.message : '';
    const message = SAFE_ERROR_MESSAGES.has(raw)
      ? raw
      : 'Enhancement service encountered an error. Please try again.';
    return res.status(500).json({ error: message });
  }
}

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
  'Anthropic Claude 4.6 Sonnet': { provider: 'anthropic', model: 'claude-sonnet-4-20250514' },
  'Anthropic Claude 4.6 Haiku': { provider: 'anthropic', model: 'claude-haiku-4-20250414' },
  'Google Gemini 3.1 Pro': { provider: 'google', model: 'gemini-2.5-pro-preview-05-06' },
  'Google Gemini 3.1 Flash': { provider: 'google', model: 'gemini-2.5-flash-preview-05-20' },
};

function validateRequest(body) {
  const { prompt, mode, targetModel } = body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return 'A non-empty prompt is required.';
  }

  if (prompt.length > 10000) {
    return 'Prompt must be 10,000 characters or fewer.';
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
    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: 'image/png',
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
    parts.push({
      inlineData: {
        mimeType: 'image/png',
        data: imageBase64,
      },
    });
  }

  parts.push({ text: userPrompt });

  const result = await model.generateContent(parts);
  return result.response.text();
}

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
    const message = err instanceof Error ? err.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

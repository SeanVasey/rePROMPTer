import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// --- Validation ---

const VALID_MODES = ['enhance', 'expand', 'clarify', 'rewrite'];

const MODEL_MAP = {
  'claude-sonnet': {
    provider: 'anthropic',
    modelId: 'claude-sonnet-4-6-20260217',
    gatewayModelId: 'anthropic/claude-sonnet-4-5',
    displayName: 'Anthropic Claude Sonnet 4.6',
  },
  'chatgpt-5': {
    provider: 'openai',
    modelId: 'chatgpt-4o-latest',
    gatewayModelId: 'openai/gpt-5-mini',
    displayName: 'OpenAI ChatGPT-5.2',
  },
  'gemini-3': {
    provider: 'google',
    modelId: 'gemini-2.5-pro',
    gatewayModelId: 'google/gemini-2.5-pro',
    displayName: 'Google Gemini 3.0 Pro',
  },
};

const MODE_MAP = {
  enhance: { name: 'Enhance', desc: 'General improvement' },
  expand: { name: 'Expand', desc: 'Add detail & specificity' },
  clarify: { name: 'Clarify', desc: 'Fix ambiguity' },
  rewrite: { name: 'Rewrite', desc: 'Complete restructure' },
};

const MAX_PROMPT_LENGTH = 50_000;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const AI_GATEWAY_BASE_URL = process.env.AI_GATEWAY_BASE_URL || 'https://ai-gateway.vercel.sh/v1';

/** Detect MIME type from base64 data URI magic bytes. */
function detectMimeType(dataUri) {
  const base64 = dataUri.split(',')[1] || '';
  const bytes = atob(base64.slice(0, 16));
  if (bytes.startsWith('\x89PNG')) return 'image/png';
  if (bytes.startsWith('\xFF\xD8\xFF')) return 'image/jpeg';
  if (bytes.startsWith('GIF8')) return 'image/gif';
  if (bytes.startsWith('RIFF') && bytes.slice(8, 12) === 'WEBP') return 'image/webp';
  return 'image/png'; // safe default
}

/** Estimate base64 data URI size in bytes. */
function estimateSize(dataUri) {
  const base64 = dataUri.split(',')[1] || '';
  return Math.ceil((base64.length * 3) / 4);
}

function buildSystemPrompt(modelConfig, modeConfig) {
  const modelStrategies = {
    anthropic: `- Use XML tags (<context>, <task>, <example>) for structure.\n- Emphasize reasoning steps and system-level framing.`,
    openai: `- Use markdown formatting.\n- Assign clear personas/roles.\n- Use step-by-step instructions.`,
    google: `- Focus on multi-modal context.\n- Use clear, direct instructions.\n- Organize logically with headings.`,
  };

  return `Act as rePROMPTer, a high-end prompt engineering studio.
Your task is to transform the user's raw input into a professional, highly effective prompt optimized for ${modelConfig.displayName}.

CURRENT MODE: ${modeConfig.name} (${modeConfig.desc})

STRATEGY:
${modelStrategies[modelConfig.provider]}

RULES:
- ONLY output the enhanced prompt.
- Do not include preamble or "Here is your prompt".
- Ensure the output is ready to be copied and pasted directly into the target LLM.`;
}

function shouldUseAIGateway() {
  if (process.env.AI_GATEWAY_ENABLED === 'false') return false;
  return Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL);
}

function canUseProviderKey(provider) {
  const keyMap = {
    anthropic: 'ANTHROPIC_API_KEY',
    openai: 'OPENAI_API_KEY',
    google: 'GOOGLE_AI_API_KEY',
  };
  return Boolean(process.env[keyMap[provider]]);
}

function buildOpenAIUserContent(userPrompt, imageData) {
  const userContent = [];
  if (imageData) {
    userContent.push({
      type: 'image_url',
      image_url: { url: imageData },
    });
  }
  userContent.push({ type: 'text', text: userPrompt });
  return userContent;
}

// --- Provider Calls ---

async function callAIGateway(systemPrompt, userPrompt, imageData, modelConfig) {
  const client = new OpenAI({
    apiKey: process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY || 'gateway-on-vercel',
    baseURL: AI_GATEWAY_BASE_URL,
  });

  const response = await client.chat.completions.create({
    model: modelConfig.gatewayModelId,
    max_tokens: 4096,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: buildOpenAIUserContent(userPrompt, imageData) },
    ],
  });

  return response.choices[0]?.message?.content ?? '';
}

async function callAnthropic(systemPrompt, userPrompt, imageData) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const content = [];
  if (imageData) {
    const mimeType = detectMimeType(imageData);
    const base64 = imageData.split(',')[1] || imageData;
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: mimeType, data: base64 },
    });
  }
  content.push({ type: 'text', text: userPrompt });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6-20260217',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content }],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  return textBlock?.text ?? '';
}

async function callOpenAI(systemPrompt, userPrompt, imageData) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const userContent = buildOpenAIUserContent(userPrompt, imageData);

  const response = await client.chat.completions.create({
    model: 'chatgpt-4o-latest',
    max_tokens: 4096,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ],
  });

  return response.choices[0]?.message?.content ?? '';
}

async function callGoogle(systemPrompt, userPrompt, imageData) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-pro',
    systemInstruction: { parts: [{ text: systemPrompt }] },
  });

  const parts = [{ text: userPrompt }];
  if (imageData) {
    const mimeType = detectMimeType(imageData);
    const base64 = imageData.split(',')[1] || imageData;
    parts.push({ inlineData: { mimeType, data: base64 } });
  }

  const result = await model.generateContent({ contents: [{ parts }] });
  return result.response.text();
}

// --- Handler ---

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, image, mode, targetModel } = req.body;

    // Validate required fields
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "prompt" field.' });
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return res.status(400).json({ error: `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters.` });
    }
    if (!mode || !VALID_MODES.includes(mode)) {
      return res.status(400).json({ error: `Invalid mode. Must be one of: ${VALID_MODES.join(', ')}` });
    }
    if (!targetModel || !MODEL_MAP[targetModel]) {
      return res.status(400).json({ error: `Invalid target model. Must be one of: ${Object.keys(MODEL_MAP).join(', ')}` });
    }

    // Validate image if provided
    if (image) {
      if (typeof image !== 'string' || !image.startsWith('data:image/')) {
        return res.status(400).json({ error: 'Image must be a data URI starting with "data:image/".' });
      }
      if (estimateSize(image) > MAX_IMAGE_SIZE) {
        return res.status(400).json({ error: 'Image exceeds maximum size of 5 MB.' });
      }
    }

    const modelConfig = MODEL_MAP[targetModel];
    const modeConfig = MODE_MAP[mode];
    const systemPrompt = buildSystemPrompt(modelConfig, modeConfig);

    const gatewayEnabled = shouldUseAIGateway();
    const providerKeyAvailable = canUseProviderKey(modelConfig.provider);

    if (!gatewayEnabled && !providerKeyAvailable) {
      return res.status(500).json({
        error: `Server configuration error: missing ${modelConfig.provider} credentials. Set provider API key or enable AI Gateway.`,
      });
    }

    let enhancedPrompt;
    if (gatewayEnabled) {
      try {
        enhancedPrompt = await callAIGateway(systemPrompt, prompt, image, modelConfig);
      } catch (gatewayError) {
        if (!providerKeyAvailable) {
          throw gatewayError;
        }
      }
    }

    if (!enhancedPrompt) {
      switch (modelConfig.provider) {
        case 'anthropic':
          enhancedPrompt = await callAnthropic(systemPrompt, prompt, image);
          break;
        case 'openai':
          enhancedPrompt = await callOpenAI(systemPrompt, prompt, image);
          break;
        case 'google':
          enhancedPrompt = await callGoogle(systemPrompt, prompt, image);
          break;
        default:
          return res.status(400).json({ error: 'Unknown provider.' });
      }
    }

    return res.status(200).json({ enhancedPrompt });
  } catch (err) {
    console.error('Enhance API error:', err);
    return res.status(500).json({ error: 'An error occurred while enhancing the prompt.' });
  }
}

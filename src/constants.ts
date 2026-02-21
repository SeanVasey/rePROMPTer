export const VERSION = 'v1.4.0';
export const APP_NAME = 'rePROMPTer';
export const TAGLINE = 'The precision prompt optimization studio.';

export const MODES = ['Enhance', 'Expand', 'Clarify', 'Rewrite'] as const;
export type Mode = (typeof MODES)[number];

export const MODELS = [
  'Anthropic Claude 4.6 Sonnet',
  'Anthropic Claude 4.6 Haiku',
  'Google Gemini 3.1 Pro',
  'Google Gemini 3.1 Flash',
] as const;
export type TargetModel = (typeof MODELS)[number];

export interface EnhanceRequest {
  prompt: string;
  image: string | null;
  mode: Mode;
  targetModel: TargetModel;
}

export interface EnhanceResponse {
  enhancedPrompt: string;
}

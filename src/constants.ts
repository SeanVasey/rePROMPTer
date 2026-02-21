export const VERSION = 'v1.4.1';
export const APP_NAME = 'rePROMPTer';
export const TAGLINE = 'The precision prompt optimization studio.';

export const MODES = ['Enhance', 'Expand', 'Clarify', 'Rewrite'] as const;
export type Mode = (typeof MODES)[number];

export const MODELS = [
  'Anthropic Claude Sonnet 4.6',
  'Anthropic Claude Haiku 4.5',
  'Google Gemini 2.5 Pro',
  'Google Gemini 2.5 Flash',
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

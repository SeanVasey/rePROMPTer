import { Sparkles, Maximize, Layers, Edit3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Model {
  id: string;
  name: string;
}

export interface Mode {
  id: string;
  name: string;
  icon: LucideIcon;
  desc: string;
}

export const VERSION = 'v2.3.0';
export const TAGLINE = 'The advanced prompt optimization engine.';

export const MODELS: Model[] = [
  { id: 'claude-sonnet', name: 'Anthropic Claude Sonnet 4.6' },
  { id: 'claude-haiku', name: 'Anthropic Claude Haiku 4.5' },
  { id: 'chatgpt-5', name: 'OpenAI ChatGPT-5.2' },
  { id: 'gemini-3', name: 'Google Gemini 3.0 Pro' },
];

export const MODES: Mode[] = [
  { id: 'enhance', name: 'Enhance', icon: Sparkles, desc: 'General improvement' },
  { id: 'expand', name: 'Expand', icon: Maximize, desc: 'Add detail & specificity' },
  { id: 'clarify', name: 'Clarify', icon: Layers, desc: 'Fix ambiguity' },
  { id: 'rewrite', name: 'Rewrite', icon: Edit3, desc: 'Complete restructure' },
];

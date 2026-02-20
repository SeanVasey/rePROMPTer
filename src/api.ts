import type { EnhanceRequest, EnhanceResponse, Mode, TargetModel } from './constants';

export async function enhancePrompt(request: EnhanceRequest): Promise<EnhanceResponse> {
  const response = await fetch('/api/enhance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new PreviewModeError();
    }
    const errorData = (await response.json()) as { error?: string };
    throw new Error(errorData.error ?? `Request failed with status ${response.status}`);
  }

  return (await response.json()) as EnhanceResponse;
}

export class PreviewModeError extends Error {
  constructor() {
    super('Preview Environment');
    this.name = 'PreviewModeError';
  }
}

export function generatePreviewResponse(mode: Mode, targetModel: TargetModel, inputText: string): string {
  const isClaude = targetModel.includes('Claude');
  const formatting = isClaude
    ? 'XML tags (<instructions>, etc.)'
    : 'Markdown and concise directives';
  const truncatedInput = inputText.length > 50 ? `${inputText.substring(0, 50)}...` : inputText;

  const openTag = isClaude ? '<context>\n' : '';
  const closeTag = isClaude ? '\n</context>' : '';

  return [
    `[PREVIEW MODE — No backend connected]`,
    `[In production, this routes through your secure Vercel serverless API.]`,
    ``,
    `Optimized Prompt for ${targetModel}:`,
    ``,
    `${openTag}You are an expert AI system tasked with the following objective.`,
    ``,
    `### Task`,
    `Apply the "${mode}" optimization to: "${truncatedInput}"`,
    ``,
    `### Constraints`,
    `- Format output using ${formatting}.`,
    `- Maintain a professional, highly detailed tone.`,
    `- Prioritize clarity and actionability.${closeTag}`,
  ].join('\n');
}

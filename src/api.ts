export interface EnhanceRequest {
  prompt: string;
  image?: string;
  mode: string;
  targetModel: string;
}

export interface EnhanceResponse {
  enhancedPrompt: string;
}

export interface EnhanceError {
  error: string;
}

export async function enhancePrompt(
  request: EnhanceRequest,
): Promise<string> {
  const response = await fetch('/api/enhance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as EnhanceError | null;
    throw new Error(body?.error ?? `Request failed with status ${response.status}`);
  }

  const data = (await response.json()) as EnhanceResponse;
  return data.enhancedPrompt;
}

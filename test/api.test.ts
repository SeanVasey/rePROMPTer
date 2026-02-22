import { describe, it, expect, vi, beforeEach } from 'vitest';
import { enhancePrompt } from '../src/api';

describe('enhancePrompt', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sends a POST request and returns the enhanced prompt', async () => {
    const mockResponse = { enhancedPrompt: 'Better prompt' };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await enhancePrompt({
      prompt: 'Test',
      mode: 'enhance',
      targetModel: 'claude-sonnet',
    });

    expect(result).toBe('Better prompt');
    expect(global.fetch).toHaveBeenCalledWith('/api/enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Test',
        mode: 'enhance',
        targetModel: 'claude-sonnet',
      }),
    });
  });

  it('throws an error with server error message on failure', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'Bad request' }),
    });

    await expect(
      enhancePrompt({ prompt: '', mode: 'enhance', targetModel: 'claude-sonnet' }),
    ).rejects.toThrow('Bad request');
  });

  it('throws a generic error when response has no parseable body', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('not json')),
    });

    await expect(
      enhancePrompt({ prompt: 'test', mode: 'enhance', targetModel: 'claude-sonnet' }),
    ).rejects.toThrow('Request failed with status 500');
  });

  it('includes image in request when provided', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ enhancedPrompt: 'With image' }),
    });

    await enhancePrompt({
      prompt: 'Describe this',
      image: 'data:image/png;base64,abc123',
      mode: 'expand',
      targetModel: 'gemini-3',
    });

    const callBody = JSON.parse((global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body);
    expect(callBody.image).toBe('data:image/png;base64,abc123');
    expect(callBody.targetModel).toBe('gemini-3');
  });
});

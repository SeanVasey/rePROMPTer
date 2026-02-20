import { describe, it, expect, vi, beforeEach } from 'vitest';
import { enhancePrompt, PreviewModeError, generatePreviewResponse } from '../api';

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('enhancePrompt', () => {
  const baseRequest = {
    prompt: 'Test prompt',
    image: null,
    mode: 'Enhance' as const,
    targetModel: 'Anthropic Claude 4.6 Sonnet' as const,
  };

  it('sends a POST request with the correct body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ enhancedPrompt: 'result' }),
    });

    await enhancePrompt(baseRequest);

    expect(mockFetch).toHaveBeenCalledWith('/api/enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(baseRequest),
    });
  });

  it('returns the enhanced prompt on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ enhancedPrompt: 'Enhanced result' }),
    });

    const result = await enhancePrompt(baseRequest);
    expect(result.enhancedPrompt).toBe('Enhanced result');
  });

  it('throws PreviewModeError on 404', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    await expect(enhancePrompt(baseRequest)).rejects.toThrow(PreviewModeError);
  });

  it('throws with server error message on non-404 failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal error' }),
    });

    await expect(enhancePrompt(baseRequest)).rejects.toThrow('Internal error');
  });
});

describe('generatePreviewResponse', () => {
  it('includes XML tags for Claude models', () => {
    const result = generatePreviewResponse('Enhance', 'Anthropic Claude 4.6 Sonnet', 'test');
    expect(result).toContain('<context>');
    expect(result).toContain('</context>');
  });

  it('does not include XML tags for Gemini models', () => {
    const result = generatePreviewResponse('Enhance', 'Google Gemini 3.1 Pro', 'test');
    expect(result).not.toContain('<context>');
    expect(result).not.toContain('</context>');
  });

  it('includes the selected mode', () => {
    const result = generatePreviewResponse('Rewrite', 'Anthropic Claude 4.6 Sonnet', 'test');
    expect(result).toContain('"Rewrite"');
  });

  it('truncates long input text', () => {
    const longInput = 'a'.repeat(100);
    const result = generatePreviewResponse('Enhance', 'Anthropic Claude 4.6 Sonnet', longInput);
    expect(result).toContain('...');
    expect(result).not.toContain('a'.repeat(100));
  });

  it('includes preview mode notice', () => {
    const result = generatePreviewResponse('Enhance', 'Anthropic Claude 4.6 Sonnet', 'test');
    expect(result).toContain('PREVIEW MODE');
  });
});

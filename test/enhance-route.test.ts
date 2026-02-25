import { beforeEach, describe, expect, it, vi } from 'vitest';

const openAiCreateMock = vi.fn();
const anthropicCreateMock = vi.fn();
const googleGenerateMock = vi.fn();

vi.mock('openai', () => {
  function OpenAI() {}
  OpenAI.prototype.chat = {
    completions: {
      create: openAiCreateMock,
    },
  };
  return { default: OpenAI };
});

vi.mock('@anthropic-ai/sdk', () => {
  function Anthropic() {}
  Anthropic.prototype.messages = {
    create: anthropicCreateMock,
  };
  return { default: Anthropic };
});

vi.mock('@google/generative-ai', () => {
  function GoogleGenerativeAI() {}
  GoogleGenerativeAI.prototype.getGenerativeModel = () => ({
    generateContent: googleGenerateMock,
  });
  return { GoogleGenerativeAI };
});

function makeReq(body: Record<string, unknown>) {
  return {
    method: 'POST',
    body,
  };
}

function makeRes() {
  return {
    statusCode: 0,
    payload: null as unknown,
    headers: {} as Record<string, string>,
    setHeader(name: string, value: string) {
      this.headers[name] = value;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(data: unknown) {
      this.payload = data;
      return this;
    },
  };
}

describe('/api/enhance handler', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    delete process.env.VERCEL;
    delete process.env.AI_GATEWAY_ENABLED;
    delete process.env.AI_GATEWAY_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.GOOGLE_AI_API_KEY;
  });

  it('uses Vercel AI Gateway when available', async () => {
    process.env.VERCEL = '1';

    openAiCreateMock.mockResolvedValueOnce({
      choices: [{ message: { content: 'Gateway prompt' } }],
    });

    const { default: handler } = await import('../api/enhance.js');
    const req = makeReq({ prompt: 'Improve this', mode: 'enhance', targetModel: 'claude-sonnet' });
    const res = makeRes();

    await handler(req as never, res as never);

    expect(res.statusCode).toBe(200);
    expect(res.payload).toEqual({ enhancedPrompt: 'Gateway prompt' });
    expect(openAiCreateMock).toHaveBeenCalledTimes(1);
    expect(anthropicCreateMock).not.toHaveBeenCalled();
  });

  it('falls back to provider SDK when gateway fails and provider key exists', async () => {
    process.env.VERCEL = '1';
    process.env.ANTHROPIC_API_KEY = 'anthropic-key';

    openAiCreateMock.mockRejectedValueOnce(new Error('Gateway down'));
    anthropicCreateMock.mockResolvedValueOnce({
      content: [{ type: 'text', text: 'Fallback prompt' }],
    });

    const { default: handler } = await import('../api/enhance.js');
    const req = makeReq({ prompt: 'Improve this', mode: 'enhance', targetModel: 'claude-sonnet' });
    const res = makeRes();

    await handler(req as never, res as never);

    expect(res.statusCode).toBe(200);
    expect(res.payload).toEqual({ enhancedPrompt: 'Fallback prompt' });
    expect(openAiCreateMock).toHaveBeenCalledTimes(1);
    expect(anthropicCreateMock).toHaveBeenCalledTimes(1);
  });

  it('returns 500 when neither gateway nor provider credentials are available', async () => {
    process.env.AI_GATEWAY_ENABLED = 'false';

    const { default: handler } = await import('../api/enhance.js');
    const req = makeReq({ prompt: 'Improve this', mode: 'enhance', targetModel: 'claude-sonnet' });
    const res = makeRes();

    await handler(req as never, res as never);

    expect(res.statusCode).toBe(500);
    expect(res.payload).toEqual({
      error: 'Server configuration error: missing anthropic credentials. Set provider API key or enable AI Gateway.',
    });
  });
});

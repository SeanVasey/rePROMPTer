import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import App from '../src/App';

vi.mock('../src/api', () => ({
  enhancePrompt: vi.fn(),
}));

import { enhancePrompt } from '../src/api';

const mockEnhance = vi.mocked(enhancePrompt);

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the header and branding', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toContain('rePROMPTer');
    expect(screen.getAllByText('v2.2.0').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('VASEY/AI PRESENTS').length).toBeGreaterThanOrEqual(1);
  });

  it('renders all 4 mode buttons', () => {
    render(<App />);
    for (const name of ['Enhance', 'Expand', 'Clarify', 'Rewrite']) {
      expect(screen.getAllByText(name).length).toBeGreaterThanOrEqual(1);
    }
  });

  it('renders exactly 3 model options in dropdown', () => {
    render(<App />);
    const selects = screen.getAllByTestId('model-select');
    const select = selects[0]!;
    const options = select.querySelectorAll('option');
    expect(options).toHaveLength(3);
    expect(options[0]!.textContent).toBe('Anthropic Claude Sonnet 4.6');
    expect(options[1]!.textContent).toBe('OpenAI ChatGPT-5.2');
    expect(options[2]!.textContent).toBe('Google Gemini 3.0 Pro');
  });

  it('disables Enhance button when input is empty', () => {
    render(<App />);
    const btn = screen.getAllByTestId('enhance-button')[0]! as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('enables Enhance button when text is entered', () => {
    render(<App />);
    const textarea = screen.getAllByTestId('prompt-input')[0]!;
    fireEvent.change(textarea, { target: { value: 'Test prompt' } });
    const btn = screen.getAllByTestId('enhance-button')[0]! as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });

  it('calls enhancePrompt and displays the result', async () => {
    mockEnhance.mockResolvedValueOnce('Enhanced result text');
    render(<App />);

    const textarea = screen.getAllByTestId('prompt-input')[0]!;
    fireEvent.change(textarea, { target: { value: 'My raw prompt' } });
    fireEvent.click(screen.getAllByTestId('enhance-button')[0]!);

    await waitFor(() => {
      expect(screen.getAllByText('Enhanced result text').length).toBeGreaterThanOrEqual(1);
    });

    expect(mockEnhance).toHaveBeenCalledWith({
      prompt: 'My raw prompt',
      image: undefined,
      mode: 'enhance',
      targetModel: 'claude-sonnet',
    });
  });

  it('displays an error message on failure', async () => {
    mockEnhance.mockRejectedValueOnce(new Error('API down'));
    render(<App />);

    const textarea = screen.getAllByTestId('prompt-input')[0]!;
    fireEvent.change(textarea, { target: { value: 'Test' } });
    fireEvent.click(screen.getAllByTestId('enhance-button')[0]!);

    await waitFor(() => {
      expect(screen.getAllByText('API down').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('changes mode when a mode button is clicked', () => {
    render(<App />);
    const expandButton = screen.getAllByText('Expand')[0]!.closest('button')!;
    fireEvent.click(expandButton);
    expect(expandButton.className).toContain('border-[#E63946]');
  });

  it('changes model when the dropdown value changes', () => {
    render(<App />);
    const select = screen.getAllByTestId('model-select')[0]! as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'chatgpt-5' } });
    expect(select.value).toBe('chatgpt-5');
  });
});

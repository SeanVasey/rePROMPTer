import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('App', () => {
  it('renders the header and app name', () => {
    render(<App />);
    expect(screen.getByText('re')).toBeInTheDocument();
    expect(screen.getByText('PROMPTer')).toBeInTheDocument();
  });

  it('renders the version badge', () => {
    render(<App />);
    expect(screen.getByText('v1.3.0')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<App />);
    expect(screen.getByText('The precision prompt optimization studio.')).toBeInTheDocument();
  });

  it('renders the prompt input textarea', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('A lone astronaut on Mars...')).toBeInTheDocument();
  });

  it('disables the Re-Prompt button when input is empty', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /re-prompt/i });
    expect(button).toBeDisabled();
  });

  it('enables the Re-Prompt button when text is entered', async () => {
    const user = userEvent.setup();
    render(<App />);

    const textarea = screen.getByPlaceholderText('A lone astronaut on Mars...');
    await user.type(textarea, 'Test prompt');

    const button = screen.getByRole('button', { name: /re-prompt/i });
    expect(button).toBeEnabled();
  });

  it('renders all four enhancement mode buttons', () => {
    render(<App />);
    expect(screen.getByRole('radio', { name: /enhance/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /expand/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /clarify/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /rewrite/i })).toBeInTheDocument();
  });

  it('selects Enhance mode by default', () => {
    render(<App />);
    const enhanceButton = screen.getByRole('radio', { name: /enhance/i });
    expect(enhanceButton).toHaveAttribute('aria-checked', 'true');
  });

  it('allows switching enhancement modes', async () => {
    const user = userEvent.setup();
    render(<App />);

    const expandButton = screen.getByRole('radio', { name: /expand/i });
    await user.click(expandButton);
    expect(expandButton).toHaveAttribute('aria-checked', 'true');

    const enhanceButton = screen.getByRole('radio', { name: /enhance/i });
    expect(enhanceButton).toHaveAttribute('aria-checked', 'false');
  });

  it('shows the default target model', () => {
    render(<App />);
    expect(screen.getByText('Anthropic Claude 4.6 Sonnet')).toBeInTheDocument();
  });

  it('opens model dropdown on click', async () => {
    const user = userEvent.setup();
    render(<App />);

    const modelButton = screen.getByRole('button', { name: /target model/i });
    await user.click(modelButton);

    // All models should be visible in the dropdown
    expect(screen.getByRole('option', { name: /claude 4.6 haiku/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /gemini 3.1 pro/i })).toBeInTheDocument();
  });

  it('displays preview response when API returns 404', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    render(<App />);

    const textarea = screen.getByPlaceholderText('A lone astronaut on Mars...');
    await user.type(textarea, 'Test prompt');

    const button = screen.getByRole('button', { name: /re-prompt/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/PREVIEW MODE/)).toBeInTheDocument();
    });
  });

  it('displays error message on API failure', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Server error' }),
    });

    render(<App />);

    const textarea = screen.getByPlaceholderText('A lone astronaut on Mars...');
    await user.type(textarea, 'Test prompt');

    const button = screen.getByRole('button', { name: /re-prompt/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Server error');
    });
  });

  it('displays enhanced output on successful API response', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ enhancedPrompt: 'Enhanced: A lone astronaut on Mars' }),
    });

    render(<App />);

    const textarea = screen.getByPlaceholderText('A lone astronaut on Mars...');
    await user.type(textarea, 'A lone astronaut on Mars');

    const button = screen.getByRole('button', { name: /re-prompt/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Enhanced: A lone astronaut on Mars')).toBeInTheDocument();
    });
  });

  it('renders the bottom navigation bar', () => {
    render(<App />);
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
  });

  it('has Studio as the active navigation item', () => {
    render(<App />);
    const studioButton = screen.getByRole('button', { name: /studio/i });
    expect(studioButton).toHaveAttribute('aria-current', 'page');
  });
});

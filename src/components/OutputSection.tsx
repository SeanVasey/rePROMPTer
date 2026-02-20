import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface OutputSectionProps {
  resultText: string;
  isProcessing: boolean;
}

export default function OutputSection({ resultText, isProcessing }: OutputSectionProps) {
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleCopy = async () => {
    if (!resultText) return;

    try {
      await navigator.clipboard.writeText(resultText);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      // Fallback for environments without Clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = resultText;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  if (!resultText && !isProcessing) return null;

  return (
    <section className="space-y-3 pt-6" aria-live="polite">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[11px] font-bold tracking-[0.15em] text-muted uppercase">
          Enhanced Output
        </h3>
        {resultText && (
          <button
            onClick={handleCopy}
            className="text-[10px] font-bold text-accent bg-accent/10 px-3 py-1.5 rounded-full uppercase flex items-center gap-1.5 hover:bg-accent/20 transition-colors border border-accent/20"
            aria-label={copyFeedback ? 'Copied to clipboard' : 'Copy enhanced prompt'}
          >
            {copyFeedback ? (
              <>
                <Check size={12} /> Copied
              </>
            ) : (
              <>
                <Copy size={12} /> Copy All
              </>
            )}
          </button>
        )}
      </div>

      <div className="bg-surface-secondary border border-surface-border rounded-3xl p-6 shadow-xl relative min-h-[200px]">
        {isProcessing ? (
          <div className="space-y-4 pt-2" aria-label="Loading enhanced prompt">
            <div className="h-4 bg-surface-border rounded-full w-3/4 animate-pulse" />
            <div className="h-4 bg-surface-border rounded-full w-full animate-pulse" />
            <div className="h-4 bg-surface-border rounded-full w-5/6 animate-pulse" />
            <div className="h-4 bg-surface-border rounded-full w-1/2 animate-pulse" />
          </div>
        ) : (
          <div className="text-[#E0E0E0] whitespace-pre-wrap leading-relaxed font-mono text-[13px] sm:text-sm custom-scrollbar">
            {resultText}
          </div>
        )}
      </div>
    </section>
  );
}

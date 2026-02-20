import { Sparkles, Maximize2, Settings2, RotateCcw } from 'lucide-react';
import { MODES, type Mode } from '../constants';

interface ModeSelectorProps {
  selectedMode: Mode;
  onModeChange: (mode: Mode) => void;
}

const MODE_ICONS: Record<Mode, React.ReactNode> = {
  Enhance: <Sparkles size={12} className="inline mr-1.5 mb-0.5" />,
  Expand: <Maximize2 size={12} className="inline mr-1.5 mb-0.5" />,
  Clarify: <Settings2 size={12} className="inline mr-1.5 mb-0.5" />,
  Rewrite: <RotateCcw size={12} className="inline mr-1.5 mb-0.5" />,
};

export default function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-[11px] font-bold tracking-[0.15em] text-muted uppercase pl-1">
        Enhancement Mode
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Enhancement mode">
        {MODES.map((mode) => (
          <button
            key={mode}
            role="radio"
            aria-checked={selectedMode === mode}
            onClick={() => onModeChange(mode)}
            className={`py-3.5 px-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-colors border ${
              selectedMode === mode
                ? 'bg-gradient-to-br from-accent-dark to-accent border-accent text-white shadow-lg'
                : 'bg-surface-secondary border-surface-border text-muted hover:bg-surface-tertiary'
            }`}
          >
            {MODE_ICONS[mode]}
            {mode}
          </button>
        ))}
      </div>
    </section>
  );
}

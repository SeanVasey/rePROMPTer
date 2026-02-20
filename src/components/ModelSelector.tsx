import { useState, useRef, useEffect } from 'react';
import { Zap, ChevronDown, Check } from 'lucide-react';
import { MODELS, type TargetModel } from '../constants';

interface ModelSelectorProps {
  targetModel: TargetModel;
  onModelChange: (model: TargetModel) => void;
}

export default function ModelSelector({ targetModel, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <section className="space-y-3">
      <h3 className="text-[11px] font-bold tracking-[0.15em] text-muted uppercase pl-1">
        Target Model
      </h3>
      <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-surface-secondary border border-surface-border rounded-xl p-4 flex items-center justify-between text-sm font-medium hover:bg-surface-tertiary transition-colors shadow-sm"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Target model: ${targetModel}`}
        >
          <div className="flex items-center gap-3">
            <Zap size={16} className="text-accent" />
            <span className="text-white">{targetModel}</span>
          </div>
          <ChevronDown
            size={18}
            className={`text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div
            className="absolute z-50 mt-2 w-full bg-surface-secondary border border-surface-border rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden"
            role="listbox"
            aria-label="Select target model"
          >
            <div className="py-1">
              {MODELS.map((model) => (
                <button
                  key={model}
                  role="option"
                  aria-selected={targetModel === model}
                  onClick={() => {
                    onModelChange(model);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-5 py-3.5 text-sm transition-colors flex items-center justify-between group hover:bg-surface-tertiary"
                >
                  <span
                    className={
                      targetModel === model
                        ? 'text-accent font-bold'
                        : 'text-muted group-hover:text-white'
                    }
                  >
                    {model}
                  </span>
                  {targetModel === model && <Check size={14} className="text-accent" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

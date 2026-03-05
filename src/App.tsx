import { useState, useRef } from 'react';
import {
  Copy,
  Check,
  Image as ImageIcon,
  X,
  ChevronDown,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { MODELS, MODES, VERSION, TAGLINE } from './constants';
import { enhancePrompt } from './api';

/* ------------------------------------------------------------------ */
/*  Small presentational helpers                                       */
/* ------------------------------------------------------------------ */

function CustomLogoIcon() {
  return (
    <div className="relative w-14 h-14 flex items-center justify-center animate-float">
      <div className="absolute w-10 h-10 bg-[#fa5d60] rounded-full blur-[14px] opacity-60 animate-pulse [animation-duration:3s]" />
      <img
        src="/reprompter-icon.svg"
        alt="rePROMPTer icon"
        className="relative z-10 w-12 h-12 drop-shadow-[0_0_12px_rgba(250,93,96,0.8)]"
      />
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 py-0.5 rounded-full border border-[#EF4050]/20 bg-[#EF4050]/5 backdrop-blur-md shadow-[0_0_8px_rgba(239,64,80,0.1)] text-[9px] font-mono text-[#FF8A94]/90 tracking-widest uppercase">
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#A8A8BC] uppercase mb-2 flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-[#EF4050] shadow-[0_0_6px_#EF4050]" />
      {children}
    </h3>
  );
}

/* ------------------------------------------------------------------ */
/*  Main application                                                   */
/* ------------------------------------------------------------------ */

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMode, setSelectedMode] = useState(MODES[0]!.id);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]!.id);
  const [image, setImage] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = output;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const processPrompt = async () => {
    if (!input && !image) return;
    setIsProcessing(true);
    setError(null);

    try {
      const result = await enhancePrompt({
        prompt: input || 'Examine this image and generate a high-quality prompt based on its content.',
        image: image ?? undefined,
        mode: selectedMode,
        targetModel: selectedModel,
      });
      setOutput(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to enhance prompt. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const hasContent = !!(input || image);

  return (
    <div className="relative min-h-[100dvh] bg-[#0C0C14] text-white font-sans selection:bg-[#EF4050]/40 overflow-x-hidden pb-16 safe-area-bottom">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#0C0C14] opacity-90" />
        <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-[#A01020]/25 blur-[120px] rounded-full mix-blend-screen animate-[drift_15s_ease-in-out_infinite]" />
        <div className="absolute top-[40%] -right-[10%] w-[50vw] h-[50vw] bg-[#EF4050]/20 blur-[150px] rounded-full mix-blend-screen animate-[drift_20s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] bg-[#FF8A94]/15 blur-[120px] rounded-full mix-blend-screen animate-[drift_12s_ease-in-out_infinite]" />
      </div>

      {/* Main Scrollable Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 safe-area-x">
        {/* Header */}
        <header className="sticky top-0 z-50 pb-2 mb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 bg-gradient-to-b from-[#0C0C14] via-[#0C0C14]/85 to-transparent backdrop-blur-xl safe-area-top">
          <div className="flex flex-col items-center gap-1.5">
            <div className="text-[9px] sm:text-[10px] tracking-[0.6em] text-[#A8A8BC] font-bold uppercase drop-shadow-md">
              VASEY/AI PRESENTS
            </div>
            <CustomLogoIcon />
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-lg">
                  re
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF4050] to-[#FF8A94]">
                    PROMPT
                  </span>
                  er
                </h1>
                <Badge>{VERSION}</Badge>
              </div>
              <p className="italic text-[#A8A8BC]/80 text-xs sm:text-sm font-light tracking-wide">
                {TAGLINE}
              </p>
            </div>
          </div>
        </header>

        <main className="space-y-3 relative z-10">
          {/* Editor Canvas */}
          <section className="glass-panel rounded-2xl p-3.5 sm:p-4 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(239,64,80,0.12)] group">
            <SectionLabel>Editor Canvas</SectionLabel>
            <div className="relative mt-2">
              <textarea
                data-testid="prompt-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Start typing, paste, or drag a prompt..."
                className="w-full h-20 bg-transparent text-white placeholder-[#A8A8BC]/40 resize-none outline-none text-sm sm:text-base font-light leading-relaxed transition-colors focus:placeholder-[#A8A8BC]/60"
              />
              {image && (
                <div className="absolute inset-0 bg-[#1C1C24]/80 backdrop-blur-sm flex items-center justify-center rounded-xl p-3 border border-white/10 animate-in fade-in zoom-in-95 duration-300">
                  <div className="relative w-full h-full max-w-sm">
                    <img
                      src={image}
                      className="w-full h-full object-contain rounded-xl shadow-2xl"
                      alt="Uploaded reference"
                    />
                    <button
                      onClick={() => setImage(null)}
                      className="absolute -top-2 -right-2 bg-gradient-to-br from-[#EF4050] to-[#A01020] p-1.5 rounded-full shadow-[0_0_15px_rgba(239,64,80,0.5)] hover:scale-110 active:scale-95 transition-transform"
                      aria-label="Remove image"
                    >
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mode Buttons — 2x2 grid on mobile */}
            <div className="mt-2.5 pt-2.5 border-t accent-divider border-white/5">
              <div className="grid grid-cols-2 gap-1.5">
                {MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                      selectedMode === mode.id
                        ? 'bg-[#EF4050]/15 border border-[#EF4050]/40 text-white shadow-[0_0_12px_rgba(239,64,80,0.15)]'
                        : 'bg-white/[0.03] border border-white/[0.06] text-[#A8A8BC] hover:bg-[#EF4050]/5 hover:border-[#EF4050]/20 hover:text-white'
                    }`}
                  >
                    <mode.icon
                      className={`w-3.5 h-3.5 transition-all duration-200 ${
                        selectedMode === mode.id
                          ? 'text-[#FF8A94] drop-shadow-[0_0_4px_rgba(255,138,148,0.8)]'
                          : ''
                      }`}
                    />
                    {mode.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Model selector + Action row */}
            <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t accent-divider border-white/5">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-[#EF4050]/5 border border-white/[0.06] hover:border-[#EF4050]/20 text-[#A8A8BC] hover:text-white transition-all active:scale-95"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Media</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />

              <div className="relative group/select">
                <select
                  data-testid="model-select"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-white/[0.03] text-[10px] font-medium py-2 pl-2.5 pr-6 rounded-lg border border-white/[0.06] hover:border-[#EF4050]/20 focus:border-[#EF4050]/40 outline-none appearance-none cursor-pointer text-[#A8A8BC] hover:text-white transition-all"
                >
                  {MODELS.map((m) => (
                    <option key={m.id} value={m.id} className="bg-[#1C1C24] text-white">
                      {m.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#A8A8BC] pointer-events-none" />
              </div>

              <button
                data-testid="enhance-button"
                onClick={processPrompt}
                disabled={isProcessing || !hasContent}
                className={`relative overflow-hidden ml-auto px-5 sm:px-6 py-2 rounded-lg font-bold text-[10px] sm:text-xs tracking-widest uppercase transition-all active:scale-95 ${
                  hasContent
                    ? 'shadow-[0_4px_20px_rgba(239,64,80,0.3)] hover:shadow-[0_8px_30px_rgba(239,64,80,0.5)]'
                    : 'opacity-40 grayscale'
                }`}
              >
                <div
                  className={`absolute inset-0 transition-transform duration-500 ${
                    hasContent
                      ? 'bg-gradient-to-r from-[#A01020] via-[#FF8A94] to-[#EF4050] bg-[length:200%_100%] animate-shine hover:scale-105'
                      : 'bg-gradient-to-r from-[#5a2028] to-[#6a2530]'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent opacity-50" />
                <div className="relative z-10 flex items-center gap-1.5 text-white drop-shadow-md">
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Enhance</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </section>

          {/* Output Area */}
          {output && (
            <section className="glass-panel rounded-2xl p-3.5 sm:p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center justify-between mb-3">
                <SectionLabel>Optimized Output</SectionLabel>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-[#EF4050]/30 hover:bg-[#EF4050]/5 hover:text-white transition-all active:scale-95"
                >
                  {copyStatus ? (
                    <Check className="w-3.5 h-3.5 text-[#EF4050]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {copyStatus ? 'Copied!' : 'Copy'}
                  </span>
                </button>
              </div>
              <div className="p-3 bg-black/30 rounded-xl border border-[#EF4050]/5 min-h-[100px] font-mono text-sm sm:text-[15px] text-white/90 leading-relaxed whitespace-pre-wrap selection:bg-[#EF4050]/40 shadow-inner">
                {output}
              </div>
            </section>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-[#A01020]/20 backdrop-blur-md border border-[#EF4050]/40 rounded-xl p-3 text-center shadow-[0_0_20px_rgba(239,64,80,0.15)] animate-in fade-in zoom-in duration-300">
              <p className="text-[#FF8A94] text-xs font-bold tracking-wider uppercase">{error}</p>
            </div>
          )}
        </main>
      </div>

      {/* Copy Toast */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 transform ${
          copyStatus
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-12 scale-90 pointer-events-none'
        }`}
      >
        <div className="bg-[#1C1C24]/90 backdrop-blur-xl border border-[#EF4050]/40 px-5 py-3 rounded-full shadow-[0_10px_30px_rgba(239,64,80,0.25)] flex items-center gap-2.5">
          <div className="bg-gradient-to-r from-[#A01020] to-[#EF4050] p-1.5 rounded-full shadow-inner">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white drop-shadow-md">
            Prompt Copied
          </span>
        </div>
      </div>
    </div>
  );
}

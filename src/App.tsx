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
    <div className="relative w-16 h-16 flex items-center justify-center animate-float">
      <div className="absolute w-12 h-12 bg-[#fa5d60] rounded-full blur-[16px] opacity-60 animate-pulse [animation-duration:3s]" />
      <img
        src="/reprompter-icon.svg"
        alt="rePROMPTer icon"
        className="relative z-10 w-14 h-14 drop-shadow-[0_0_12px_rgba(250,93,96,0.8)]"
      />
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2.5 py-0.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md shadow-[0_0_10px_rgba(255,255,255,0.05)] text-[10px] font-mono text-white/80 tracking-widest uppercase">
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-bold tracking-[0.2em] text-[#A8A8BC] uppercase mb-3 flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-[#EF4050] shadow-[0_0_5px_#EF4050]" />
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
      // Fallback for older browsers
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

  return (
    <div className="relative min-h-[100dvh] bg-[#0A0A0F] text-white font-sans selection:bg-[#EF4050]/40 overflow-x-hidden pb-20 safe-area-bottom">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#0A0A0F] opacity-90" />
        <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-[#A01020]/30 blur-[120px] rounded-full mix-blend-screen animate-[drift_15s_ease-in-out_infinite]" />
        <div className="absolute top-[40%] -right-[10%] w-[50vw] h-[50vw] bg-[#EF4050]/30 blur-[150px] rounded-full mix-blend-screen animate-[drift_20s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] bg-[#FF8A94]/20 blur-[120px] rounded-full mix-blend-screen animate-[drift_12s_ease-in-out_infinite]" />
      </div>

      {/* Main Scrollable Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-6 safe-area-x">
        {/* Header */}
        <header className="sticky top-0 z-50 pt-5 pb-3 mb-2 -mx-5 px-5 sm:-mx-6 sm:px-6 bg-gradient-to-b from-[#0A0A0F]/95 via-[#0A0A0F]/70 to-transparent backdrop-blur-xl border-b border-white/[0.02] transition-all duration-300 safe-area-top">
          <div className="flex flex-col items-center gap-2">
            <div className="text-[9px] sm:text-[10px] tracking-[0.6em] text-[#A8A8BC] font-bold uppercase drop-shadow-md">
              VASEY/AI PRESENTS
            </div>
            <CustomLogoIcon />
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-3">
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

        <main className="space-y-4 relative z-10">
          {/* Editor Canvas — contains textarea, mode/model controls, and action buttons */}
          <section className="glass-panel rounded-3xl p-4 sm:p-5 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(239,64,80,0.15)] group">
            <SectionLabel>Editor Canvas</SectionLabel>
            <div className="relative group mt-3">
              <textarea
                data-testid="prompt-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Start typing, paste, or drag a prompt..."
                className="w-full h-28 bg-transparent text-white placeholder-[#A8A8BC]/40 resize-none outline-none text-base sm:text-lg font-light leading-relaxed transition-colors focus:placeholder-[#A8A8BC]/60"
              />
              {image && (
                <div className="absolute inset-0 bg-[#1C1C24]/80 backdrop-blur-sm flex items-center justify-center rounded-2xl p-4 border border-white/10 animate-in fade-in zoom-in-95 duration-300">
                  <div className="relative w-full h-full max-w-sm">
                    <img
                      src={image}
                      className="w-full h-full object-contain rounded-xl shadow-2xl"
                      alt="Uploaded reference"
                    />
                    <button
                      onClick={() => setImage(null)}
                      className="absolute -top-3 -right-3 bg-gradient-to-br from-[#EF4050] to-[#A01020] p-2 rounded-full shadow-[0_0_15px_rgba(239,64,80,0.5)] hover:scale-110 active:scale-95 transition-transform"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Compact Controls Row — mode pills + model dropdown */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/5">
              <div className="flex gap-1.5 flex-wrap">
                {MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                      selectedMode === mode.id
                        ? 'bg-[#EF4050]/20 border border-[#EF4050]/50 text-white shadow-[0_0_12px_rgba(239,64,80,0.2)]'
                        : 'bg-white/5 border border-white/5 text-[#A8A8BC] hover:bg-white/10 hover:border-white/20 hover:text-white'
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
              <div className="relative ml-auto group/select">
                <select
                  data-testid="model-select"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-white/5 text-[11px] font-medium py-1.5 pl-3 pr-7 rounded-lg border border-white/10 hover:border-white/20 focus:border-[#EF4050]/50 outline-none appearance-none cursor-pointer text-[#A8A8BC] hover:text-white transition-all"
                >
                  {MODELS.map((m) => (
                    <option key={m.id} value={m.id} className="bg-[#1C1C24] text-white">
                      {m.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#A8A8BC] pointer-events-none" />
              </div>
            </div>

            {/* Action Bar — media upload + enhance button */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 group-hover:border-white/10 transition-colors duration-300">
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-[#A8A8BC] hover:text-white transition-all active:scale-95 shadow-sm"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Media</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <button
                data-testid="enhance-button"
                onClick={processPrompt}
                disabled={isProcessing || (!input && !image)}
                className="relative overflow-hidden group/btn px-6 sm:px-8 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-widest uppercase transition-all disabled:opacity-40 disabled:grayscale active:scale-95 shadow-[0_4px_20px_rgba(239,64,80,0.3)] hover:shadow-[0_8px_30px_rgba(239,64,80,0.5)]"
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-[#A01020] via-[#FF8A94] to-[#EF4050] bg-[length:200%_100%] transition-transform duration-500 group-hover/btn:scale-105 ${input || image ? 'animate-shine' : ''}`} />
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                <div className="relative z-10 flex items-center gap-2 text-white drop-shadow-md">
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span>Processing</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/btn:rotate-12" />
                      <span>Enhance</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </section>

          {/* Output Area */}
          {output && (
            <section className="glass-panel rounded-3xl p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center justify-between mb-4">
                <SectionLabel>Optimized Output</SectionLabel>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 hover:border-[#EF4050]/50 hover:bg-[#EF4050]/10 hover:text-white transition-all active:scale-95 shadow-sm"
                >
                  {copyStatus ? (
                    <Check className="w-4 h-4 text-[#EF4050]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {copyStatus ? 'Copied!' : 'Copy'}
                  </span>
                </button>
              </div>
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5 min-h-[120px] font-mono text-sm sm:text-[15px] text-white/90 leading-relaxed whitespace-pre-wrap selection:bg-[#EF4050]/40 shadow-inner">
                {output}
              </div>
            </section>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-[#A01020]/20 backdrop-blur-md border border-[#EF4050]/50 rounded-2xl p-4 text-center shadow-[0_0_20px_rgba(239,64,80,0.2)] animate-in fade-in zoom-in duration-300">
              <p className="text-[#FF8A94] text-xs font-bold tracking-wider uppercase">{error}</p>
            </div>
          )}
        </main>
      </div>

      {/* Copy Toast */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 transform ${
          copyStatus
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-12 scale-90 pointer-events-none'
        }`}
      >
        <div className="bg-[#1C1C24]/90 backdrop-blur-xl border border-[#EF4050]/50 px-6 py-3.5 rounded-full shadow-[0_10px_30px_rgba(239,64,80,0.3)] flex items-center gap-3">
          <div className="bg-gradient-to-r from-[#A01020] to-[#EF4050] p-1.5 rounded-full shadow-inner">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-white drop-shadow-md">
            Prompt Copied
          </span>
        </div>
      </div>
    </div>
  );
}

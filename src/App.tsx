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
    <div className="relative w-20 h-20 flex items-center justify-center animate-float">
      <div className="absolute inset-0 bg-gradient-to-br from-[#E63946] to-[#8B0000] rounded-full opacity-30 blur-xl animate-pulse" />
      <div className="relative z-10 w-16 h-16 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(230,57,70,0.3)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          className="w-12 h-12 scale-110 drop-shadow-[0_0_8px_rgba(230,57,70,0.8)]"
        >
          <defs>
            <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff7b85" />
              <stop offset="50%" stopColor="#E63946" />
              <stop offset="100%" stopColor="#8B0000" />
            </linearGradient>
            <linearGradient id="fillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E63946" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8B0000" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <g
            stroke="url(#strokeGrad)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="url(#fillGrad)"
            transform="translate(-5, 55)"
          >
            <path d="M 769 359 L 655 245 L 640 239 L 628 240 L 621 243 L 282 575 L 277 584 L 231 724 L 229 742 L 234 757 L 243 766 L 256 771 L 270 771 L 432 718 L 439 714 L 770 390 L 774 381 L 774 369 Z" />
            <path d="M 417 785 L 789 787 L 797 784 L 805 777 L 808 770 L 808 757 L 801 746 L 786 740 L 466 739 L 454 741 L 445 746 L 419 777 Z" />
            <path d="M 719 508 L 716 512 L 716 515 L 714 518 L 701 559 L 696 563 L 664 573 L 655 577 L 652 577 L 648 579 L 647 584 L 652 587 L 697 602 L 702 609 L 716 654 L 718 657 L 723 657 L 740 606 L 744 602 L 791 587 L 796 584 L 796 581 L 795 579 L 742 562 L 739 558 L 724 510 Z" />
            <path d="M 335 195 L 331 201 L 308 272 L 306 274 L 229 299 L 226 301 L 226 306 L 305 334 L 308 337 L 333 414 L 335 416 L 339 416 L 342 411 L 366 337 L 376 331 L 446 308 L 449 306 L 449 301 L 368 274 L 363 267 L 341 198 L 339 195 Z" />
            <path d="M 717 130 L 714 135 L 714 137 L 713 138 L 713 140 L 712 141 L 712 143 L 711 144 L 711 146 L 709 150 L 709 153 L 707 156 L 707 159 L 705 162 L 705 165 L 703 168 L 703 171 L 702 172 L 701 177 L 699 179 L 695 181 L 693 181 L 692 182 L 690 182 L 689 183 L 687 183 L 686 184 L 684 184 L 683 185 L 681 185 L 680 186 L 678 186 L 677 187 L 675 187 L 674 188 L 672 188 L 671 189 L 669 189 L 668 190 L 666 190 L 665 191 L 663 191 L 662 192 L 660 192 L 659 193 L 654 194 L 652 196 L 652 201 L 654 201 L 657 203 L 660 203 L 663 205 L 665 205 L 666 206 L 671 207 L 674 209 L 676 209 L 677 210 L 679 210 L 680 211 L 682 211 L 683 212 L 685 212 L 686 213 L 688 213 L 689 214 L 691 214 L 694 216 L 696 216 L 698 217 L 701 220 L 701 222 L 702 223 L 702 225 L 703 226 L 703 228 L 704 229 L 704 231 L 705 232 L 705 234 L 706 235 L 706 237 L 707 238 L 707 240 L 709 244 L 709 247 L 711 250 L 711 252 L 712 253 L 712 255 L 713 256 L 713 258 L 714 259 L 715 264 L 717 267 L 721 267 L 724 262 L 724 260 L 726 256 L 726 253 L 728 250 L 728 248 L 729 247 L 729 244 L 731 241 L 731 239 L 733 235 L 733 232 L 734 231 L 734 229 L 735 228 L 735 226 L 736 225 L 736 223 L 738 219 L 740 217 L 742 217 L 743 216 L 745 216 L 746 215 L 748 215 L 749 214 L 751 214 L 752 213 L 754 213 L 755 212 L 760 211 L 763 209 L 766 209 L 769 207 L 771 207 L 772 206 L 774 206 L 775 205 L 780 204 L 783 202 L 788 201 L 789 200 L 789 196 L 786 194 L 784 194 L 783 193 L 780 193 L 779 192 L 777 192 L 776 191 L 774 191 L 773 190 L 771 190 L 770 189 L 768 189 L 767 188 L 765 188 L 764 187 L 762 187 L 761 186 L 756 185 L 753 183 L 750 183 L 749 182 L 747 182 L 744 180 L 742 180 L 740 179 L 737 176 L 737 174 L 735 171 L 735 169 L 734 168 L 734 166 L 733 165 L 733 163 L 732 162 L 732 160 L 731 159 L 731 157 L 730 156 L 730 154 L 729 153 L 729 151 L 728 150 L 728 148 L 727 147 L 727 145 L 726 144 L 726 142 L 725 141 L 725 139 L 723 135 L 723 132 L 722 130 Z" />
            <path d="M 638 293 L 632 294 L 460 464 L 343 577 L 343 582 L 423 661 L 428 661 L 717 377 L 717 372 Z" />
            <path d="M 315 612 L 315 613 L 314 614 L 314 616 L 313 617 L 313 619 L 312 620 L 312 622 L 311 623 L 311 625 L 310 626 L 310 628 L 309 629 L 309 631 L 308 632 L 308 634 L 307 635 L 307 637 L 306 638 L 306 640 L 305 641 L 305 643 L 304 644 L 304 646 L 303 647 L 303 649 L 302 650 L 302 653 L 301 654 L 301 656 L 300 657 L 300 659 L 299 660 L 299 662 L 298 663 L 298 665 L 297 666 L 297 668 L 296 669 L 296 671 L 295 672 L 295 678 L 310 693 L 311 693 L 324 706 L 332 706 L 333 705 L 336 705 L 337 704 L 339 704 L 340 703 L 342 703 L 343 702 L 345 702 L 346 701 L 348 701 L 349 700 L 351 700 L 352 699 L 354 699 L 355 698 L 357 698 L 358 697 L 360 697 L 361 696 L 363 696 L 364 695 L 367 695 L 370 693 L 373 693 L 374 692 L 376 692 L 377 691 L 379 691 L 380 690 L 382 690 L 383 689 L 385 689 L 386 688 L 388 688 L 389 687 L 390 687 L 391 686 L 392 686 L 392 682 L 374 664 L 373 664 L 336 627 L 335 627 L 320 612 Z" />
          </g>
        </svg>
      </div>
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
    <h3 className="text-[11px] font-bold tracking-[0.2em] text-[#9A9AAA] uppercase mb-3 flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] shadow-[0_0_5px_#E63946]" />
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
    <div className="relative min-h-[100dvh] bg-[#0A0A0C] text-white font-sans selection:bg-[#E63946]/40 overflow-x-hidden pb-20">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-[#8B0000]/20 blur-[120px] rounded-full mix-blend-screen animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] bg-[#E63946]/15 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0C]/50 to-[#0A0A0C] opacity-90" />
      </div>

      {/* Main Scrollable Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-6">
        {/* Header */}
        <header className="sticky top-0 z-50 pt-10 pb-6 mb-4 -mx-5 px-5 sm:-mx-6 sm:px-6 bg-gradient-to-b from-[#0A0A0C]/90 via-[#0A0A0C]/70 to-transparent backdrop-blur-md border-b border-white/[0.02]">
          <div className="flex flex-col items-center gap-5">
            <div className="text-[9px] sm:text-[10px] tracking-[0.6em] text-[#9A9AAA] font-bold uppercase drop-shadow-md">
              VASEY/AI PRESENTS
            </div>
            <CustomLogoIcon />
            <div className="flex flex-col items-center gap-2 mt-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-lg">
                  re
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E63946] to-[#ff7b85]">
                    PROMPT
                  </span>
                  er
                </h1>
                <Badge>{VERSION}</Badge>
              </div>
              <p className="italic text-[#9A9AAA]/80 text-xs sm:text-sm font-light tracking-wide">
                {TAGLINE}
              </p>
            </div>
          </div>
        </header>

        <main className="space-y-6">
          {/* Input Area */}
          <section className="glass-panel rounded-3xl p-5 sm:p-6 transition-transform duration-300 hover:shadow-[0_8px_40px_rgba(230,57,70,0.15)]">
            <SectionLabel>Editor Canvas</SectionLabel>
            <div className="relative group mt-4">
              <textarea
                data-testid="prompt-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Start typing, paste, or drag a prompt..."
                className="w-full h-44 bg-transparent text-white placeholder-[#9A9AAA]/40 resize-none outline-none text-base sm:text-lg font-light leading-relaxed"
              />
              {image && (
                <div className="absolute inset-0 bg-[#1A1A1E]/80 backdrop-blur-sm flex items-center justify-center rounded-2xl p-4 border border-white/10">
                  <div className="relative w-full h-full max-w-sm">
                    <img
                      src={image}
                      className="w-full h-full object-contain rounded-xl shadow-2xl"
                      alt="Uploaded reference"
                    />
                    <button
                      onClick={() => setImage(null)}
                      className="absolute -top-3 -right-3 bg-gradient-to-br from-[#E63946] to-[#8B0000] p-2 rounded-full shadow-[0_0_15px_rgba(230,57,70,0.5)] hover:scale-110 active:scale-95 transition-transform"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-[#9A9AAA] hover:text-white transition-all active:scale-95 shadow-sm"
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
                className="relative overflow-hidden group px-6 sm:px-8 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-widest uppercase transition-all disabled:opacity-40 disabled:grayscale active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#8B0000] via-[#E63946] to-[#CC2936] transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                <div className="relative z-10 flex items-center gap-2 text-white drop-shadow-md">
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span>Processing</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Enhance</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </section>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Mode Selector */}
            <section className="glass-panel rounded-3xl p-5">
              <SectionLabel>Input Mode</SectionLabel>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all duration-300 overflow-hidden active:scale-95 ${
                      selectedMode === mode.id
                        ? 'border-[#E63946]/50 bg-gradient-to-b from-[#E63946]/20 to-transparent text-white shadow-[0_4px_20px_rgba(230,57,70,0.2)]'
                        : 'border-white/5 bg-white/5 text-[#9A9AAA] hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <mode.icon
                      className={`w-5 h-5 mb-1.5 transition-colors ${
                        selectedMode === mode.id
                          ? 'text-[#ff7b85] drop-shadow-[0_0_5px_rgba(255,123,133,0.8)]'
                          : ''
                      }`}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      {mode.name}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Model Selector */}
            <section className="glass-panel rounded-3xl p-5">
              <SectionLabel>Target Model</SectionLabel>
              <div className="relative group mt-4">
                <select
                  data-testid="model-select"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-white/5 backdrop-blur-md text-sm font-medium py-4 px-5 rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/10 outline-none appearance-none transition-all cursor-pointer text-white shadow-inner"
                >
                  {MODELS.map((m) => (
                    <option key={m.id} value={m.id} className="bg-[#1A1A1E] text-white py-2">
                      {m.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-8 h-8 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
                  <ChevronDown className="w-4 h-4 text-white" />
                </div>
              </div>
            </section>
          </div>

          {/* Output Area */}
          {output && (
            <section className="glass-panel rounded-3xl p-5 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-5">
                <SectionLabel>Optimized Output</SectionLabel>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 hover:border-[#E63946]/50 hover:bg-[#E63946]/10 hover:text-white transition-all active:scale-95 shadow-sm"
                >
                  {copyStatus ? (
                    <Check className="w-4 h-4 text-[#E63946]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {copyStatus ? 'Copied!' : 'Copy'}
                  </span>
                </button>
              </div>
              <div className="p-5 bg-black/40 rounded-2xl border border-white/5 min-h-[150px] font-mono text-sm sm:text-[15px] text-white/90 leading-relaxed whitespace-pre-wrap selection:bg-[#E63946]/40 shadow-inner">
                {output}
              </div>
            </section>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-[#8B0000]/20 backdrop-blur-md border border-[#E63946]/50 rounded-2xl p-4 text-center shadow-[0_0_20px_rgba(230,57,70,0.2)]">
              <p className="text-[#ff7b85] text-xs font-bold tracking-wider uppercase">{error}</p>
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
        <div className="bg-[#1A1A1E]/90 backdrop-blur-xl border border-[#E63946]/50 px-6 py-3.5 rounded-full shadow-[0_10px_30px_rgba(230,57,70,0.3)] flex items-center gap-3">
          <div className="bg-gradient-to-r from-[#8B0000] to-[#E63946] p-1.5 rounded-full shadow-inner">
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

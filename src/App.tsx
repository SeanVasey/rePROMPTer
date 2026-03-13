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
    <div className="relative min-h-[100dvh] bg-[#0A0A0F] text-white font-sans selection:bg-[#EF4050]/40 overflow-x-hidden safe-area-bottom">
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
        <header className="sticky top-0 z-50 pt-8 pb-3 mb-2 -mx-5 px-5 sm:-mx-6 sm:px-6 bg-gradient-to-b from-[#0A0A0F]/95 via-[#0A0A0F]/70 to-transparent backdrop-blur-xl border-b border-white/[0.02] transition-all duration-300 safe-area-top">
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

            {/* Compact Controls Row — mode grid + model dropdown */}
            <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-white/5">
              <div className="grid grid-cols-2 gap-1.5">
                {MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 ${
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
              <div className="relative self-end group/select">
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

        {/* VASEY/AI Branded Footer */}
        <footer className="app-footer">
          <div className="footer-divider">
            <span className="footer-dot" />
          </div>
          <div className="footer-brand-row">
            {/* Vasey Multimedia — VM Monogram */}
            <a href="https://vaseymultimedia.com" target="_blank" rel="noopener noreferrer" className="footer-logo" aria-label="Vasey Multimedia">
              <svg className="footer-logo-vm" viewBox="0 0 688 592" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(0,592) scale(0.1,-0.1)" fill="currentColor">
                  <path d="M20 3827 l0 -2073 251 -265 c138 -145 281 -299 317 -341 37 -42 70 -76 74 -75 3 1 8 851 10 1889 2 1038 8 1891 12 1895 5 4 11 2 13 -5 3 -7 51 -70 106 -139 144 -178 444 -556 611 -767 77 -98 193 -245 257 -325 64 -80 223 -281 353 -446 130 -165 301 -381 380 -480 78 -99 205 -261 282 -359 76 -99 176 -227 222 -285 46 -58 104 -133 130 -166 323 -418 405 -517 415 -499 13 24 111 152 237 309 83 104 193 244 345 438 22 29 76 97 120 153 44 56 116 148 160 205 44 57 213 270 375 474 162 203 307 386 322 405 15 19 89 112 165 207 76 94 174 218 217 275 44 57 202 258 350 447 317 403 353 448 409 521 l42 55 3 -1903 c1 -1047 6 -1902 10 -1900 4 2 50 50 102 108 52 58 184 197 294 310 110 113 211 221 225 241 l26 35 0 225 c0 123 -1 1053 -2 2067 l-3 1842 -323 0 c-309 0 -323 -1 -332 -19 -6 -11 -57 -79 -115 -151 -126 -158 -178 -226 -377 -486 -83 -109 -191 -249 -240 -311 -48 -61 -166 -212 -262 -335 -197 -251 -337 -430 -522 -663 -70 -88 -146 -186 -170 -217 -120 -155 -371 -476 -528 -673 -96 -121 -198 -249 -226 -285 -28 -36 -111 -140 -184 -232 l-133 -166 -27 31 c-15 18 -49 61 -77 97 -27 36 -103 133 -169 216 -66 82 -164 206 -217 275 -53 68 -170 216 -258 329 -89 113 -276 354 -417 535 -141 182 -289 371 -328 420 -39 50 -128 162 -196 250 -69 88 -181 232 -250 319 -68 87 -221 283 -339 435 -119 152 -271 345 -338 429 -67 84 -129 164 -138 177 l-16 25 -324 0 -324 0 0 -2073z M1209 5883 c5 -10 66 -90 136 -178 69 -88 176 -225 238 -305 61 -80 146 -188 187 -241 41 -52 106 -136 145 -185 38 -49 121 -155 185 -235 63 -80 141 -179 172 -220 62 -79 308 -394 532 -679 213 -272 298 -381 471 -603 88 -114 162 -206 165 -206 3 0 21 21 41 47 19 26 109 141 200 256 90 115 247 315 348 445 236 302 465 594 547 696 102 128 375 474 563 716 96 123 216 276 266 339 50 63 136 171 190 240 l98 125 -374 3 c-292 2 -375 0 -380 -10 -4 -7 -102 -132 -218 -278 -116 -146 -223 -281 -238 -301 -98 -128 -269 -345 -333 -423 -41 -50 -93 -116 -115 -146 -22 -30 -78 -102 -125 -160 -78 -96 -186 -232 -388 -490 -41 -52 -79 -95 -83 -95 -5 0 -46 48 -91 106 -101 129 -455 578 -750 949 -509 643 -621 786 -642 817 l-21 33 -368 0 c-347 0 -367 -1 -358 -17z M1130 2171 l0 -1484 163 -166 c156 -159 343 -353 437 -453 25 -27 48 -48 53 -48 4 0 7 637 7 1415 l0 1415 -33 37 c-19 21 -151 184 -295 363 -144 179 -277 343 -296 365 l-35 40 -1 -1484z M5633 3532 c-50 -64 -193 -245 -317 -401 l-226 -284 0 -1413 c0 -887 4 -1414 10 -1414 5 0 13 6 17 14 10 18 110 125 267 286 66 69 175 181 241 250 l120 125 -3 1478 c-1 812 -5 1477 -10 1476 -4 0 -48 -53 -99 -117z" />
                </g>
              </svg>
            </a>
            <div className="footer-logo-sep" />
            {/* VASEY/AI — V/AI Monogram */}
            <a href="https://vasey.ai" target="_blank" rel="noopener noreferrer" className="footer-logo" aria-label="VASEY/AI">
              <svg className="footer-logo-vai" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(0,1080) scale(0.1,-0.1)">
                  <path d="M5797 7988 c-15 -12 -38 -53 -162 -283 -26 -49 -75 -139 -108 -200 -58 -107 -233 -435 -334 -625 -84 -157 -278 -521 -311 -580 -16 -30 -127 -239 -247 -465 -119 -225 -233 -439 -252 -475 -20 -36 -76 -141 -125 -235 -50 -93 -105 -197 -123 -230 -18 -33 -73 -136 -123 -230 -49 -93 -99 -187 -111 -209 -12 -21 -62 -114 -111 -206 -49 -92 -97 -183 -108 -201 -10 -19 -42 -78 -72 -131 -29 -54 -59 -98 -66 -98 -17 0 -34 32 -34 61 0 21 63 146 190 379 196 358 240 441 240 454 0 13 -482 978 -500 1001 -5 6 -74 141 -155 300 -81 160 -195 382 -253 495 -58 113 -134 262 -168 332 -35 70 -71 131 -81 136 -20 11 -983 3 -983 -7 0 -3 31 -62 68 -131 37 -69 103 -192 146 -275 44 -82 129 -244 191 -360 62 -115 143 -268 180 -340 37 -71 103 -195 145 -275 43 -80 105 -199 140 -265 35 -66 82 -156 105 -200 24 -44 118 -224 210 -400 92 -176 202 -385 245 -465 42 -80 119 -226 171 -325 51 -99 133 -256 181 -350 49 -93 147 -286 218 -427 115 -227 134 -258 154 -258 20 0 39 29 136 208 62 114 166 304 230 422 175 321 310 571 380 705 35 66 148 280 253 475 104 195 208 391 232 435 23 44 102 193 175 330 73 138 182 342 243 455 61 113 122 225 135 250 67 125 125 232 162 300 22 41 70 134 107 205 36 72 181 346 323 610 141 264 280 524 309 578 29 54 50 105 47 113 -5 12 -73 14 -439 14 -331 0 -437 -3 -450 -12z M8839 6962 c-42 -20 -114 -55 -160 -76 -152 -71 -473 -226 -529 -256 l-55 -29 -9 -318 c-5 -180 -5 -886 0 -1618 l9 -1300 420 0 420 0 0 1814 c0 1201 -3 1815 -10 1817 -5 1 -44 -14 -86 -34z M5983 6518 c-5 -7 -26 -44 -45 -83 -20 -38 -106 -200 -191 -359 -86 -158 -159 -297 -162 -307 -6 -17 98 -224 285 -574 15 -27 57 -109 94 -182 36 -72 74 -141 84 -152 17 -19 29 -20 424 -22 224 -2 410 0 414 4 3 3 -9 34 -29 69 -41 74 -313 594 -447 853 -265 515 -399 765 -410 765 -4 0 -12 -6 -17 -12z M5066 4761 c-19 -7 -101 -146 -281 -474 -76 -139 -105 -201 -97 -209 7 -7 487 -10 1571 -10 859 -1 1564 2 1567 5 4 3 -16 45 -44 94 -27 48 -74 135 -105 193 -130 249 -200 376 -215 393 -14 16 -83 17 -1196 16 -650 0 -1189 -4 -1200 -8z M6450 3977 c0 -8 15 -43 33 -78 19 -35 78 -149 132 -254 54 -104 101 -194 105 -200 9 -12 97 -182 323 -620 206 -401 225 -435 251 -444 12 -4 227 -5 479 -3 l457 4 -86 167 c-124 237 -179 341 -244 461 -31 58 -85 159 -120 225 -34 66 -79 152 -100 190 -21 39 -75 142 -120 230 -46 87 -104 195 -130 240 l-46 80 -49 6 c-28 3 -238 7 -467 8 -355 2 -418 0 -418 -12z" fill="currentColor" />
                </g>
              </svg>
            </a>
          </div>
          <div className="footer-suite-tag">A VASEY/AI Production</div>
          <div className="footer-app-tag">rePROMPTer {VERSION} &middot; {TAGLINE}</div>
          <div className="footer-copyright">
            &copy; 2026{' '}
            <a href="https://vaseymultimedia.com" target="_blank" rel="noopener noreferrer">
              VASEY Multimedia
            </a>
            . All rights reserved.
            <br />
            Designed &amp; engineered by{' '}
            <a href="https://vasey.ai" target="_blank" rel="noopener noreferrer">
              VASEY/AI
            </a>
          </div>
        </footer>
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

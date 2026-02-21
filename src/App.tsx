import { useState, useCallback } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { VERSION, TAGLINE, type Mode, type TargetModel } from './constants';
import { enhancePrompt, PreviewModeError, generatePreviewResponse } from './api';
import CustomIcon from './components/CustomIcon';
import ImageUpload from './components/ImageUpload';
import ModelSelector from './components/ModelSelector';
import ModeSelector from './components/ModeSelector';
import OutputSection from './components/OutputSection';
import NavBar from './components/NavBar';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [selectedMode, setSelectedMode] = useState<Mode>('Enhance');
  const [targetModel, setTargetModel] = useState<TargetModel>('Anthropic Claude Sonnet 4.6');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageChange = useCallback((file: File | null, base64: string | null) => {
    setImageFile(file);
    setImageBase64(base64);
  }, []);

  const hasInput = inputText.trim().length > 0 || imageBase64 !== null;

  const handleEnhance = useCallback(async () => {
    if (!hasInput) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setResultText('');

    try {
      const data = await enhancePrompt({
        prompt: inputText,
        image: imageBase64,
        mode: selectedMode,
        targetModel,
      });
      setResultText(data.enhancedPrompt);
    } catch (err) {
      if (err instanceof PreviewModeError) {
        // Simulate response when no backend is available
        const preview = generatePreviewResponse(selectedMode, targetModel, inputText);
        setResultText(preview);
      } else {
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to connect to enhancement service.',
        );
      }
    } finally {
      setIsProcessing(false);
    }
  }, [hasInput, inputText, imageBase64, selectedMode, targetModel]);

  return (
    <div className="min-h-screen bg-surface-primary text-[#E0E0E0] font-sans selection:bg-accent/30 overflow-x-hidden pb-24 relative">
      {/* Ambient top glow */}
      <div
        className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-accent-dark/10 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Header */}
      <header className="pt-10 pb-6 text-center px-4 relative z-10">
        <p className="text-[10px] tracking-[0.4em] text-muted font-light mb-8 uppercase">
          Vasey/AI Presents
        </p>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center gap-4">
            <CustomIcon />
            <div className="flex flex-col items-start justify-center">
              <div className="flex items-baseline">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                  <span className="text-white">re</span>
                  <span className="bg-gradient-to-r from-accent-light to-accent-dark bg-clip-text text-transparent">
                    PROMPTer
                  </span>
                </h1>
                <span className="ml-3 text-[10px] font-bold tracking-widest bg-surface-secondary text-muted px-2 py-0.5 rounded-full border border-surface-border">
                  {VERSION}
                </span>
              </div>
            </div>
          </div>

          <p className="text-muted italic text-sm mt-2 font-light tracking-wide">{TAGLINE}</p>

          <div className="mt-3 flex items-center gap-1.5 text-[9px] font-medium tracking-widest text-muted bg-surface-secondary/80 px-3 py-1.5 rounded-full border border-surface-border">
            <ShieldCheck size={12} className="text-accent" />
            SECURE ZERO-TRUST FRONTEND
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-xl mx-auto px-4 space-y-6 mt-6 relative z-10">
        {/* Input area */}
        <section className="space-y-3">
          <h3 className="text-[11px] font-bold tracking-[0.15em] text-muted uppercase pl-1">
            Input Prompt
          </h3>
          <div className="bg-surface-secondary border border-surface-border rounded-2xl p-4 shadow-xl focus-within:border-accent/50 transition-colors">
            <label htmlFor="prompt-input" className="sr-only">
              Enter your prompt
            </label>
            <textarea
              id="prompt-input"
              className="w-full bg-transparent border-none focus:ring-0 text-lg placeholder-muted-dark min-h-[140px] resize-none leading-relaxed text-white"
              placeholder="A lone astronaut on Mars..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <ImageUpload imageFile={imageFile} onImageChange={handleImageChange} />
          </div>
        </section>

        {/* Model selector */}
        <ModelSelector targetModel={targetModel} onModelChange={setTargetModel} />

        {/* Mode selector and action button */}
        <div className="grid grid-cols-1 gap-6">
          <ModeSelector selectedMode={selectedMode} onModeChange={setSelectedMode} />

          <button
            onClick={handleEnhance}
            disabled={isProcessing || !hasInput}
            className={`w-full py-4 rounded-2xl font-bold text-lg uppercase tracking-widest transition-colors flex items-center justify-center gap-3 border ${
              isProcessing || !hasInput
                ? 'bg-surface-secondary text-muted-dark cursor-not-allowed border-surface-border'
                : 'bg-white text-black hover:bg-[#E0E0E0] border-transparent shadow-xl'
            }`}
            aria-label={isProcessing ? 'Optimizing prompt' : 'Re-prompt: enhance your prompt'}
          >
            {isProcessing ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <RefreshCw size={20} />
                Re-Prompt
              </>
            )}
          </button>
        </div>

        {/* Error display */}
        {errorMessage && (
          <div
            className="bg-accent-dark/20 border border-accent/30 rounded-xl p-4 text-accent text-sm text-center"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        {/* Output */}
        <OutputSection resultText={resultText} isProcessing={isProcessing} />
      </main>

      {/* Navigation */}
      <NavBar activeItem="studio" onNavigate={() => {}} />
    </div>
  );
}

import React, { useState, useCallback } from 'react';
import { GeminiModel, GeneratedImage } from '../types';
import { generateLogo } from '../services/geminiService';
import { Loader2, Download, RefreshCw, Wand2, Sparkles, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface LogoCreatorProps {
  onImageGenerated: (image: GeneratedImage) => void;
}

const LogoCreator: React.FC<LogoCreatorProps> = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<GeminiModel>(GeminiModel.FLASH);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateLogo(prompt, model);
      setCurrentImage(result);
      onImageGenerated(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate logo. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = useCallback(() => {
    if (!currentImage) return;
    const link = document.createElement('a');
    link.href = currentImage.imageUrl;
    link.download = `logogenerate-${currentImage.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [currentImage]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Logo
          </span>
          Generate
        </h1>
        <p className="text-slate-400 text-lg">
          Describe your brand, get a professional logo in seconds.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-700/50 shadow-xl">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="prompt" className="block text-sm font-medium text-slate-300">
              Describe your logo idea
            </label>
            <div className="relative">
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., A minimalist geometric fox head logo for a tech startup, orange and dark grey gradients, clean lines, white background..."
                className="w-full h-32 bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-base"
                disabled={isGenerating}
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                 {/* Model Selector Toggle */}
                <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setModel(GeminiModel.FLASH)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      model === GeminiModel.FLASH
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Fast (Flash)
                  </button>
                  <button
                    type="button"
                    onClick={() => setModel(GeminiModel.PRO)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                      model === GeminiModel.PRO
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Pro <Sparkles size={10} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3 flex items-start gap-3 text-red-200 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => handleGenerate()}
            disabled={!prompt.trim() || isGenerating}
            className={`w-full h-12 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] ${
              !prompt.trim() || isGenerating
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white shadow-lg shadow-blue-900/20'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Designing...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate Logo
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result Section */}
      {currentImage && (
        <div className="animate-fade-in-up">
           <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
              <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/80">
                <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  Generated Result
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={downloadImage}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
              
              <div className="p-8 flex justify-center items-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-10">
                <div className="relative group max-w-md w-full aspect-square rounded-xl overflow-hidden shadow-2xl border border-slate-600/30">
                  <img
                    src={currentImage.imageUrl}
                    alt={currentImage.prompt}
                    className="w-full h-full object-contain bg-white" 
                  />
                  {/* Overlay for quick actions could go here */}
                </div>
              </div>
              <div className="p-4 bg-slate-900/50 text-xs text-slate-500 font-mono border-t border-slate-800">
                Prompt: {currentImage.prompt}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LogoCreator;
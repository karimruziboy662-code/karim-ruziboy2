import React, { useState } from 'react';
import LogoCreator from './components/LogoCreator';
import Gallery from './components/Gallery';
import { GeneratedImage } from './types';

const App: React.FC = () => {
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  const handleImageGenerated = (newImage: GeneratedImage) => {
    setHistory((prev) => [newImage, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Main Layout */}
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          
          {/* Left Column: Creator */}
          <div className="w-full lg:flex-1">
             <LogoCreator onImageGenerated={handleImageGenerated} />
          </div>

          {/* Right Column: History (Only visible if there is history) */}
          {history.length > 0 && (
             <Gallery images={history} />
          )}
          
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-slate-600 text-sm">
        <p>Powered by Google Gemini Models</p>
      </footer>
    </div>
  );
};

export default App;
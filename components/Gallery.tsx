import React from 'react';
import { GeneratedImage } from '../types';
import { Clock, Download } from 'lucide-react';

interface GalleryProps {
  images: GeneratedImage[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  if (images.length === 0) return null;

  return (
    <div className="w-full lg:w-80 flex-shrink-0 mt-8 lg:mt-0">
      <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-4 sticky top-6">
        <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          History
        </h2>
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
          {images.map((img) => (
            <div key={img.id} className="group bg-slate-900/50 rounded-xl p-2 border border-slate-700/50 hover:border-blue-500/50 transition-all">
              <div className="aspect-square rounded-lg overflow-hidden bg-white mb-2 relative">
                <img
                  src={img.imageUrl}
                  alt={img.prompt}
                  className="w-full h-full object-cover"
                />
                 <a 
                    href={img.imageUrl} 
                    download={`logo-${img.id}.png`}
                    className="absolute bottom-2 right-2 p-1.5 bg-black/70 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                    title="Download"
                 >
                    <Download className="w-3 h-3" />
                 </a>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {img.prompt}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-medium px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">
                  {img.model.includes('flash') ? 'Flash' : 'Pro'}
                </span>
                <span className="text-[10px] text-slate-600">
                    {new Date(img.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
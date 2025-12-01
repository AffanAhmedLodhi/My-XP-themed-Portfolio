import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY_IMAGES } from '@/data/content';

export const GalleryApp = () => {
    const [idx, setIdx] = useState(0);
    const next = () => setIdx((idx + 1) % GALLERY_IMAGES.length);
    const prev = () => setIdx((idx - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);

    return (
        <div className="flex flex-col h-full bg-[#f0f0f0] p-4">
            <div className="bg-white border p-2 shadow-inner flex-1 flex items-center justify-center relative overflow-hidden">
                <img src={GALLERY_IMAGES[idx]} alt="Gallery" className="max-w-full max-h-full object-contain shadow-lg border-4 border-white"/>
                
                <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow">
                    <ChevronLeft size={24}/>
                </button>
                <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow">
                    <ChevronRight size={24}/>
                </button>
            </div>
            <div className="h-12 flex items-center justify-center gap-2 mt-2 shrink-0">
                {GALLERY_IMAGES.map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full cursor-pointer ${i === idx ? 'bg-blue-600 scale-125' : 'bg-gray-400'}`}
                        onClick={() => setIdx(i)}
                    />
                ))}
            </div>
        </div>
    );
};
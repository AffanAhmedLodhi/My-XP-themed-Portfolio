import React, { useEffect } from 'react';

export const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center gap-16 cursor-none">
      <div className="flex flex-col items-center gap-2">
         <div className="grid grid-cols-2 gap-2">
            <div className="w-10 h-10 bg-[#f35325]"></div>
            <div className="w-10 h-10 bg-[#81bc06]"></div>
            <div className="w-10 h-10 bg-[#05a6f0]"></div>
            <div className="w-10 h-10 bg-[#ffba08]"></div>
         </div>
         <h1 className="text-white font-sans text-2xl font-bold mt-4">Microsoft <span className="text-4xl font-light">Windows</span><span className="align-super text-xs text-orange-500 font-bold ml-1">XP</span></h1>
      </div>
      
      <div className="w-48 h-3 border border-gray-600 rounded-[2px] p-[2px] relative overflow-hidden bg-black">
        <div className="h-full w-full flex gap-1 animate-marquee">
           <div className="w-3 h-full bg-blue-600 shadow-[0_0_5px_#3b82f6]"></div>
           <div className="w-3 h-full bg-blue-600 shadow-[0_0_5px_#3b82f6]"></div>
           <div className="w-3 h-full bg-blue-600 shadow-[0_0_5px_#3b82f6]"></div>
        </div>
      </div>
    </div>
  );
};
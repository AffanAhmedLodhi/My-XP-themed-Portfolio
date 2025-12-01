import React from 'react';

export const WinampApp = () => (
    <div className="bg-[#292929] h-full text-green-400 font-mono p-2 flex flex-col justify-between">
       <div className="border border-gray-600 h-16 relative p-1 overflow-hidden bg-black">
         <div className="absolute inset-0 flex items-end gap-0.5 opacity-80">
            {[...Array(30)].map((_,i) => <div key={i} className="flex-1 bg-green-500 animate-pulse" style={{height: `${Math.random()*100}%`}}></div>)}
         </div>
         <span className="relative z-10 text-xs text-white mix-blend-difference">01. INTRO - AFFAN.MP3</span>
       </div>
       <div className="flex justify-between text-xs text-gray-400">
         <span>128 kbps</span>
         <span>00:54</span>
       </div>
       <div className="flex justify-center gap-2 mt-2">
          <button className="text-xs border border-gray-600 px-2 rounded hover:text-white bg-gray-800">PREV</button>
          <button className="text-xs border border-gray-600 px-2 rounded hover:text-white bg-gray-800 text-green-400">PLAY</button>
          <button className="text-xs border border-gray-600 px-2 rounded hover:text-white bg-gray-800">NEXT</button>
       </div>
    </div>
);
import React from 'react';
import { User, Power } from 'lucide-react';
import { PROFILE } from '@/data/content';

export const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div className="h-screen w-full bg-[#003399] flex flex-col relative overflow-hidden">
       <div className="h-24 bg-gradient-to-b from-[#003399] to-[#003399] border-b-2 border-orange-500/50"></div>
       
       <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="w-[1px] h-64 bg-gradient-to-b from-transparent via-white/30 to-transparent mx-12 hidden md:block"></div>
          
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
             <div className="text-white hidden md:block">
                <div className="flex items-end gap-2 mb-4">
                   <div className="grid grid-cols-2 gap-1 transform -rotate-6">
                      <div className="w-6 h-6 bg-[#f35325] rounded-sm"></div>
                      <div className="w-6 h-6 bg-[#81bc06] rounded-sm"></div>
                      <div className="w-6 h-6 bg-[#05a6f0] rounded-sm"></div>
                      <div className="w-6 h-6 bg-[#ffba08] rounded-sm"></div>
                   </div>
                   <span className="text-4xl font-bold italic tracking-tighter">Windows<sup className="text-sm not-italic ml-1">xp</sup></span>
                </div>
                <p className="text-blue-200 text-sm">To begin, click your user name</p>
             </div>

             <div className="flex flex-col gap-4">
                <div 
                  onClick={onLogin}
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-[#ffba08]/20 cursor-pointer group transition-all"
                >
                   <div className="w-16 h-16 rounded border-2 border-white bg-blue-200 overflow-hidden shadow-lg group-hover:border-yellow-300 relative">
                      <img src={PROFILE.avatar} alt="User" className="w-full h-full object-cover"/>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-white text-xl font-light">{PROFILE.name}</span>
                      <span className="text-blue-200 text-xs">Type your password</span>
                   </div>
                </div>
                
                <div className="flex items-center gap-4 p-2 opacity-50 hover:opacity-80 cursor-not-allowed">
                   <div className="w-12 h-12 rounded border-2 border-white bg-gray-300 flex items-center justify-center shadow-lg">
                      <User className="text-gray-500"/>
                   </div>
                   <span className="text-white text-lg font-light">Guest</span>
                </div>
             </div>
          </div>
       </div>

       <div className="h-16 bg-gradient-to-t from-[#001540] to-[#003399] flex justify-between items-center px-8">
          <button className="flex items-center gap-2 text-white hover:text-orange-300 transition-colors">
             <div className="bg-[#e94519] p-1 rounded"><Power size={16}/></div>
             Turn off computer
          </button>
          <div className="text-white/50 text-xs">
             {/* After you log on, you can add or change accounts. */}
             <br/>
             {/* Just go to Control Panel and click User Accounts. */}
          </div>
       </div>
    </div>
  );
};
import React from 'react';
import { Folder, ChevronRight, HardDrive, Globe, Cpu } from 'lucide-react';
import { PROJECTS } from '@/data/content';

export const WorkApp = ({ openApp }: { openApp: (appId: string) => void }) => (
  <div className="flex flex-col h-full bg-white">
    <div className="flex flex-1 overflow-hidden">
      <div className="w-48 bg-gradient-to-b from-[#748aff] to-[#4057d2] p-3 hidden md:block overflow-y-auto shrink-0">
         <div className="mb-4">
            <div className="bg-transparent font-bold text-white text-xs mb-1 px-1 flex items-center gap-1">
               <Folder size={14}/> Project Tasks
            </div>
            <div className="bg-white p-2 rounded-t-[3px] text-[11px] text-[#0e2d58] flex flex-col gap-1">
               <div className="hover:underline cursor-pointer flex items-center gap-1"><ChevronRight size={10} className="text-blue-500"/>View project details</div>
               <div className="hover:underline cursor-pointer flex items-center gap-1"><ChevronRight size={10} className="text-blue-500"/>Download source code</div>
               <div className="hover:underline cursor-pointer flex items-center gap-1"><ChevronRight size={10} className="text-blue-500"/>Share this folder</div>
            </div>
         </div>
         <div className="mb-4">
            <div className="bg-transparent font-bold text-white text-xs mb-1 px-1 flex items-center gap-1">
               <HardDrive size={14}/> Other Places
            </div>
            <div className="bg-white p-2 rounded-t-[3px] text-[11px] text-[#0e2d58] flex flex-col gap-1">
               <div className="hover:underline cursor-pointer flex items-center gap-1" onClick={() => openApp('cv')}>My CV</div>
               <div className="hover:underline cursor-pointer flex items-center gap-1">My Network Places</div>
               <div className="hover:underline cursor-pointer flex items-center gap-1">My Documents</div>
               <div className="hover:underline cursor-pointer flex items-center gap-1">Control Panel</div>
            </div>
         </div>
      </div>

      <div className="flex-1 bg-white p-4 grid grid-cols-3 md:grid-cols-auto-fit content-start gap-4 overflow-auto">
         {PROJECTS.map(p => (
           <div key={p.id} className="group flex flex-col items-center gap-1 cursor-pointer w-24 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded p-1"
             onDoubleClick={() => openApp(p.id)}
           >
              <div className="relative">
                 {p.icon === 'folder' && <Folder size={48} className="text-yellow-400 fill-yellow-400 drop-shadow-sm"/>}
                 {p.icon === 'internet' && <Globe size={42} className="text-blue-500 drop-shadow-sm bg-white rounded-full p-0.5 border border-gray-200"/>}
                 {p.icon === 'chart' && <div className="w-12 h-12 bg-white border border-gray-300 shadow-sm flex items-center justify-center"><Cpu size={32} className="text-green-600"/></div>}
              </div>
              <span className="text-xs text-center group-hover:text-blue-700 font-medium leading-tight">{p.name}</span>
              <span className="text-[10px] text-gray-400 text-center">{p.role}</span>
           </div>
         ))}
      </div>
    </div>
  </div>
);
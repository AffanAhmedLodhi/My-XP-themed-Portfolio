import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PROFILE } from '@/data/content';

export const WelcomeApp = ({ openApp }: { openApp: (appId: string) => void }) => (
    <div className="h-full bg-[#5a7edc] flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#7e9dec] to-transparent"></div>
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full z-10 border-4 border-[#0055ea]">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-yellow-400 rounded border-2 border-orange-300 flex items-center justify-center overflow-hidden">
                   <img src={PROFILE.avatar} alt="Me" className="w-full h-full object-cover"/>
                </div>
                <div>
                   <h1 className="text-2xl font-bold text-[#e66a20] italic">Welcome</h1>
                   <p className="text-gray-600">to {PROFILE.name}'s Portfolio</p>
                </div>
            </div>
            
            <p className="mb-4 text-sm text-gray-800">
               Hi! I am a <strong>{PROFILE.title}</strong> specializing in the Microsoft 365 ecosystem.
               This site is a fully interactive simulation of Windows XP.
            </p>

            <div className="bg-[#f0f0f0] border p-3 rounded mb-4 text-xs">
                <strong>Tips:</strong>
                <ul className="list-disc ml-4 mt-1 space-y-1">
                    <li>Double click on <strong>Desktop Icons</strong>.</li>
                    <li>Drag & Resize windows.</li>
                    <li>Use the <strong>Start Menu</strong> to navigate.</li>
                </ul>
            </div>

            <button 
                className="bg-green-600 text-white px-4 py-1.5 rounded shadow hover:bg-green-500 text-sm font-bold flex items-center gap-2 mx-auto"
                onClick={() => openApp('work')} 
            >
               Start Exploring <ArrowRight size={14}/>
            </button>
        </div>
    </div>
);
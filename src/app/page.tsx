'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Folder, Image as ImageIcon, Trash2, Github, Linkedin, Mail, Globe, Music, File, Power, FileText, ArrowRight, Cpu
} from 'lucide-react';

import { PROFILE } from '@/data/content';
import { playSound } from '@/utils/helpers';
import { BootScreen } from '@/components/os/BootScreen';
import { LoginScreen } from '@/components/os/LoginScreen';
import { Window } from '@/components/os/Window';
import { WelcomeApp } from '@/components/apps/WelcomeApp';
import { WorkApp } from '@/components/apps/WorkApp';
import { GalleryApp } from '@/components/apps/GalleryApp';
import { OutlookApp } from '@/components/apps/OutlookApp';
import { WinampApp } from '@/components/apps/WinampApp';
import { RemoteFaceApp, PowerMatixApp, HexalyzeApp } from '@/components/apps/ExperienceApps';
import { ResumeViewerApp } from '@/components/apps/ResumeViewerApp';
import { AppDefinitions, WindowApp, SystemState } from '@/types';

export default function Desktop() {
  const [systemState, setSystemState] = useState<SystemState>('BOOT');
  const [windows, setWindows] = useState<WindowApp[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  
  // Track if welcome screen has opened
  const [hasWelcomeOpened, setHasWelcomeOpened] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const openApp = useCallback((appId: string) => {
    setStartOpen(false);
    const appDef = APPS[appId];
    if (!appDef) return;

    if (windows.find(w => w.id === appId)) {
      setWindows(prev => prev.map(w => w.id === appId ? { ...w, state: 'OPEN' } : w));
      setActiveId(appId);
      return;
    }
    const newWin: WindowApp = { ...appDef, state: 'OPEN' };
    setWindows(prev => [...prev, newWin]);
    setActiveId(appId);
  }, [windows]); // Added windows dependency

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeId === id) setActiveId(null);
  }, [activeId]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, state: 'MINIMIZED' } : w));
    setActiveId(null);
  }, []);

  // NEW: Toggle Maximize Function
  const toggleMaximize = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
        w.id === id 
        ? { ...w, state: w.state === 'MAXIMIZED' ? 'OPEN' : 'MAXIMIZED' } 
        : w
    ));
    setActiveId(id);
  }, []);

  const focusWindow = useCallback((id: string) => setActiveId(id), []);

  const resizeWindow = useCallback((id: string, w: number, h: number) => {
    setWindows(prev => prev.map(win => 
      win.id === id ? { ...win, size: { w, h } } : win
    ));
  }, []);

  const handleBootComplete = useCallback(() => {
    setSystemState('LOGIN');
  }, []);

  const handleLogin = useCallback(() => {
    playSound('startup');
    setSystemState('DESKTOP');
  }, []);

  const handleShutdown = useCallback(() => {
    playSound('shutdown');
    setSystemState('SHUTDOWN');
    setTimeout(() => setSystemState('BOOT'), 5000); 
  }, []);
  
  useEffect(() => {
    if (systemState === 'DESKTOP' && !hasWelcomeOpened) {
       openApp('welcome');
       setHasWelcomeOpened(true);
    }
  }, [systemState, hasWelcomeOpened, openApp]);

  const APPS: AppDefinitions = useMemo(() => ({
    welcome: {
      id: 'welcome',
      title: 'Welcome',
      iconComp: <div className="w-4 h-4 bg-orange-500 rounded-full border border-white"></div>,
      component: <WelcomeApp openApp={openApp} />,
      size: { w: 600, h: 450 },
      defaultPos: { x: 100, y: 80 },
      hasMenu: false,
      hasToolbar: false,
      status: "Done"
    },
    work: {
      id: 'work',
      title: 'My Experience',
      iconComp: <Folder size={16} className="text-yellow-400 fill-yellow-400"/>,
      component: <WorkApp openApp={openApp} />,
      size: { w: 700, h: 500 },
      hasMenu: true,
      hasToolbar: true,
      status: "3 Objects"
    },
    gallery: {
      id: 'gallery',
      title: 'My Gallery - Windows Picture and Fax Viewer',
      iconComp: <ImageIcon size={16} className="text-blue-500"/>,
      component: <GalleryApp />,
      size: { w: 600, h: 500 },
      hasMenu: true,
      hasToolbar: true,
      status: "Image 1 of 3"
    },
    outlook: {
      id: 'outlook',
      title: 'Outlook Express',
      iconComp: <Mail size={16} className="text-blue-700"/>,
      component: <OutlookApp />,
      size: { w: 700, h: 500 },
      hasMenu: true,
      hasToolbar: false,
      status: "Online"
    },
    winamp: {
      id: 'winamp',
      title: 'Winamp',
      iconComp: <Music size={16} className="text-yellow-600"/>,
      component: <WinampApp />,
      size: { w: 300, h: 150 },
      hasMenu: false,
      hasToolbar: false,
      defaultPos: { x: 200, y: 150 },
      status: "Playing"
    },
    cv: {
        id: 'cv',
        title: 'Affan Ahmed Resume',
        iconComp: <File size={16} className="text-green-600"/>,
        component: <ResumeViewerApp />,
        size: { w: 550, h: 650 },
        defaultPos: { x: 150, y: 50 },
        hasMenu: true,
        hasToolbar: false,
        status: "Online"
    },
    remoteFace: {
        id: 'remoteFace',
        title: 'RemoteFace - Experience Details',
        iconComp: <Globe size={16} className="text-blue-500"/>,
        component: <RemoteFaceApp />,
        size: { w: 650, h: 450 },
        defaultPos: { x: 200, y: 100 },
        hasMenu: true,
        hasToolbar: false,
        status: "RemoteFace.doc"
    },
    powerMatix: {
        id: 'powerMatix',
        title: 'PowerMatix - Experience Details',
        iconComp: <Cpu size={16} className="text-green-600"/>,
        component: <PowerMatixApp />,
        size: { w: 650, h: 450 },
        defaultPos: { x: 250, y: 150 },
        hasMenu: true,
        hasToolbar: false,
        status: "PowerMatix.doc"
    },
    hexalyze: {
        id: 'hexalyze',
        title: 'Hexalyze - Experience Details',
        iconComp: <Folder size={16} className="text-yellow-400 fill-yellow-400"/>,
        component: <HexalyzeApp />,
        size: { w: 650, h: 450 },
        defaultPos: { x: 300, y: 200 },
        hasMenu: true,
        hasToolbar: false,
        status: "Hexalyze.doc"
    }
  }), [openApp]);

  if (systemState === 'BOOT') return <BootScreen onComplete={handleBootComplete} />;
  if (systemState === 'LOGIN') return <LoginScreen onLogin={handleLogin} />;
  if (systemState === 'SHUTDOWN') return <div className="h-screen w-full bg-black flex items-center justify-center text-white font-serif">It is now safe to turn off your computer.</div>;

  return (
    <div 
      className="w-full h-screen overflow-hidden relative select-none font-sans cursor-default"
      style={{ 
        backgroundImage: `url(${PROFILE.wallpaper})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
      onClick={() => setStartOpen(false)}
    >
      {/* 1. Desktop Icons */}
      <div className="absolute top-0 left-0 bottom-8 w-full p-4 flex flex-col flex-wrap content-start gap-6 pointer-events-none z-0">
         {[
           { label: 'My Experience', icon: <Folder size={32} className="text-[#fcebb6] drop-shadow-md fill-[#fcebb6]" stroke="#eab308" />, action: () => openApp(APPS.work.id) },
           { label: 'My Gallery', icon: <div className="w-9 h-9 bg-white border border-gray-300 shadow-md p-1 flex items-center justify-center"><ImageIcon size={24} className="text-pink-500"/></div>, action: () => openApp(APPS.gallery.id) },
           { label: 'Outlook Express', icon: <div className="relative"><Mail size={32} className="text-white drop-shadow-md fill-blue-500"/><div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5"><ArrowRight size={10} className="text-green-600"/></div></div>, action: () => openApp(APPS.outlook.id) },
           { label: 'My CV', icon: <File size={32} className="text-green-600 drop-shadow-md fill-white" />, action: () => openApp(APPS.cv.id) },
           { label: 'Recycle Bin', icon: <Trash2 size={32} className="text-gray-200 drop-shadow-md" />, action: () => {} },
         ].map((icon, i) => (
           <div 
             key={i} 
             className="w-20 flex flex-col items-center gap-1 group pointer-events-auto cursor-pointer" 
             onDoubleClick={icon.action}
           >
             <div className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform group-active:scale-95 opacity-90 group-hover:opacity-100">
               {icon.icon}
             </div>
             <span className="text-white text-xs text-center drop-shadow-[0_1px_2px_rgba(0,0,0,1)] bg-blue-900/0 group-hover:bg-[#0055ea]/60 px-1 rounded line-clamp-2">
               {icon.label}
             </span>
           </div>
         ))}
      </div>

      {/* 2. Windows Layer */}
      {windows.map(w => (
        <Window 
          key={w.id} 
          app={w} 
          isActive={activeId === w.id} 
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={toggleMaximize} // PASSED HERE
          onFocus={focusWindow}
          onResize={resizeWindow}
        />
      ))}

      {/* 3. Start Menu */}
      {startOpen && (
        <div 
          className="absolute bottom-0 left-0 w-80 sm:w-96 h-[450px] z-[1000] rounded-t-lg overflow-hidden flex flex-col shadow-[4px_4px_10px_rgba(0,0,0,0.5)] border-2 border-[#0055ea] origin-bottom-left animate-[slideUp_0.1s_ease-out]"
          style={{ bottom: '30px' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="h-14 bg-gradient-to-b from-[#2257d3] to-[#1240ab] flex items-center px-2 gap-3 border-b-2 border-orange-400 shadow-md">
            <div className="w-10 h-10 rounded border-2 border-white/50 bg-blue-200 overflow-hidden shadow-inner">
               <img src={PROFILE.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <span className="text-white font-bold text-lg drop-shadow-md shadow-black">{PROFILE.name}</span>
          </div>

          <div className="flex-1 bg-white flex">
             <div className="w-1/2 flex flex-col py-2 px-1 gap-1 border-r border-gray-200">
                {[
                  { name: "Internet", sub: "Internet Explorer", icon: <Globe size={24} className="text-blue-500"/>, action: () => openApp(APPS.work.id), bold: true },
                  { name: "E-mail", sub: "Outlook Express", icon: <Mail size={24} className="text-blue-500"/>, action: () => openApp(APPS.outlook.id), bold: true },
                  { sep: true },
                  { name: "My Work", icon: <Folder size={20} className="text-yellow-500 fill-yellow-500"/>, action: () => openApp(APPS.work.id) },
                  { name: "My Gallery", icon: <ImageIcon size={20} className="text-pink-600"/>, action: () => openApp(APPS.gallery.id) },
                  { name: "Winamp", icon: <Music size={20} className="text-yellow-600"/>, action: () => openApp(APPS.winamp.id) },
                ].map((item, i) => (
                   item.sep ? <div key={i} className="h-[1px] bg-gray-200 my-1 mx-2"/> :
                   <div key={i} className="group px-2 py-1 flex items-center gap-2 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm transition-colors" onClick={() => { item.action && item.action(); setStartOpen(false); }}>
                      <div className="filter drop-shadow-sm group-hover:brightness-125">{item.icon}</div>
                      <div className="flex flex-col">
                         <span className={`text-xs text-gray-800 group-hover:text-white ${item.bold ? 'font-bold' : ''}`}>{item.name}</span>
                         {item.sub && <span className="text-[9px] text-gray-400 group-hover:text-blue-100">{item.sub}</span>}
                      </div>
                   </div>
                ))}
                
                <div className="mt-auto px-2 py-2 text-center">
                   <div className="bg-white hover:bg-blue-100 border border-transparent hover:border-blue-200 cursor-pointer py-1 flex justify-center items-center gap-1 font-bold text-[10px] text-gray-700">
                      All Programs <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center text-white text-[8px]">▶</div>
                   </div>
                </div>
             </div>

             <div className="w-1/2 bg-[#d3e5fa] border-l border-[#95bdee] py-2 px-1 flex flex-col gap-1 text-[#00136b] text-xs">
                {[
                  { name: "My Documents", icon: "folder", bold: true, action: () => openApp(APPS.work.id) },
                  { name: "My CV", icon: "doc", action: () => openApp(APPS.cv.id) },
                  { name: "My Pictures", icon: "img", bold: true, action: () => openApp(APPS.gallery.id) },
                  { name: "My Music", icon: "music", bold: true, action: () => openApp(APPS.winamp.id) },
                  { sep: true },
                  { name: "Control Panel", icon: "settings", action: () => {} },
                  { name: "Search", icon: "search", action: () => {} },
                  { name: "Run...", icon: "run", action: () => {} },
                ].map((item, i) => (
                  item.sep ? <div key={i} className="h-[1px] bg-[#95bdee] my-1 mx-2 opacity-50"/> :
                  <div key={i} className="flex items-center gap-2 px-2 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer rounded-sm group" onClick={() => { item.action && item.action(); setStartOpen(false); }}>
                     <div className="w-5 flex justify-center">
                        {item.icon === 'folder' && <Folder size={14} className="text-blue-800 group-hover:text-white"/>}
                        {item.icon === 'doc' && <FileText size={14} className="text-blue-800 group-hover:text-white"/>}
                        {item.icon === 'img' && <ImageIcon size={14} className="text-blue-800 group-hover:text-white"/>}
                        {item.icon === 'music' && <Music size={14} className="text-blue-800 group-hover:text-white"/>}
                        {item.icon === 'settings' && <div className="w-3 h-3 bg-orange-400 rounded-sm"></div>}
                     </div>
                     <span className={`leading-none ${item.bold ? 'font-bold' : ''}`}>{item.name}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="h-9 bg-[#4282d6] border-t border-[#3c81f3] flex justify-end items-center px-2 gap-2">
             <button className="flex items-center gap-1 text-white text-[10px] hover:bg-[#2f71cd] px-2 py-0.5 rounded transition-colors" onClick={() => window.location.reload()}>
               <div className="bg-[#e5a01a] p-0.5 rounded shadow-sm"><Power size={10}/></div> Log Off
             </button>
             <button className="flex items-center gap-1 text-white text-[10px] hover:bg-[#2f71cd] px-2 py-0.5 rounded transition-colors" onClick={handleShutdown}>
               <div className="bg-[#cd3618] p-0.5 rounded shadow-sm"><Power size={10}/></div> Turn Off
             </button>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="absolute bottom-0 w-full h-[30px] bg-gradient-to-b from-[#245dcd] via-[#245dcd] to-[#1e52b7] border-t-2 border-[#3c81f3] flex items-center z-[200]">
        
        <button 
          className={`h-full px-2 md:px-3 flex items-center gap-1 bg-gradient-to-b from-[#3c9e3c] to-[#166a16] rounded-r-xl md:rounded-r-2xl mr-2 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)] hover:brightness-110 active:brightness-90 active:translate-y-[1px] transition-all z-20 ${startOpen ? 'brightness-90 shadow-inner' : ''}`}
          onClick={(e) => { e.stopPropagation(); setStartOpen(!startOpen); }}
        >
          <div className="grid grid-cols-2 gap-0.5 transform -rotate-12 italic opacity-90">
             <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#f35325] rounded-tl-sm"></div>
             <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#81bc06] rounded-tr-sm"></div>
             <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#05a6f0] rounded-bl-sm"></div>
             <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#ffba08] rounded-br-sm"></div>
          </div>
          <span className="text-white font-bold italic text-lg shadow-black drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)] pl-0.5">start</span>
        </button>

        <div className="w-[1px] h-5 bg-[#164392] border-r border-[#4c8ef5] mx-1 opacity-50 hidden md:block"></div>

        <div className="flex-1 flex gap-1 px-1 overflow-x-auto">
           {windows.map(w => (
             <button
               key={w.id}
               className={`h-[22px] min-w-[30px] md:min-w-[140px] max-w-[200px] flex items-center gap-2 px-2 rounded-[2px] text-white text-xs transition-all
                 ${activeId === w.id && w.state !== 'MINIMIZED' 
                   ? 'bg-[#1e52b7] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)]' 
                   : 'bg-[#3c81f3] shadow-[0_1px_2px_rgba(0,0,0,0.3)] hover:bg-[#5394ff]'}`}
               onClick={() => w.state === 'MINIMIZED' ? openApp(w.id) : (activeId === w.id ? minimizeWindow(w.id) : focusWindow(w.id))}
             >
                <div className="shrink-0">{w.iconComp}</div>
                <span className="truncate hidden md:inline">{w.title}</span>
             </button>
           ))}
        </div>

        <div className="h-full bg-[#1290e2] border-l border-[#0d7dc5] pl-2 pr-2 md:pr-4 flex items-center gap-2 text-white text-xs shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]">
            <div className="hidden md:flex gap-1.5">
               <Github size={14} className="hover:text-black cursor-pointer transition-colors" />
               <Linkedin size={14} className="hover:text-blue-900 cursor-pointer transition-colors" />
            </div>
            <div className="w-4 h-4 bg-blue-300 rounded-full border border-blue-500 flex items-center justify-center text-[10px] font-bold text-blue-900 shadow-sm cursor-help">?</div>
            <span className="">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
}
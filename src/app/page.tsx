'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Power, FileText, Folder, Image as ImageIcon, 
  Trash2, Maximize2, Minimize2, X, Minus, Cpu, 
  Github, Linkedin, Mail, Globe, Music, ArrowLeft, 
  ArrowRight, RefreshCw, Home, Search, HardDrive, 
  ChevronLeft, ChevronRight, Send, HelpCircle
} from 'lucide-react';

// --- Type Definitions ---
interface AppConfig {
  id: string;
  title: string;
  iconComp: React.ReactNode;
  component: React.ReactNode;
  size: { w: number; h: number };
  defaultPos?: { x: number; y: number };
  hasMenu: boolean;
  hasToolbar: boolean;
  status: string;
}

interface WindowApp extends AppConfig {
  state: 'OPEN' | 'MINIMIZED';
}

interface AppDefinitions {
  [key: string]: AppConfig;
}

// --- Configuration & Content ---

const PROFILE = {
  name: "Affan Ahmed",
  title: "Software Engineer",
  location: "Karachi, Pakistan",
  email: "affanlodhi2004@gmail.com",
  linkedin: "https://linkedin.com/in/affan-ahmed-43878927b",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Affan&backgroundColor=b6e3f4",
  wallpaper: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop" 
};

const PROJECTS = [
  { 
    id: 1, 
    name: "RemoteFace", 
    role: "Software Engineer", 
    desc: "Platform for remote team management using Next.js & Power Apps.", 
    icon: "internet",
    tags: ["Next.js", "Power Apps", "Node.js"]
  },
  { 
    id: 2, 
    name: "PowerMatix", 
    role: "Software Engineer", 
    desc: "Custom SharePoint solutions & Power BI dashboards.", 
    icon: "chart",
    tags: ["SPFx", "Power BI", "React"]
  },
  { 
    id: 3, 
    name: "Hexalyze", 
    role: "Consultant", 
    desc: "Modern web apps & SharePoint extensions.", 
    icon: "folder",
    tags: ["React", "TypeScript", "PnPjs"]
  },
];

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
];

// --- Sub-Components ---

// 1. Draggable Logic Hook
const useDraggable = (id: string, initialPos: { x: number; y: number }, onFocus: (id: string) => void) => {
  const [pos, setPos] = useState(initialPos);
  const [dragging, setDragging] = useState(false);
  const rel = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    onFocus(id);
    setDragging(true);
    rel.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    };
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      setPos({
        x: e.clientX - rel.current.x,
        y: e.clientY - rel.current.y
      });
    };
    const onMouseUp = () => setDragging(false);

    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, pos.x, pos.y, id, onFocus]);

  return { pos, onMouseDown, dragging };
};

// 2. Window Component (The Frame)
const Window: React.FC<{ app: WindowApp, onClose: (id: string) => void, onMinimize: (id: string) => void, isActive: boolean, onFocus: (id: string) => void }> = ({ app, onClose, onMinimize, isActive, onFocus }) => {
  // Use a stable default position if none is provided
  const defaultPos = useMemo(() => app.defaultPos || { x: 50, y: 50 }, [app.defaultPos]);
  
  const { pos, onMouseDown } = useDraggable(app.id, defaultPos, onFocus);

  if (app.state === 'MINIMIZED') return null;

  return (
    <div 
      className={`absolute flex flex-col rounded-t-lg overflow-hidden shadow-[10px_10px_30px_rgba(0,0,0,0.5)] border-l-[3px] border-r-[3px] border-b-[3px] border-[#0055ea] ${isActive ? 'z-50' : 'z-10'}`}
      style={{ 
        left: pos.x, 
        top: pos.y, 
        width: app.size.w, 
        height: app.size.h,
        backgroundColor: '#ece9d8'
      }}
      onMouseDown={() => onFocus(app.id)}
    >
      {/* Title Bar */}
      <div 
        className={`h-8 flex items-center justify-between px-2 select-none cursor-default
          ${isActive 
            ? 'bg-gradient-to-r from-[#0058ee] via-[#3593ff] to-[#288eff]' 
            : 'bg-gradient-to-r from-[#7697c5] to-[#8faace]'}`}
        onMouseDown={onMouseDown}
      >
        <div className="flex items-center gap-2 text-white font-bold text-sm drop-shadow-md shadow-black">
          {app.iconComp}
          <span className="pt-0.5 drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)]">{app.title}</span>
        </div>
        <div className="flex gap-1" onMouseDown={e => e.stopPropagation()}>
           <button onClick={() => onMinimize(app.id)} className="w-5 h-5 rounded-[3px] bg-[#2d66f4] border border-white/60 hover:brightness-110 flex items-center justify-center shadow-sm">
             <Minus size={12} color="white" strokeWidth={4} className="mt-2"/>
           </button>
           <button className="w-5 h-5 rounded-[3px] bg-[#2d66f4] border border-white/60 hover:brightness-110 flex items-center justify-center shadow-sm opacity-50 cursor-not-allowed">
             <Maximize2 size={12} color="white" strokeWidth={3} />
           </button>
           <button onClick={() => onClose(app.id)} className="w-5 h-5 rounded-[3px] bg-[#e94519] border border-white/60 hover:brightness-110 flex items-center justify-center shadow-sm">
             <X size={14} color="white" strokeWidth={4} />
           </button>
        </div>
      </div>

      {/* Menu Bar (Standard) */}
      {app.hasMenu && (
        <div className="h-6 bg-[#ece9d8] border-b border-[#aca899] flex items-center px-1 text-xs select-none">
          {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map(m => (
            <span key={m} className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer transition-colors">{m}</span>
          ))}
          <div className="ml-auto">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png" className="h-3 opacity-50 grayscale" alt="logo"/>
          </div>
        </div>
      )}

      {/* Toolbar (Optional) */}
      {app.hasToolbar && (
        <div className="bg-[#ece9d8] border-b border-[#aca899] p-1 flex items-center gap-2">
            <div className="flex gap-0.5">
               <button className="flex items-center gap-1 px-1 hover:border border-transparent hover:border-slate-400 rounded-sm disabled:opacity-50 text-black text-xs"><ArrowLeft size={14} className="text-green-600"/> Back</button>
               <button className="flex items-center gap-1 px-1 hover:border border-transparent hover:border-slate-400 rounded-sm text-black text-xs"><ArrowRight size={14} className="text-green-600"/></button>
            </div>
            <div className="h-5 w-[1px] bg-gray-400 mx-1"></div>
            <button className="flex items-center gap-1 px-1 hover:border border-transparent hover:border-slate-400 rounded-sm text-black text-xs"><Search size={14}/> Search</button>
            <button className="flex items-center gap-1 px-1 hover:border border-transparent hover:border-slate-400 rounded-sm text-black text-xs"><Folder size={14}/> Folders</button>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-white relative">
        {app.component}
      </div>
      
      {/* Status Bar */}
      <div className="h-5 bg-[#ece9d8] border-t border-[#aca899] flex items-center px-2 text-[11px] gap-4 text-gray-600 select-none">
          <span>{app.status}</span>
          <span className="border-l border-gray-400 pl-2">My Computer</span>
      </div>
    </div>
  );
};

// 3. Application Content Components

const WelcomeApp: React.FC<{ openApp: (appId: string) => void }> = ({ openApp }) => (
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
                    <li>Drag windows by their <strong>Blue Title Bars</strong>.</li>
                    <li>Use the <strong>Start Menu</strong> to navigate.</li>
                </ul>
            </div>

            <button 
                className="bg-green-600 text-white px-4 py-1.5 rounded shadow hover:bg-green-500 text-sm font-bold flex items-center gap-2 mx-auto"
                onClick={() => openApp('work')} // FIX: Changed to open 'work' app
            >
               Start Exploring <ArrowRight size={14}/>
            </button>
        </div>
    </div>
)

const WorkApp = () => (
  <div className="flex flex-col h-full bg-white">
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="w-48 bg-gradient-to-b from-[#748aff] to-[#4057d2] p-3 hidden md:block overflow-y-auto">
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
               <div className="hover:underline cursor-pointer flex items-center gap-1">My Network Places</div>
               <div className="hover:underline cursor-pointer flex items-center gap-1">My Documents</div>
               <div className="hover:underline cursor-pointer flex items-center gap-1">Control Panel</div>
            </div>
         </div>
         <div className="mb-4">
             <div className="bg-transparent font-bold text-white text-xs mb-1 px-1 flex items-center gap-1">
               <div className="w-4 h-4 bg-white rounded-full text-blue-600 flex items-center justify-center font-bold text-[8px]">?</div> Details
            </div>
            <div className="bg-white p-2 rounded-t-[3px] text-[11px] text-black">
               <p className="font-bold">My Projects</p>
               <p>System Folder</p>
            </div>
         </div>
      </div>

      {/* Files Grid */}
      <div className="flex-1 bg-white p-4 grid grid-cols-3 md:grid-cols-4 content-start gap-4 overflow-auto">
         {PROJECTS.map(p => (
           <div key={p.id} className="group flex flex-col items-center gap-1 cursor-pointer w-24 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded p-1">
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

const GalleryApp = () => {
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
            <div className="h-12 flex items-center justify-center gap-2 mt-2">
                {GALLERY_IMAGES.map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full cursor-pointer ${i === idx ? 'bg-blue-600 scale-125' : 'bg-gray-400'}`}
                        onClick={() => setIdx(i)}
                    />
                ))}
            </div>
        </div>
    )
}

const OutlookApp = () => (
   <div className="flex flex-col h-full bg-white font-sans text-xs">
      <div className="bg-[#ece9d8] p-2 flex items-center gap-4 border-b border-[#aca899] shadow-sm">
         <div className="flex flex-col items-center opacity-100 hover:bg-white/50 cursor-pointer px-2 rounded"><Mail size={24}/><span className="text-[10px] mt-0.5">Send/Recv</span></div>
         <div className="w-[1px] h-8 bg-gray-400 shadow-[1px_0_0_white]"></div>
         <div className="flex flex-col items-center hover:bg-white/50 cursor-pointer px-2 rounded"><FileText size={24}/><span className="text-[10px] mt-0.5">New Mail</span></div>
         <div className="flex flex-col items-center hover:bg-white/50 cursor-pointer px-2 rounded"><RefreshCw size={24}/><span className="text-[10px] mt-0.5">Addresses</span></div>
         <div className="flex flex-col items-center hover:bg-white/50 cursor-pointer px-2 rounded"><Search size={24}/><span className="text-[10px] mt-0.5">Find</span></div>
      </div>
      
      <div className="flex flex-1">
          <div className="w-48 bg-white border-r border-[#aca899] p-2">
              <div className="font-bold text-gray-700 mb-2 flex items-center gap-1"><Folder size={12}/> Local Folders</div>
              <div className="pl-4 space-y-1">
                  <div className="flex items-center gap-2 hover:bg-[#316ac5] hover:text-white px-1 py-0.5 cursor-pointer font-bold">
                      <div className="w-3"><Mail size={10}/></div> Inbox (1)
                  </div>
                  <div className="flex items-center gap-2 hover:bg-[#316ac5] hover:text-white px-1 py-0.5 cursor-pointer">
                      <div className="w-3"><Send size={10}/></div> Outbox
                  </div>
                  <div className="flex items-center gap-2 hover:bg-[#316ac5] hover:text-white px-1 py-0.5 cursor-pointer">
                      <div className="w-3"><Send size={10}/></div> Sent Items
                  </div>
                  <div className="flex items-center gap-2 hover:bg-[#316ac5] hover:text-white px-1 py-0.5 cursor-pointer">
                      <div className="w-3"><Trash2 size={10}/></div> Deleted Items
                  </div>
              </div>
          </div>
          
          <div className="flex-1 flex flex-col bg-white">
              <div className="h-1/2 border-b border-[#aca899] overflow-auto">
                  <table className="w-full text-left border-collapse">
                      <thead className="bg-[#ece9d8] border-b border-[#aca899]">
                          <tr>
                              <th className="px-2 py-0.5 w-6 border-r border-[#aca899] font-normal">!</th>
                              <th className="px-2 py-0.5 border-r border-[#aca899] font-normal">From</th>
                              <th className="px-2 py-0.5 border-r border-[#aca899] font-normal">Subject</th>
                              <th className="px-2 py-0.5 font-normal">Received</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr className="hover:bg-[#316ac5] hover:text-white cursor-pointer bg-gray-100">
                              <td className="px-2 py-0.5 text-center"><Mail size={10} className="inline"/></td>
                              <td className="px-2 py-0.5 font-bold">Affan Ahmed</td>
                              <td className="px-2 py-0.5 font-bold">Welcome to my portfolio!</td>
                              <td className="px-2 py-0.5">Today</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
              <div className="flex-1 p-4 bg-white overflow-auto">
                  <div className="bg-[#ffffe1] border border-[#e2c822] p-2 mb-2 flex items-center gap-2">
                     <HelpCircle size={14} className="text-gray-600"/>
                     <span>To prevent spam, actual email sending is disabled in this demo.</span>
                  </div>
                  <p className="mb-2"><strong>From:</strong> Affan Ahmed &lt;{PROFILE.email}&gt;</p>
                  <p className="mb-4"><strong>Subject:</strong> Job Opportunity</p>
                  <p className="font-serif text-sm">Hello,</p>
                  <p className="font-serif text-sm mt-2">I am currently open to new opportunities in Full Stack Development and the Microsoft Power Platform. Please feel free to reach out!</p>
                  <p className="font-serif text-sm mt-4">Best regards,<br/>Affan</p>
              </div>
          </div>
      </div>
   </div>
);

// 4. Main Desktop Component
export default function Desktop() {
  const [windows, setWindows] = useState<WindowApp[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  // Clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    // Initialize welcome window using the centralized APPS definition
    setWindows([APPS.welcome as WindowApp]); 
    setActiveId('welcome');
    return () => clearInterval(t);
  }, []);

  // Window Management Callbacks
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
  }, [windows]); // Added windows as dependency

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeId === id) setActiveId(null);
  }, [activeId]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, state: 'MINIMIZED' } : w));
    setActiveId(null);
  }, []);

  const focusWindow = useCallback((id: string) => setActiveId(id), []);

  // App Definitions (Memoized)
  const APPS: AppDefinitions = useMemo(() => ({
    welcome: {
      id: 'welcome',
      title: 'Welcome',
      iconComp: <div className="w-4 h-4 bg-orange-500 rounded-full border border-white"></div>,
      // Pass the openApp handler to the Welcome component
      component: <WelcomeApp openApp={openApp} />,
      size: { w: 600, h: 450 },
      defaultPos: { x: 100, y: 80 },
      hasMenu: false,
      hasToolbar: false,
      status: "Done"
    },
    work: {
      id: 'work',
      title: 'My Projects',
      iconComp: <Folder size={16} className="text-yellow-400 fill-yellow-400"/>,
      component: <WorkApp />,
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
      component: (
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
      ),
      size: { w: 300, h: 150 },
      hasMenu: false,
      hasToolbar: false,
      defaultPos: { x: 200, y: 150 },
      status: "Playing"
    }
  }), [openApp]); // Re-memoize if openApp changes

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
           { label: 'My Projects', icon: <Folder size={32} className="text-[#fcebb6] drop-shadow-md fill-[#fcebb6]" stroke="#eab308" />, action: () => openApp(APPS.work.id) },
           { label: 'My Gallery', icon: <div className="w-9 h-9 bg-white border border-gray-300 shadow-md p-1 flex items-center justify-center"><ImageIcon size={24} className="text-pink-500"/></div>, action: () => openApp(APPS.gallery.id) },
           { label: 'Outlook Express', icon: <div className="relative"><Mail size={32} className="text-white drop-shadow-md fill-blue-500"/><div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5"><ArrowRight size={10} className="text-green-600"/></div></div>, action: () => openApp(APPS.outlook.id) },
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
          onFocus={focusWindow}
        />
      ))}

      {/* 3. Start Menu */}
      {startOpen && (
        <div 
          className="absolute bottom-0 left-0 w-80 sm:w-96 h-[450px] z-[1000] rounded-t-lg overflow-hidden flex flex-col shadow-[4px_4px_10px_rgba(0,0,0,0.5)] border-2 border-[#0055ea] origin-bottom-left animate-[slideUp_0.1s_ease-out]"
          style={{ bottom: '30px' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="h-14 bg-gradient-to-b from-[#2257d3] to-[#1240ab] flex items-center px-2 gap-3 border-b-2 border-orange-400 shadow-md">
            <div className="w-10 h-10 rounded border-2 border-white/50 bg-blue-200 overflow-hidden shadow-inner">
               <img src={PROFILE.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <span className="text-white font-bold text-lg drop-shadow-md shadow-black">{PROFILE.name}</span>
          </div>

          {/* Body */}
          <div className="flex-1 bg-white flex">
             {/* Left Column (Pinned) */}
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

             {/* Right Column (System) */}
             <div className="w-1/2 bg-[#d3e5fa] border-l border-[#95bdee] py-2 px-1 flex flex-col gap-1 text-[#00136b] text-xs">
                {[
                  { name: "My Documents", icon: "folder", bold: true, action: () => openApp(APPS.work.id) },
                  { name: "My Recent Documents", icon: "doc", action: () => {} },
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

          {/* Footer */}
          <div className="h-9 bg-[#4282d6] border-t border-[#3c81f3] flex justify-end items-center px-2 gap-2">
             <button className="flex items-center gap-1 text-white text-[10px] hover:bg-[#2f71cd] px-2 py-0.5 rounded transition-colors" onClick={() => window.location.reload()}>
               <div className="bg-[#e5a01a] p-0.5 rounded shadow-sm"><Power size={10}/></div> Log Off
             </button>
             <button className="flex items-center gap-1 text-white text-[10px] hover:bg-[#2f71cd] px-2 py-0.5 rounded transition-colors" onClick={() => setActiveId(null)}>
               <div className="bg-[#cd3618] p-0.5 rounded shadow-sm"><Power size={10}/></div> Turn Off
             </button>
          </div>
        </div>
      )}

      {/* 4. Taskbar */}
      <div className="absolute bottom-0 w-full h-[30px] bg-gradient-to-b from-[#245dcd] via-[#245dcd] to-[#1e52b7] border-t-2 border-[#3c81f3] flex items-center z-[200]">
        
        {/* Start Button */}
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

        {/* Separator */}
        <div className="w-[1px] h-5 bg-[#164392] border-r border-[#4c8ef5] mx-1 opacity-50 hidden md:block"></div>

        {/* Running Apps */}
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

        {/* System Tray */}
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
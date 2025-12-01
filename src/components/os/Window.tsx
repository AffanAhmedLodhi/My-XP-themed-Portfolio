import React, { useMemo, useRef } from 'react';
import { Minus, Square, Copy, X, ArrowLeft, ArrowRight, Search, Folder } from 'lucide-react';
import { useDraggable } from '@/hooks/useDraggable';
import { WindowApp } from '@/types';

interface WindowProps {
  app: WindowApp;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void; // New prop
  onResize: (id: string, w: number, h: number) => void;
  isActive: boolean;
  onFocus: (id: string) => void;
}

export const Window: React.FC<WindowProps> = ({ app, onClose, onMinimize, onMaximize, onResize, isActive, onFocus }) => {
  const isMaximized = app.state === 'MAXIMIZED';
  
  const defaultPos = useMemo(() => app.defaultPos || { x: 50, y: 50 }, [app.defaultPos]);
  
  // We always call the hook, but we conditionally use the handler
  const { pos, onMouseDown } = useDraggable(app.id, defaultPos, onFocus);

  const resizeRef = useRef<{w: number, h: number, x: number, y: number} | null>(null);
  
  const handleResizeStart = (e: React.MouseEvent) => {
    if (isMaximized) return; // Prevent resize if maximized
    e.stopPropagation();
    e.preventDefault();
    resizeRef.current = {
      w: app.size.w,
      h: app.size.h,
      x: e.clientX,
      y: e.clientY
    };
    
    const handleResizeMove = (moveEvent: MouseEvent) => {
      if (!resizeRef.current) return;
      const dx = moveEvent.clientX - resizeRef.current.x;
      const dy = moveEvent.clientY - resizeRef.current.y;
      
      onResize(app.id, 
        Math.max(300, resizeRef.current.w + dx),
        Math.max(200, resizeRef.current.h + dy)
      );
    };

    const handleResizeEnd = () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
      resizeRef.current = null;
    };

    window.addEventListener('mousemove', handleResizeMove);
    window.addEventListener('mouseup', handleResizeEnd);
  };

  if (app.state === 'MINIMIZED') return null;

  return (
    <div 
      className={`absolute flex flex-col rounded-t-lg shadow-[10px_10px_30px_rgba(0,0,0,0.5)] border-l-[3px] border-r-[3px] border-b-[3px] border-[#0055ea] ${isActive ? 'z-50' : 'z-10'} transition-all duration-200 ease-in-out`}
      style={isMaximized ? {
        left: 0,
        top: 0,
        width: '100%',
        height: 'calc(100% - 30px)', // Subtract taskbar height
        backgroundColor: '#ece9d8'
      } : { 
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
        className={`h-8 flex items-center justify-between px-2 select-none cursor-default shrink-0
          ${isActive 
            ? 'bg-gradient-to-r from-[#0058ee] via-[#3593ff] to-[#288eff]' 
            : 'bg-gradient-to-r from-[#7697c5] to-[#8faace]'}`}
        // Only allow dragging if NOT maximized
        onMouseDown={!isMaximized ? onMouseDown : undefined}
        // Double click title bar to toggle maximize
        onDoubleClick={() => onMaximize(app.id)}
      >
        <div className="flex items-center gap-2 text-white font-bold text-sm drop-shadow-md shadow-black overflow-hidden">
          {app.iconComp}
          <span className="pt-0.5 drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)] truncate">{app.title}</span>
        </div>
        <div className="flex gap-1 shrink-0" onMouseDown={e => e.stopPropagation()}>
           <button onClick={() => onMinimize(app.id)} className="w-5 h-5 rounded-[3px] bg-[#2d66f4] border border-white/60 hover:brightness-110 flex items-center justify-center shadow-sm">
             <Minus size={12} color="white" strokeWidth={4} className="mt-2"/>
           </button>
           <button onClick={() => onMaximize(app.id)} className="w-5 h-5 rounded-[3px] bg-[#2d66f4] border border-white/60 hover:brightness-110 flex items-center justify-center shadow-sm">
             {/* Toggle Icon based on state */}
             {isMaximized ? (
                <Copy size={12} color="white" strokeWidth={3} className="transform rotate-90"/> // Poor man's restore icon
             ) : (
                <Square size={12} color="white" strokeWidth={3} />
             )}
           </button>
           <button onClick={() => onClose(app.id)} className="w-5 h-5 rounded-[3px] bg-[#e94519] border border-white/60 hover:brightness-110 flex items-center justify-center shadow-sm">
             <X size={14} color="white" strokeWidth={4} />
           </button>
        </div>
      </div>

      {/* Menu Bar */}
      {app.hasMenu && (
        <div className="h-6 bg-[#ece9d8] border-b border-[#aca899] flex items-center px-1 text-xs select-none shrink-0">
          {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map(m => (
            <span key={m} className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white cursor-pointer transition-colors">{m}</span>
          ))}
          <div className="ml-auto">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png" className="h-3 opacity-50 grayscale" alt="logo"/>
          </div>
        </div>
      )}

      {/* Toolbar */}
      {app.hasToolbar && (
        <div className="bg-[#ece9d8] border-b border-[#aca899] p-1 flex items-center gap-2 shrink-0">
            <div className="flex gap-0.5">
               <button className="flex items-center gap-1 px-1 hover:border border-transparent hover:border-slate-400 rounded-sm disabled:opacity-50 text-black text-xs"><ArrowLeft size={14} className="text-green-600"/> Back</button>
               <button className="flex items-center gap-1 px-1 hover:border border-transparent hover:border-slate-400 rounded-sm text-black text-xs"><ArrowRight size={14} className="text-green-600"/></button>
            </div>
            <div className="h-5 w-[1px] bg-gray-400 mx-1"></div>
            <button className="flex items-center gap-1 px-1 hover:border border-transparent hover:border-slate-400 rounded-sm text-black text-xs"><Search size={14}/> Search</button>
            <button className="flex items-center gap-1 px-1 hover:border border-transparent hover:border-slate-400 rounded-sm text-black text-xs"><Folder size={14}/> Folders</button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-white relative flex flex-col">
        <div className="flex-1 overflow-auto">
           {app.component}
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="h-5 bg-[#ece9d8] border-t border-[#aca899] flex items-center px-2 text-[11px] gap-4 text-gray-600 select-none shrink-0 relative">
          <span>{app.status}</span>
          <span className="border-l border-gray-400 pl-2">My Computer</span>
          
          {/* Resize Grip - Hide if maximized */}
          {!isMaximized && (
            <div 
                className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 flex items-end justify-end p-0.5"
                onMouseDown={handleResizeStart}
            >
                <div className="w-[1px] h-[1px] bg-gray-400 mb-[2px] mr-[2px] shadow-[1px_1px_0_white]"></div>
                <div className="w-[1px] h-[1px] bg-gray-400 mb-[2px] mr-[2px] shadow-[1px_1px_0_white]"></div>
                <div className="w-[1px] h-[1px] bg-gray-400 mb-[2px] mr-[2px] shadow-[1px_1px_0_white]"></div>
            </div>
          )}
      </div>
    </div>
  );
};
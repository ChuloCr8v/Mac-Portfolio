
import { useState, useEffect, useRef, CSSProperties, MouseEvent, ReactNode } from 'react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { WindowState } from '../types';

interface WindowProps {
  window: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  children?: ReactNode;
  isMobile: boolean;
}

export const Window = ({ window, onClose, onMinimize, onMaximize, onFocus, children, isMobile }: WindowProps) => {
  // Local state for position and size to handle dragging and resizing smoothly
  const [pos, setPos] = useState(window.position || { x: 50, y: 50 });
  const [size, setSize] = useState(window.size || { width: 800, height: 600 });
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0, posX: 0, posY: 0 });
  
  const windowRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync props to state if they change externally (e.g. reset)
  useEffect(() => {
    if (window.position) setPos(window.position);
    if (window.size) setSize(window.size);
  }, [window.position, window.size]);

  const handleMouseDown = (e: MouseEvent) => {
    if (window.isMaximized || isMobile) return;
    e.stopPropagation();
    onFocus(window.id);
    setIsDragging(true);
    setDragStart({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    });
  };

  const handleResizeStart = (e: MouseEvent, dir: string) => {
    if (window.isMaximized || isMobile) return;
    e.stopPropagation();
    e.preventDefault();
    onFocus(window.id);
    setIsResizing(true);
    setResizeDir(dir);
    setResizeStart({
        x: e.clientX,
        y: e.clientY,
        w: size.width,
        h: size.height,
        posX: pos.x,
        posY: pos.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (isDragging) {
        // Simple boundary check to keep title bar on screen
        const newX = e.clientX - dragStart.x;
        const newY = Math.max(0, e.clientY - dragStart.y); // Allow reaching top in full screen feel
        setPos({ x: newX, y: newY });
      }

      if (isResizing && resizeDir) {
          const dx = e.clientX - resizeStart.x;
          const dy = e.clientY - resizeStart.y;
          
          let newW = resizeStart.w;
          let newH = resizeStart.h;
          let newX = resizeStart.posX;
          let newY = resizeStart.posY;

          // Min dimensions
          const minW = 400;
          const minH = 300;

          if (resizeDir.includes('e')) {
              newW = Math.max(minW, resizeStart.w + dx);
          }
          if (resizeDir.includes('w')) {
              const intendedW = resizeStart.w - dx;
              if (intendedW >= minW) {
                  newW = intendedW;
                  newX = resizeStart.posX + dx;
              } else {
                  newW = minW;
                  newX = resizeStart.posX + (resizeStart.w - minW);
              }
          }
          if (resizeDir.includes('s')) {
              newH = Math.max(minH, resizeStart.h + dy);
          }
          if (resizeDir.includes('n')) {
              const intendedH = resizeStart.h - dy;
              if (intendedH >= minH) {
                  newH = intendedH;
                  newY = resizeStart.posY + dy;
              } else {
                  newH = minH;
                  newY = resizeStart.posY + (resizeStart.h - minH);
              }
          }

          setSize({ width: newW, height: newH });
          setPos({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDir(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, resizeDir]);

  // Updated Full Screen Logic: Covers entire screen including menu bar
  const baseStyle: CSSProperties = (window.isMaximized || isMobile)
    ? {
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        borderRadius: 0,
      }
    : {
        top: pos.y,
        left: pos.x,
        width: size.width,
        height: size.height,
      };
      
  const minimizeStyle: CSSProperties = window.isMinimized ? {
    transform: 'scale(0.5) translateY(100vh)',
    opacity: 0,
    pointerEvents: 'none',
  } : {
    transform: 'scale(1)',
    opacity: 1,
  };

  const btnSize = isMobile ? "w-6 h-6" : "w-3.5 h-3.5";
  const iconSize = isMobile ? 12 : 9;

  return (
    <div
      ref={windowRef}
      className={`absolute bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col 
        ${window.id === 'terminal' ? 'font-mono' : 'font-sans'} 
        ${!isMobile && !window.isMaximized ? 'rounded-xl' : ''}
        transition-mac ${isMounted ? '' : 'window-enter'}
        group
      `}
      style={{
        ...baseStyle,
        ...minimizeStyle,
        zIndex: window.zIndex,
      }}
      onMouseDown={() => onFocus(window.id)}
    >
      {/* Resize Handles - Invisible but functional */}
      {!window.isMaximized && !isMobile && (
          <>
            <div 
                className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50"
                onMouseDown={(e) => handleResizeStart(e, 'nw')} 
            />
            <div 
                className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-50"
                onMouseDown={(e) => handleResizeStart(e, 'ne')} 
            />
            <div 
                className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50"
                onMouseDown={(e) => handleResizeStart(e, 'sw')} 
            />
            <div 
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50"
                onMouseDown={(e) => handleResizeStart(e, 'se')}
            />

            {/* Edge Resizers */}
            <div className="absolute top-0 left-4 right-4 h-1 cursor-n-resize z-40" onMouseDown={(e) => handleResizeStart(e, 'n')} />
            <div className="absolute bottom-0 left-4 right-4 h-1 cursor-s-resize z-40" onMouseDown={(e) => handleResizeStart(e, 's')} />
            <div className="absolute left-0 top-4 bottom-4 w-1 cursor-w-resize z-40" onMouseDown={(e) => handleResizeStart(e, 'w')} />
            <div className="absolute right-0 top-4 bottom-4 w-1 cursor-e-resize z-40" onMouseDown={(e) => handleResizeStart(e, 'e')} />
          </>
      )}

      {/* Title Bar */}
      <div
        className={`h-10 md:h-11 bg-gray-100/80 dark:bg-gray-800/80 flex items-center px-4 space-x-4 select-none border-b border-gray-200/50 dark:border-white/5 ${isMobile ? '' : 'cursor-default'}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => !isMobile && onMaximize(window.id)}
      >
        <div className="flex space-x-2.5 group/buttons z-10 items-center">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(window.id); }}
            className={`${btnSize} rounded-full bg-[#FF5F56] hover:bg-[#FF5F56]/80 flex items-center justify-center text-red-900/60 transition-colors shadow-sm border border-black/10`}
          >
            <X size={iconSize} className="opacity-0 group-hover/buttons:opacity-100" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(window.id); }}
            className={`${btnSize} rounded-full bg-[#FFBD2E] hover:bg-[#FFBD2E]/80 flex items-center justify-center text-yellow-900/60 transition-colors shadow-sm border border-black/10`}
          >
            <Minus size={iconSize} className="opacity-0 group-hover/buttons:opacity-100" />
          </button>
          {!isMobile && (
            <button
              onClick={(e) => { e.stopPropagation(); onMaximize(window.id); }}
              className={`${btnSize} rounded-full bg-[#27C93F] hover:bg-[#27C93F]/80 flex items-center justify-center text-green-900/60 transition-colors shadow-sm border border-black/10`}
            >
              {window.isMaximized ? <Square size={iconSize} className="opacity-0 group-hover/buttons:opacity-100" /> : <Maximize2 size={iconSize} className="opacity-0 group-hover/buttons:opacity-100" />}
            </button>
          )}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[200px] opacity-90">
                {window.title}
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
      </div>
    </div>
  );
};

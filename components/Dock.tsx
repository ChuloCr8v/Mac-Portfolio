
import { AppID } from '../types';
import { Folder, Terminal as TermIcon, Mail, Code, Globe } from 'lucide-react';
import { ReactNode } from 'react';

interface DockProps {
  onAppClick: (id: AppID) => void;
  openApps: AppID[];
  isAnyWindowMaximized: boolean;
}

const DockItem = ({
  icon,
  label,
  isOpen,
  onClick,
  color
}: {
  icon: ReactNode;
  label: string;
  isOpen: boolean;
  onClick: () => void;
  color: string;
}) => {
  return (
    <div className="group/dock-item relative flex flex-col items-center cursor-pointer" onClick={onClick}>
      {/* Tooltip */}
      <div className="absolute -top-14 bg-gray-800/90 backdrop-blur border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover/dock-item:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl z-50">
        {label}
        {/* Little triangle pointer */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800/90 rotate-45 border-r border-b border-white/20"></div>
      </div>
      
      {/* Icon */}
      <div className={`dock-icon-hover w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-200 md:hover:-translate-y-4 ${color}`}>
        {icon}
      </div>

      {/* Indicator dot */}
      <div className={`w-1 h-1 rounded-full bg-white/80 mt-1.5 transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
    </div>
  );
};

export const Dock = ({ onAppClick, openApps, isAnyWindowMaximized }: DockProps) => {
  return (
    <div className={`absolute bottom-0 left-0 w-full h-24 flex items-end justify-center z-[100] transition-all duration-300 group ${isAnyWindowMaximized ? 'pointer-events-none' : ''}`}>
      {/* Trigger area for hovering when maximized - Increased sensitivity */}
      <div className={`absolute bottom-0 left-0 w-full h-20 z-[100] ${isAnyWindowMaximized ? 'pointer-events-auto' : 'hidden'}`} />

      <div className={`
        mb-2 px-4 pb-3 pt-3 sm:px-6 flex items-end space-x-3 sm:space-x-5 
        bg-gray-200/30 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl
        transform transition-transform duration-300 ease-in-out
        pointer-events-auto
        ${isAnyWindowMaximized ? 'translate-y-[150%] group-hover:translate-y-0' : 'translate-y-0'}
      `}>
        <DockItem 
            icon={<Folder className="w-6 h-6 sm:w-7 sm:h-7" />} 
            label="Finder" 
            isOpen={openApps.includes('finder')} 
            onClick={() => onAppClick('finder')} 
            color="bg-blue-600"
        />
        <DockItem 
            icon={<TermIcon className="w-6 h-6 sm:w-7 sm:h-7" />} 
            label="Terminal" 
            isOpen={openApps.includes('terminal')} 
            onClick={() => onAppClick('terminal')} 
            color="bg-gray-800"
        />
         <DockItem 
            icon={<Mail className="w-6 h-6 sm:w-7 sm:h-7" />} 
            label="Mail" 
            isOpen={openApps.includes('mail')} 
            onClick={() => onAppClick('mail')} 
            color="bg-sky-500"
        />
        <DockItem 
            icon={<Code className="w-6 h-6 sm:w-7 sm:h-7" />} 
            label="VS Code" 
            isOpen={openApps.includes('vscode')} 
            onClick={() => onAppClick('vscode')} 
            color="bg-indigo-600"
        />
        <DockItem 
            icon={<Globe className="w-6 h-6 sm:w-7 sm:h-7" />} 
            label="Safari" 
            isOpen={openApps.includes('safari')} 
            onClick={() => onAppClick('safari')} 
            color="bg-blue-500"
        />
      </div>
    </div>
  );
};

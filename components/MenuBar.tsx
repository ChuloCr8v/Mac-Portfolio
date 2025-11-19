
import { useState, useEffect } from 'react';
import { Wifi, Battery, Moon, Sun, XCircle } from 'lucide-react';

interface MenuBarProps {
    activeAppTitle: string;
    theme: 'dark' | 'light';
    toggleTheme: () => void;
    onCloseAll: () => void;
}

export const MenuBar = ({ activeAppTitle, theme, toggleTheme, onCloseAll }: MenuBarProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000); 
    return () => clearInterval(timer);
  }, []);

  // Helper to format: "Mon Oct 25 10:42 AM"
  const formatDateTime = (date: Date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${dayName} ${monthDay} ${timeStr}`;
  };

  return (
    <div className="h-8 w-full bg-gray-800/30 backdrop-blur-md text-white flex items-center justify-between px-4 text-xs select-none z-40 sticky top-0 shadow-sm border-b border-white/5">
      <div className="flex items-center space-x-4">
        <div className="font-bold text-sm cursor-pointer hover:text-gray-200"></div>
        <div className="font-bold cursor-default">{activeAppTitle}</div>
        <div className="hidden md:flex space-x-3 text-gray-200 font-medium">
            <span className="cursor-pointer hover:text-white">File</span>
            <span className="cursor-pointer hover:text-white">Edit</span>
            <span className="cursor-pointer hover:text-white">View</span>
            <span className="cursor-pointer hover:text-white">Go</span>
            <span className="cursor-pointer hover:text-white">Window</span>
            <span className="cursor-pointer hover:text-white">Help</span>
        </div>
      </div>

      <div className="flex items-center space-x-4 font-medium">
        <button 
            onClick={onCloseAll} 
            className="p-1 rounded hover:bg-red-500/50 hover:text-white transition-colors focus:outline-none text-gray-300"
            title="Close All Windows"
        >
            <XCircle size={14} />
        </button>
        <button 
            onClick={toggleTheme} 
            className="p-1 rounded hover:bg-white/10 transition-colors focus:outline-none"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <div className="hidden sm:block opacity-90"><Wifi size={14} /></div>
        <div className="hidden sm:block opacity-90"><Battery size={14} /></div>
        <div className="cursor-default hover:text-gray-200 transition-colors">
            {formatDateTime(time)}
        </div>
      </div>
    </div>
  );
};

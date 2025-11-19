import React, { useState, useEffect } from "react";
import { MenuBar } from "./components/MenuBar";
import { Dock } from "./components/Dock";
import { Window } from "./components/Window";
import { Finder } from "./components/apps/Finder";
import { Terminal } from "./components/apps/Terminal";
import { Mail } from "./components/apps/Mail";
import { VSCode } from "./components/apps/VSCode";
import { AppID, WindowState } from "./types";
import { RESUME } from "./constants";
import { AlertTriangle, FileText, Github, Linkedin } from "lucide-react";
import "./src/index.css";

// Custom X (Twitter) Icon
const XIcon = ({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const INITIAL_WINDOWS: Record<AppID, WindowState> = {
  finder: {
    id: "finder",
    title: "Finder",
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 55,
    position: { x: 100, y: 80 },
    size: { width: 800, height: 500 },
  },
  terminal: {
    id: "terminal",
    title: "Terminal - zsh",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 54,
    position: { x: 200, y: 150 },
    size: { width: 600, height: 400 },
  },
  mail: {
    id: "mail",
    title: "Mail",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 53,
    position: { x: 150, y: 100 },
    size: { width: 700, height: 500 },
  },
  vscode: {
    id: "vscode",
    title: "Visual Studio Code",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 52,
    position: { x: 50, y: 50 },
    size: { width: 900, height: 600 },
  },
  safari: {
    id: "safari",
    title: "Safari",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 51,
  },
};

const WALLPAPERS = [
  "/1.jpg", // Sierra
  "/2.jpg", // Sierra
  "/3.jpg", // Sierra
  "/4.jpg", // Sierra
];

export const App = () => {
  const [windows, setWindows] =
    useState<Record<AppID, WindowState>>(INITIAL_WINDOWS);
  const [activeAppId, setActiveAppId] = useState<AppID>("finder");
  const [maxZIndex, setMaxZIndex] = useState(60);
  const [isMobile, setIsMobile] = useState(false);
  const [showSafariConfirm, setShowSafariConfirm] = useState(false);
  const [showCloseAllConfirm, setShowCloseAllConfirm] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [wallpaperIndex, setWallpaperIndex] = useState(0);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Wallpaper auto-switch timer
  useEffect(() => {
    // Preload images
    WALLPAPERS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const interval = setInterval(() => {
      setWallpaperIndex((prev) => (prev + 1) % WALLPAPERS.length);
    }, 60000); // Switch every 60 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAppClick = (id: AppID) => {
    if (id === "safari") {
      setShowSafariConfirm(true);
      return;
    }

    setWindows((prev) => {
      const win = prev[id];
      // If already top-most and open/maximized, just do nothing or minimize?
      // macOS behavior: clicking dock icon of active window doesn't minimize usually, but we can leave it.

      const newZ = maxZIndex + 1;
      setMaxZIndex(newZ);

      if (win.isOpen && !win.isMinimized) {
        setActiveAppId(id);
        return { ...prev, [id]: { ...win, zIndex: newZ } };
      }

      if (win.isMinimized) {
        setActiveAppId(id);
        return { ...prev, [id]: { ...win, isMinimized: false, zIndex: newZ } };
      }

      setActiveAppId(id);
      return {
        ...prev,
        [id]: { ...win, isOpen: true, zIndex: newZ, isMinimized: false },
      };
    });
  };

  const handleClose = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id as AppID], isOpen: false },
    }));
  };

  const handleMinimize = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id as AppID], isMinimized: true },
    }));
  };

  const handleMaximize = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id as AppID],
        isMaximized: !prev[id as AppID].isMaximized,
      },
    }));
  };

  const handleFocus = (id: string) => {
    setWindows((prev) => {
      if (prev[id as AppID].zIndex === maxZIndex) return prev;
      const newZ = maxZIndex + 1;
      setMaxZIndex(newZ);
      setActiveAppId(id as AppID);
      return { ...prev, [id]: { ...prev[id as AppID], zIndex: newZ } };
    });
  };

  const handleSafariConfirm = () => {
    window.open(`https://${RESUME.personal.portfolio}`, "_blank");
    setShowSafariConfirm(false);
  };

  const handleCloseAllRequest = () => {
    // Check if any window is open
    const anyOpen = (Object.values(windows) as WindowState[]).some(
      (w) => w.isOpen
    );
    if (anyOpen) {
      setShowCloseAllConfirm(true);
    }
  };

  const confirmCloseAll = () => {
    setWindows((prev) => {
      const next = { ...prev };
      (Object.keys(next) as AppID[]).forEach((key) => {
        next[key] = { ...next[key], isOpen: false, isMinimized: false };
      });
      return next;
    });
    setShowCloseAllConfirm(false);
  };

  const handleDownloadResume = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(RESUME, null, 2)], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "Nkematu_Bonaventure_Resume.json";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderAppContent = (id: AppID) => {
    switch (id) {
      case "finder":
        return <Finder />;
      case "terminal":
        return <Terminal />;
      case "mail":
        return <Mail />;
      case "vscode":
        return <VSCode theme={theme} />;
      default:
        return null;
    }
  };

  const DesktopIcon = ({
    icon,
    label,
    onClick,
    className = "",
  }: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    className?: string;
  }) => (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1.5 cursor-pointer group w-[88px]"
    >
      <div
        className={`p-3 rounded-2xl bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 backdrop-blur-md border border-white/10 shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md ${className}`}
      >
        <div className="transform group-hover:scale-105 transition-transform duration-300">
          {icon}
        </div>
      </div>
      <span className="text-white text-[11px] font-medium tracking-wide text-center leading-tight drop-shadow-md line-clamp-2 select-none px-1.5 py-0.5 rounded-md group-hover:bg-black/20 transition-colors">
        {label}
      </span>
    </div>
  );

  const activeWindow = windows[activeAppId];

  // Check if any window is maximized (to auto-hide dock)
  const isAnyWindowMaximized = (Object.values(windows) as WindowState[]).some(
    (w) => w.isOpen && w.isMaximized && !w.isMinimized
  );

  return (
    <div className={`${theme}`}>
      <div className="w-screen h-screen overflow-hidden relative select-none bg-black">
        {/* Wallpaper Backgrounds with Crossfade */}
        {WALLPAPERS.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === wallpaperIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
            }`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}

        <MenuBar
          activeAppTitle={
            activeWindow?.isOpen && !activeWindow.isMinimized
              ? activeWindow.title
              : "Finder"
          }
          theme={theme}
          toggleTheme={toggleTheme}
          onCloseAll={handleCloseAllRequest}
        />

        {/* Desktop Icons */}
        <div className="absolute top-24 left-6 flex flex-col space-y-6 items-start z-10">
          <DesktopIcon
            icon={
              <div className="w-12 h-14 bg-white rounded-sm relative flex items-center justify-center shadow-lg border border-gray-300">
                <div className="absolute top-0 right-0 border-t-[10px] border-r-[10px] border-t-gray-100 border-r-gray-400 rounded-bl-sm"></div>
                <div className="absolute top-0 right-0 border-t-[10px] border-r-[10px] border-t-transparent border-r-white/50"></div>
                <FileText className="text-gray-500" size={28} />
                <div className="absolute bottom-1.5 text-[7px] font-bold text-gray-400">
                  PDF
                </div>
              </div>
            }
            label="Resume.pdf"
            onClick={handleDownloadResume}
          />

          <DesktopIcon
            icon={
              <div className="bg-[#0077b5] text-white p-2 rounded-xl shadow-lg w-12 h-12 flex items-center justify-center">
                <Linkedin size={28} />
              </div>
            }
            label="LinkedIn"
            onClick={() =>
              window.open(
                `https://linkedin.com/in/nkematu-bonaventure`,
                "_blank"
              )
            }
          />

          <DesktopIcon
            icon={
              <div className="bg-black text-white p-2 rounded-xl shadow-lg border border-white/20 w-12 h-12 flex items-center justify-center">
                <Github size={28} />
              </div>
            }
            label="GitHub"
            onClick={() =>
              window.open(`https://${RESUME.personal.github}`, "_blank")
            }
          />

          <DesktopIcon
            icon={
              <div className="bg-black text-white p-2 rounded-xl shadow-lg border border-white/20 w-12 h-12 flex items-center justify-center">
                <XIcon size={24} />
              </div>
            }
            label="X"
            onClick={() => window.open("https://twitter.com", "_blank")}
          />
        </div>

        {/* Desktop Area - Windows */}
        <div className="relative w-full h-full top-0 left-0 pointer-events-none z-20">
          {(Object.values(windows) as WindowState[]).map(
            (win) =>
              win.isOpen && (
                <div key={win.id} className="pointer-events-auto">
                  <Window
                    window={win}
                    onClose={handleClose}
                    onMinimize={handleMinimize}
                    onMaximize={handleMaximize}
                    onFocus={handleFocus}
                    isMobile={isMobile}
                  >
                    {renderAppContent(win.id)}
                  </Window>
                </div>
              )
          )}
        </div>

        {/* Safari Confirmation Modal */}
        {showSafariConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-white/20 shadow-2xl rounded-xl p-6 w-80 md:w-96 transform scale-100 transition-all text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-2xl mx-auto shadow-md flex items-center justify-center mb-4">
                <AlertTriangle className="text-yellow-500 w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Leaving Portfolio OS
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                You are about to open an external link to{" "}
                <strong>{RESUME.personal.portfolio}</strong>. This will open in
                a new browser tab.
              </p>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setShowSafariConfirm(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSafariConfirm}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-md outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Open Site
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Close All Confirmation Modal */}
        {showCloseAllConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-white/20 shadow-2xl rounded-xl p-6 w-80 md:w-96 transform scale-100 transition-all text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-2xl mx-auto shadow-md flex items-center justify-center mb-4">
                <AlertTriangle className="text-red-500 w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Close All Windows?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                Are you sure you want to close all currently open applications?
                Unsaved work in drafts might be lost.
              </p>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setShowCloseAllConfirm(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCloseAll}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-md outline-none focus:ring-2 focus:ring-red-400"
                >
                  Close All
                </button>
              </div>
            </div>
          </div>
        )}

        <Dock
          onAppClick={handleAppClick}
          openApps={(Object.values(windows) as WindowState[])
            .filter((w) => w.isOpen)
            .map((w) => w.id)}
          isAnyWindowMaximized={isAnyWindowMaximized}
        />
      </div>
    </div>
  );
};

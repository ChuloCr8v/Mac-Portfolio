
import React, { useState, useEffect, useRef } from 'react';
import { RESUME } from '../../constants';
import { FileCode, Search, GitBranch, Zap, User, Briefcase, Mail, Check, Settings, X } from 'lucide-react';

type FileType = 'Bio.md' | 'Experience.json' | 'Skills.ts' | 'Projects.tsx' | 'Contact.json';
type Theme = 'dark' | 'light';

interface VSCodeProps {
    theme: Theme;
}

const FILES: { name: FileType; icon: string; color: string; language: string }[] = [
    { name: 'Bio.md', icon: 'M↓', color: 'text-blue-400', language: 'markdown' },
    { name: 'Experience.json', icon: '{}', color: 'text-yellow-400', language: 'json' },
    { name: 'Skills.ts', icon: 'TS', color: 'text-blue-500', language: 'typescript' },
    { name: 'Projects.tsx', icon: 'TSX', color: 'text-blue-400', language: 'typescript' },
    { name: 'Contact.json', icon: '{}', color: 'text-yellow-400', language: 'json' },
];

export const VSCode = ({ theme }: VSCodeProps) => {
  const [openFiles, setOpenFiles] = useState<FileType[]>(['Bio.md']);
  const [activeFile, setActiveFile] = useState<FileType | null>('Bio.md');
  const [showPalette, setShowPalette] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setShowPalette(true);
      }
      if (e.key === 'Escape') {
        setShowPalette(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (showPalette && inputRef.current) {
        inputRef.current.focus();
    }
  }, [showPalette]);

  const handleOpenFile = (file: FileType) => {
    if (!openFiles.includes(file)) {
        setOpenFiles([...openFiles, file]);
    }
    setActiveFile(file);
    setShowPalette(false);
    setPaletteQuery('');
  };

  const handleCloseFile = (e: React.MouseEvent, file: FileType) => {
    e.stopPropagation();
    const newFiles = openFiles.filter(f => f !== file);
    setOpenFiles(newFiles);
    
    if (activeFile === file) {
        setActiveFile(newFiles.length > 0 ? newFiles[newFiles.length - 1] : null);
    }
  };

  const colors = {
    bg: theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white',
    sidebar: theme === 'dark' ? 'bg-[#252526]' : 'bg-[#f3f3f3]',
    activityBar: theme === 'dark' ? 'bg-[#333333]' : 'bg-[#2c2c2c]',
    activityIcon: theme === 'dark' ? 'text-[#858585]' : 'text-[#777777]',
    activityIconActive: 'text-white',
    tabBg: theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-[#ececec]',
    activeTab: theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white',
    text: theme === 'dark' ? 'text-[#d4d4d4]' : 'text-[#333333]',
    textMuted: theme === 'dark' ? 'text-[#858585]' : 'text-[#666666]',
    border: theme === 'dark' ? 'border-[#333333]' : 'border-[#e5e5e5]',
    hover: theme === 'dark' ? 'hover:bg-[#2a2d2e]' : 'hover:bg-[#e8e8e8]',
    inputBg: theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#e6e6e6]',
    lineNum: theme === 'dark' ? 'text-[#858585]' : 'text-[#237893]',
  };

  // Enhanced Syntax Highlighting Colors
  const sx = {
    k: theme === 'dark' ? 'text-[#569cd6]' : 'text-[#0000ff]', // keyword (blue)
    f: theme === 'dark' ? 'text-[#dcdcaa]' : 'text-[#795e26]', // function (yellow)
    s: theme === 'dark' ? 'text-[#ce9178]' : 'text-[#a31515]', // string (orange/red)
    t: theme === 'dark' ? 'text-[#4ec9b0]' : 'text-[#267f99]', // type (teal)
    c: theme === 'dark' ? 'text-[#6a9955] italic' : 'text-[#008000] italic', // comment (green)
    p: theme === 'dark' ? 'text-[#9cdcfe]' : 'text-[#001080]', // property (light blue)
    n: theme === 'dark' ? 'text-[#b5cea8]' : 'text-[#098658]', // number (light green)
    tag: theme === 'dark' ? 'text-[#569cd6]' : 'text-[#800000]', // tag (blue)
    attr: theme === 'dark' ? 'text-[#9cdcfe]' : 'text-[#ff0000]', // attribute (light blue)
    b: theme === 'dark' ? 'text-[#d4d4d4]' : 'text-[#333333]', // brackets/punctuation
    plain: theme === 'dark' ? 'text-[#d4d4d4]' : 'text-[#333333]', // plain text
  };

  const renderFileContent = (fileName: FileType) => {
    const codeClass = `text-xs md:text-sm font-mono leading-relaxed whitespace-pre-wrap break-words font-normal`;

    switch (fileName) {
      case 'Bio.md':
        return (
            <div className={codeClass}>
                <div>
                    <span className={sx.k}># </span><span className={sx.plain}>{RESUME.personal.name}</span>
                </div>
                <br />
                <div>
                    <span className={sx.k}>## </span><span className={sx.plain}>Summary</span>
                </div>
                <div className={sx.plain}>
                    {RESUME.summary}
                </div>
                <br />
                <div>
                    <span className={sx.k}>## </span><span className={sx.plain}>About Me</span>
                </div>
                <div className={sx.plain}>
                    I am a <span className={sx.s}>{RESUME.personal.title}</span> based in <span className={sx.s}>{RESUME.personal.location}</span>.
                </div>
                <div className={sx.plain}>
                    Passionate about building scalable web applications and clean code.
                </div>
                <br />
                <div>
                    <span className={sx.c}>[GitHub](https://{RESUME.personal.github})</span>
                </div>
                <div>
                    <span className={sx.c}>[Portfolio](https://{RESUME.personal.portfolio})</span>
                </div>
            </div>
        );
      case 'Experience.json':
        return (
            <div className={codeClass}>
                <span className={sx.b}>[</span>
                {RESUME.experience.map((job, i) => (
                    <div key={i} className="pl-4">
                        <span className={sx.b}>{`{`}</span>
                        <div className="pl-4">
                            <span className={sx.p}>"company"</span><span className={sx.b}>: </span><span className={sx.s}>"{job.company}"</span><span className={sx.b}>,</span>
                        </div>
                        <div className="pl-4">
                            <span className={sx.p}>"role"</span><span className={sx.b}>: </span><span className={sx.s}>"{job.role}"</span><span className={sx.b}>,</span>
                        </div>
                        <div className="pl-4">
                            <span className={sx.p}>"period"</span><span className={sx.b}>: </span><span className={sx.s}>"{job.period}"</span><span className={sx.b}>,</span>
                        </div>
                        <div className="pl-4">
                            <span className={sx.p}>"achievements"</span><span className={sx.b}>: [</span>
                            {job.achievements.map((ach, j) => (
                                <div key={j} className="pl-4">
                                    <span className={sx.s}>"{ach.replace(/"/g, '\\"')}"</span><span className={sx.b}>{j < job.achievements.length - 1 ? ',' : ''}</span>
                                </div>
                            ))}
                            <span className={sx.b}>]</span>
                        </div>
                        <span className={sx.b}>{`}`}{i < RESUME.experience.length - 1 ? ',' : ''}</span>
                    </div>
                ))}
                <span className={sx.b}>]</span>
            </div>
        );
      case 'Skills.ts':
        return (
            <div className={codeClass}>
                <div>
                    <span className={sx.k}>export</span> <span className={sx.k}>const</span> <span className={sx.f}>SKILLS</span> <span className={sx.b}>=</span> <span className={sx.b}>{`{`}</span>
                </div>
                <div className="pl-4">
                    <span className={sx.p}>frontend</span><span className={sx.b}>: [</span>
                    <div className="pl-4">
                        {RESUME.skills.frontend.map((s, i) => (
                            <span key={i}><span className={sx.s}>'{s}'</span><span className={sx.b}>{i < RESUME.skills.frontend.length-1 ? ', ' : ''}</span></span>
                        ))}
                    </div>
                    <span className={sx.b}>],</span>
                </div>
                <div className="pl-4">
                    <span className={sx.p}>backend</span><span className={sx.b}>: [</span>
                    <div className="pl-4">
                        {RESUME.skills.backend.map((s, i) => (
                             <span key={i}><span className={sx.s}>'{s}'</span><span className={sx.b}>{i < RESUME.skills.backend.length-1 ? ', ' : ''}</span></span>
                        ))}
                    </div>
                    <span className={sx.b}>],</span>
                </div>
                <div className="pl-4">
                    <span className={sx.p}>tools</span><span className={sx.b}>: [</span>
                    <div className="pl-4">
                        {RESUME.skills.tools.map((s, i) => (
                             <span key={i}><span className={sx.s}>'{s}'</span><span className={sx.b}>{i < RESUME.skills.tools.length-1 ? ', ' : ''}</span></span>
                        ))}
                    </div>
                    <span className={sx.b}>]</span>
                </div>
                <span className={sx.b}>{`};`}</span>
            </div>
        );
      case 'Projects.tsx':
        return (
            <div className={codeClass}>
                <div><span className={sx.k}>import</span> <span className={sx.plain}>React</span> <span className={sx.k}>from</span> <span className={sx.s}>'react'</span><span className={sx.b}>;</span></div>
                <div><span className={sx.k}>import</span> <span className={sx.b}>{`{ ProjectCard }`}</span> <span className={sx.k}>from</span> <span className={sx.s}>'./components'</span><span className={sx.b}>;</span></div>
                <br />
                <div><span className={sx.c}>/** </span></div>
                <div><span className={sx.c}> * My Featured Projects </span></div>
                <div><span className={sx.c}> * Showcasing my work in React, Node.js, and Mobile Development.</span></div>
                <div><span className={sx.c}> */</span></div>
                <div><span className={sx.k}>export const</span> <span className={sx.f}>Projects</span> <span className={sx.b}>= () ={`>`} (</span></div>
                <div className="pl-4">
                    <span className={sx.tag}>&lt;div</span> <span className={sx.attr}>className</span><span className={sx.b}>=</span><span className={sx.s}>"grid grid-cols-1 md:grid-cols-2 gap-6 p-4"</span><span className={sx.tag}>&gt;</span>
                </div>
                {RESUME.projects.map((project, i) => (
                    <div key={i} className="pl-8">
                        <span className={sx.tag}>&lt;ProjectCard</span>
                        <div className="pl-4">
                            <span className={sx.attr}>name</span><span className={sx.b}>=</span><span className={sx.s}>"{project.name}"</span>
                        </div>
                        <div className="pl-4">
                            <span className={sx.attr}>tech</span><span className={sx.b}>=</span><span className={sx.s}>"{project.tech}"</span>
                        </div>
                        <div className="pl-4">
                            <span className={sx.attr}>image</span><span className={sx.b}>=</span><span className={sx.s}>"{project.image}"</span>
                        </div>
                        <div className="pl-4">
                            <span className={sx.attr}>description</span><span className={sx.b}>=</span><span className={sx.b}>{`{[`}</span>
                            {project.description.map((desc, j) => (
                                <div key={j} className="pl-4">
                                    <span className={sx.s}>"{desc.replace(/"/g, '\\"')}"</span><span className={sx.b}>,</span>
                                </div>
                            ))}
                            <span className={sx.b}>{`]}`}</span>
                        </div>
                        <span className={sx.tag}>/&gt;</span>
                    </div>
                ))}
                <div className="pl-4">
                    <span className={sx.tag}>&lt;/div&gt;</span>
                </div>
                <span className={sx.b}>);</span>
            </div>
        );
      case 'Contact.json':
        return (
            <div className={codeClass}>
                <span className={sx.b}>{`{`}</span>
                <div className="pl-4">
                    <span className={sx.p}>"email"</span><span className={sx.b}>: </span><span className={sx.s}>"{RESUME.personal.email}"</span><span className={sx.b}>,</span>
                </div>
                <div className="pl-4">
                    <span className={sx.p}>"phone"</span><span className={sx.b}>: </span><span className={sx.s}>"{RESUME.personal.phone}"</span><span className={sx.b}>,</span>
                </div>
                <div className="pl-4">
                    <span className={sx.p}>"github"</span><span className={sx.b}>: </span><span className={sx.s}>"{RESUME.personal.github}"</span><span className={sx.b}>,</span>
                </div>
                <div className="pl-4">
                    <span className={sx.p}>"linkedin"</span><span className={sx.b}>: </span><span className={sx.s}>"{RESUME.personal.linkedin}"</span><span className={sx.b}>,</span>
                </div>
                <div className="pl-4">
                    <span className={sx.p}>"location"</span><span className={sx.b}>: </span><span className={sx.s}>"{RESUME.personal.location}"</span>
                </div>
                <span className={sx.b}>{`}`}</span>
            </div>
        );
    }
  };

  const renderPlaceholder = () => (
    <div className={`h-full w-full flex flex-col items-center justify-center ${colors.bg} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none overflow-hidden select-none">
             <pre className={`text-[10px] ${colors.text}`}>
                {Array(20).fill(0).map((_, i) => (
                    <div key={i}>{`const line${i} = "code background filler";`}</div>
                ))}
             </pre>
        </div>
        
        <div className="z-10 flex flex-col items-center space-y-8 p-8 max-w-md text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative group cursor-pointer">
                 <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                 <div className={`w-24 h-24 rounded-full ${colors.sidebar} flex items-center justify-center shadow-2xl relative ring-1 ring-white/10`}>
                    <FileCode size={48} className="text-blue-500" />
                 </div>
            </div>
            
            <div>
                <h2 className={`text-2xl font-bold ${colors.text} mb-2`}>{RESUME.personal.name}</h2>
                <div className={`flex items-center justify-center space-x-2 ${colors.textMuted} text-sm`}>
                    <span>VS Code Portfolio</span>
                    <span>•</span>
                    <span>v1.0.0</span>
                </div>
            </div>
        </div>
    </div>
  );

  const ActivityBarItem = ({ icon: Icon, title, onClick, active, customColor }: { icon: any, title: string, onClick?: () => void, active?: boolean, customColor?: boolean }) => (
      <div 
        className={`p-3 cursor-pointer relative group transition-colors ${active ? colors.activityIconActive : (customColor ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') : colors.activityIcon)} hover:text-white`} 
        onClick={onClick}
      >
        <div className={`absolute left-0 top-2 bottom-2 w-0.5 bg-blue-500 rounded-r transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}></div>
        <Icon size={24} strokeWidth={1.5} />
      </div>
  );

  return (
    <div className={`h-full ${colors.bg} flex font-mono text-sm overflow-hidden relative transition-colors duration-300`}>
      
      {/* Command Palette Overlay */}
      {showPalette && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-[1px] flex justify-center pt-4" onClick={() => setShowPalette(false)}>
              <div 
                className={`w-[500px] max-w-[90%] max-h-[300px] ${colors.sidebar} rounded-lg shadow-2xl border ${colors.border} flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100`} 
                onClick={e => e.stopPropagation()}
              >
                  <div className="p-3 border-b border-gray-700/20 flex items-center space-x-3">
                      <Search size={16} className={colors.textMuted} />
                      <input 
                        ref={inputRef}
                        type="text" 
                        placeholder="Search files by name" 
                        className={`bg-transparent border-none outline-none flex-1 ${colors.text} placeholder-gray-500 h-6`}
                        value={paletteQuery}
                        onChange={(e) => setPaletteQuery(e.target.value)}
                      />
                      <div className={`text-xs ${colors.textMuted} border border-gray-600/30 px-1.5 rounded`}>ESC</div>
                  </div>
                  <div className="overflow-y-auto p-1">
                      {FILES.filter(f => f.name.toLowerCase().includes(paletteQuery.toLowerCase())).map((file, i) => (
                          <div 
                            key={file.name}
                            onClick={() => handleOpenFile(file.name)}
                            className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${colors.hover} group`}
                          >
                              <span className={`${file.color} mr-3 w-5 text-center font-bold text-xs`}>{file.icon}</span>
                              <div className="flex-1">
                                  <div className={`${colors.text} font-medium`}>{file.name}</div>
                                  <div className={`text-xs ${colors.textMuted}`}>src/portfolio/</div>
                              </div>
                              {activeFile === file.name && <Check size={14} className="text-blue-500" />}
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* Activity Bar */}
      <div className={`w-12 ${colors.activityBar} flex flex-col items-center py-2 shrink-0 z-20 overflow-visible`}>
        <ActivityBarItem icon={User} title="Bio" onClick={() => handleOpenFile('Bio.md')} active={activeFile === 'Bio.md'} customColor={true} />
        <ActivityBarItem icon={Briefcase} title="Experience" onClick={() => handleOpenFile('Experience.json')} active={activeFile === 'Experience.json'} customColor={true} />
        <ActivityBarItem icon={Zap} title="Skills" onClick={() => handleOpenFile('Skills.ts')} active={activeFile === 'Skills.ts'} customColor={true} />
        <ActivityBarItem icon={FileCode} title="Projects" onClick={() => handleOpenFile('Projects.tsx')} active={activeFile === 'Projects.tsx'} customColor={true} />
        <ActivityBarItem icon={Mail} title="Contact" onClick={() => handleOpenFile('Contact.json')} active={activeFile === 'Contact.json'} customColor={true} />

        <div className="w-6 h-[1px] bg-white/10 my-2 shrink-0"></div>

        <ActivityBarItem icon={Search} title="Search" onClick={() => setShowPalette(true)} />
        <ActivityBarItem icon={GitBranch} title="Source Control" />
        
        <div className="flex-1" />
        
        <ActivityBarItem icon={Settings} title="Settings" />
      </div>

      {/* Sidebar (File Explorer) */}
      <div className={`hidden md:flex w-56 ${colors.sidebar} flex-col border-r ${colors.border}`}>
          <div className={`h-9 flex items-center px-4 text-xs font-medium ${colors.textMuted} tracking-wider`}>EXPLORER</div>
          <div className="flex-1 overflow-y-auto">
            <div className={`px-2 py-1 text-xs font-bold ${colors.text} flex items-center cursor-pointer`}>
                <span className="mr-1">▼</span> PORTFOLIO-OS
            </div>
            <div className="pl-2">
                {FILES.map(file => (
                    <div 
                        key={file.name}
                        onClick={() => handleOpenFile(file.name)}
                        className={`flex items-center px-3 py-1 cursor-pointer ${activeFile === file.name ? 'bg-blue-500/20 text-blue-400' : `${colors.text} hover:${colors.hover}`}`}
                    >
                        <span className={`${file.color} mr-2 w-4 text-center font-bold text-[10px]`}>{file.icon}</span>
                        <span>{file.name}</span>
                    </div>
                ))}
            </div>
          </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-900 overflow-hidden animate-in fade-in duration-300">
        {/* Tabs */}
        <div className={`flex bg-[#252526] overflow-x-auto no-scrollbar`}>
            {openFiles.map(file => (
                <div 
                    key={file}
                    onClick={() => setActiveFile(file)}
                    title={file}
                    className={`
                        flex items-center px-3 py-2.5 text-xs cursor-pointer border-r border-white/5 min-w-fit
                        ${activeFile === file ? `${colors.activeTab} ${colors.text}` : `${colors.tabBg} ${colors.textMuted}`}
                        animate-in slide-in-from-top-1 duration-200
                    `}
                >
                    <span className={`mr-2 ${FILES.find(f => f.name === file)?.color}`}>{FILES.find(f => f.name === file)?.icon}</span>
                    <span>{file}</span>
                    <button 
                        onClick={(e) => handleCloseFile(e, file)}
                        className={`ml-2 p-0.5 rounded-md hover:bg-gray-500/20 ${activeFile === file ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}
                    >
                        <X size={12} />
                    </button>
                </div>
            ))}
        </div>

        {/* Editor Content */}
        <div className={`flex-1 overflow-auto ${colors.bg} p-4 relative custom-scrollbar`}>
            {/* Line Numbers */}
            <div className="absolute left-0 top-4 bottom-0 w-10 text-right pr-3 select-none opacity-50 text-xs font-mono leading-relaxed hidden md:block pointer-events-none">
                {Array(50).fill(0).map((_, i) => (
                    <div key={i} className={colors.lineNum}>{i + 1}</div>
                ))}
            </div>

            <div className="md:pl-10 h-full">
                {activeFile ? renderFileContent(activeFile) : renderPlaceholder()}
            </div>
        </div>
        
        {/* Status Bar */}
        <div className={`h-6 ${colors.activityBar} border-t ${colors.border} flex items-center px-3 text-xs text-white/50 space-x-4`}>
            <div className="flex items-center space-x-1 hover:text-white cursor-pointer">
                <GitBranch size={10} />
                <span>main</span>
            </div>
            <div className="flex-1" />
            <div className="hover:text-white cursor-pointer hidden sm:block">Ln 12, Col 42</div>
            <div className="hover:text-white cursor-pointer hidden sm:block">UTF-8</div>
            <div className="hover:text-white cursor-pointer text-blue-400">{activeFile ? FILES.find(f => f.name === activeFile)?.language.toUpperCase() : 'TXT'}</div>
        </div>
      </div>
    </div>
  );
};

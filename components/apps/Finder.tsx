
import { useState, FC } from 'react';
import { Folder, FileText, User, Briefcase, Code, Layers, ChevronRight } from 'lucide-react';
import { RESUME } from '../../constants';

type FinderView = 'about' | 'experience' | 'projects' | 'skills';

export const Finder = () => {
  const [activeView, setActiveView] = useState<FinderView>('about');

  const renderContent = () => {
    switch (activeView) {
      case 'about':
        return (
          <div className="p-4 md:p-8 text-gray-900 dark:text-gray-200 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-3xl md:text-4xl font-bold text-white shadow-lg shrink-0">
                    {RESUME.personal.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{RESUME.personal.name}</h1>
                    <p className="text-base md:text-lg text-gray-500 dark:text-gray-400">{RESUME.personal.title}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">{RESUME.personal.location}</p>
                </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-white/5 p-4 md:p-6 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm">
                <h2 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">Summary</h2>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300 text-sm md:text-base">{RESUME.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Contact</h3>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li className="break-all">Phone: {RESUME.personal.phone}</li>
                        <li className="break-all">Email: {RESUME.personal.email}</li>
                    </ul>
                </div>
                <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Links</h3>
                    <ul className="space-y-1 text-sm text-blue-600 dark:text-blue-400">
                        <li><a href={`https://${RESUME.personal.github}`} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a></li>
                        <li><a href={`https://${RESUME.personal.portfolio}`} target="_blank" rel="noreferrer" className="hover:underline">Portfolio</a></li>
                    </ul>
                </div>
            </div>
          </div>
        );
      case 'experience':
        return (
            <div className="p-4 md:p-6 space-y-6">
                {RESUME.experience.map((job, idx) => (
                    <div key={idx} className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-4 md:p-6 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-300 shadow-sm" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{job.company}</h3>
                                <p className="text-blue-600 dark:text-blue-400 font-medium">{job.role}</p>
                            </div>
                            <span className="text-xs bg-white/50 dark:bg-white/10 px-2 py-1 rounded text-gray-500 dark:text-gray-400 mt-2 md:mt-0 w-fit">{job.period}</span>
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                            {job.achievements.map((ach, i) => (
                                <li key={i} className="leading-relaxed">{ach}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        );
      case 'projects':
        return (
            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {RESUME.projects.map((proj, idx) => (
                    <div key={idx} className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300 shadow-sm flex flex-col" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="h-40 bg-gray-200 dark:bg-gray-800 overflow-hidden relative group">
                             <img src={proj.image} alt={proj.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                             <div className="absolute bottom-0 left-0 p-4">
                                <h3 className="text-lg font-bold text-white shadow-black drop-shadow-md">{proj.name}</h3>
                             </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <p className="text-xs text-purple-600 dark:text-purple-400 mb-3 font-mono font-semibold">{proj.tech}</p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 text-sm flex-1">
                                {proj.description.map((desc, i) => (
                                    <li key={i}>{desc}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        );
      case 'skills':
        return (
            <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(RESUME.skills).map(([category, items], idx) => (
                        <div key={category} className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-5 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm" style={{ animationDelay: `${idx * 50}ms` }}>
                            <h3 className="text-md font-bold text-gray-800 dark:text-gray-200 capitalize mb-3 border-b border-gray-300 dark:border-white/10 pb-2">
                                {category.replace(/([A-Z])/g, ' $1').trim()}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {items.map(skill => (
                                    <span key={skill} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 rounded-md border border-blue-200 dark:border-blue-500/30">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
  };

  const MenuItem = ({ id, icon: Icon, label }: { id: FinderView; icon: FC<any>; label: string }) => (
    <button
        onClick={() => setActiveView(id)}
        className={`flex-shrink-0 md:flex-shrink flex md:w-full items-center space-x-2 px-3 py-2 rounded-md text-sm transition-all whitespace-nowrap ${
            activeView === id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
    >
        <Icon size={16} />
        <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-full text-gray-900 dark:text-gray-100 flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-48 bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-md border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/10 flex flex-row md:flex-col p-2 md:p-3 md:pt-5 space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto md:overflow-visible no-scrollbar">
        <div className="hidden md:block px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Favorites</div>
        <MenuItem id="about" icon={User} label="About Me" />
        <MenuItem id="experience" icon={Briefcase} label="Experience" />
        <MenuItem id="projects" icon={Code} label="Projects" />
        <MenuItem id="skills" icon={Layers} label="Skills" />
        
        <div className="hidden md:block px-3 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">iCloud</div>
        <div className="hidden md:flex px-3 py-2 text-sm text-gray-400 dark:text-gray-500 items-center space-x-2 opacity-50 cursor-not-allowed">
             <Folder size={16} /> <span>Documents</span>
        </div>
        <div className="hidden md:flex px-3 py-2 text-sm text-gray-400 dark:text-gray-500 items-center space-x-2 opacity-50 cursor-not-allowed">
             <FileText size={16} /> <span>Desktop</span>
        </div>
      </div>

      {/* Main Content View */}
      <div className="flex-1 bg-white dark:bg-gray-900 overflow-y-auto custom-scrollbar relative">
        {/* Breadcrumb-ish header */}
        <div className="h-10 md:h-12 border-b border-gray-200 dark:border-white/10 flex items-center px-4 md:px-6 bg-white/50 dark:bg-gray-800/50 sticky top-0 backdrop-blur-sm z-10 text-xs md:text-sm overflow-hidden">
            <span className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer whitespace-nowrap">Macintosh HD</span>
            <ChevronRight size={14} className="mx-1 md:mx-2 text-gray-400 dark:text-gray-600 shrink-0" />
            <span className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer whitespace-nowrap">Users</span>
            <ChevronRight size={14} className="mx-1 md:mx-2 text-gray-400 dark:text-gray-600 shrink-0" />
            <span className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer whitespace-nowrap hidden sm:inline">nkematubona</span>
            <ChevronRight size={14} className="mx-1 md:mx-2 text-gray-400 dark:text-gray-600 shrink-0 hidden sm:block" />
            <span className="font-medium text-gray-900 dark:text-white capitalize whitespace-nowrap">{activeView}</span>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

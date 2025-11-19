
import { useState, useEffect } from 'react';
import { Mail as MailIcon, Send, Inbox, Star, Trash2, Search, Archive, MoreHorizontal, Paperclip, CheckCircle, Loader2, Plus, AlertCircle, FileText } from 'lucide-react';
import { RESUME } from '../../constants';

const INITIAL_EMAILS = [
    { id: 1, from: 'Recruiter @ TechGiant', subject: 'Senior Frontend Developer Role - Interview', time: '10:42 AM', read: false, avatar: 'bg-green-500', initials: 'TG', body: 'Hi Nkematu,\n\nWe were impressed by your portfolio and experience with React and NestJS. We would like to schedule an interview with you next week.\n\nPlease let us know your availability.\n\nBest,\nHR Team', folder: 'inbox' },
    { id: 2, from: 'GitHub', subject: 'Security alert: New sign-in detected', time: 'Yesterday', read: true, avatar: 'bg-gray-800', initials: 'GH', body: 'We detected a new sign-in to your account from a Mac device. If this was you, you can ignore this email.', folder: 'inbox' },
    { id: 3, from: 'Vercel', subject: 'Your deployment is ready!', time: 'Tue', read: true, avatar: 'bg-black', initials: 'VE', body: 'Project "clever-developer-portfolio" has been successfully deployed to production.\n\nVisit your dashboard to see more details.', folder: 'inbox' },
    { id: 4, from: 'LinkedIn', subject: 'You appeared in 15 searches this week', time: 'Mon', read: true, avatar: 'bg-blue-600', initials: 'LI', body: 'Your profile is getting noticed. See who is looking at your profile.', folder: 'inbox' },
];

type Email = typeof INITIAL_EMAILS[0];

export const Mail = () => {
    const [emails, setEmails] = useState<Email[]>(INITIAL_EMAILS);
    const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
    const [isComposing, setIsComposing] = useState(false);
    const [composeSubject, setComposeSubject] = useState('');
    const [composeBody, setComposeBody] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [notification, setNotification] = useState<{msg: string, type: 'success'|'error'} | null>(null);
    const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'drafts' | 'trash'>('inbox');

    // Load emails from localStorage on mount
    useEffect(() => {
        const storedEmails = localStorage.getItem('portfolio_emails');
        if (storedEmails) {
            try {
                const parsed = JSON.parse(storedEmails);
                // Merge stored sent emails with initial inbox emails to ensure we have both
                // Actually, simple way: just use stored if available, assuming user hasn't cleared cache
                // But to keep fresh initial data, let's filter out initial inbox from stored and re-merge? 
                // Simplest: just use stored if it exists, else initial.
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setEmails(parsed);
                }
            } catch (e) {
                console.error("Failed to load emails", e);
            }
        }
    }, []);

    // Save emails to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('portfolio_emails', JSON.stringify(emails));
    }, [emails]);

    const showNotification = (msg: string, type: 'success'|'error') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSend = () => {
        if (!composeSubject.trim() || !composeBody.trim()) return;
        
        setIsSending(true);
        
        // Simulate network request
        setTimeout(() => {
            // Success
            const newEmail: Email = {
                id: Date.now(),
                from: 'Me',
                subject: composeSubject,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                read: true,
                avatar: 'bg-blue-600',
                initials: 'ME',
                body: composeBody,
                folder: 'sent'
            };

            setEmails(prev => [newEmail, ...prev]);
            setIsSending(false);
            showNotification("Message Sent Successfully", "success");
            setComposeSubject('');
            setComposeBody('');
            
            setTimeout(() => {
                setIsComposing(false);
                setActiveFolder('sent'); // Switch to sent view
                setSelectedEmail(newEmail.id); // Select the new email
            }, 1000);

        }, 1500);
    };

    const handleDraft = () => {
        if (!composeSubject.trim() && !composeBody.trim()) {
             setIsComposing(false);
             return;
        }
        
        const draftEmail: Email = {
            id: Date.now(),
            from: 'Me',
            subject: composeSubject || '(No Subject)',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: true,
            avatar: 'bg-gray-400',
            initials: 'ME',
            body: composeBody,
            folder: 'drafts'
        };
        
        setEmails(prev => [draftEmail, ...prev]);
        showNotification("Message Saved to Drafts", "success");
        setIsComposing(false);
        setComposeSubject('');
        setComposeBody('');
        setActiveFolder('drafts');
    };

    const filteredEmails = emails.filter(e => e.folder === activeFolder);
    const activeEmail = selectedEmail ? emails.find(e => e.id === selectedEmail) : null;

    const handleComposeClick = () => {
        setSelectedEmail(null);
        setIsComposing(true);
    };

    const handleBackToList = () => {
        setSelectedEmail(null);
        if (isComposing) handleDraft(); // Auto-save draft on back? Or just cancel. Let's just cancel for simplicity in UI but maybe prompt.
        setIsComposing(false);
    };

    return (
        <div className="flex h-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex-col md:flex-row font-sans relative overflow-hidden">
            
            {/* Notification Toast */}
            {notification && (
                <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 animate-in slide-in-from-top-4 fade-in duration-300 ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {notification.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    <span className="text-sm font-medium">{notification.msg}</span>
                </div>
            )}

            {/* Sidebar - Mailboxes */}
            <div className="hidden md:flex w-48 bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-md border-r border-gray-200 dark:border-white/10 flex-col pt-2 text-sm">
                <div className="px-4 py-2 text-gray-400 dark:text-gray-500 font-semibold text-xs uppercase tracking-wider">Mailboxes</div>
                <div className="flex-1 space-y-0.5 px-2">
                    <div 
                        onClick={() => { setActiveFolder('inbox'); setSelectedEmail(null); setIsComposing(false); }}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${activeFolder === 'inbox' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/5'}`}
                    >
                        <div className="flex items-center space-x-2">
                            <Inbox size={16} /> <span>Inbox</span>
                        </div>
                        {emails.filter(e => e.folder === 'inbox' && !e.read).length > 0 && (
                             <span className="text-xs font-bold bg-blue-500 text-white px-1.5 rounded-full">{emails.filter(e => e.folder === 'inbox' && !e.read).length}</span>
                        )}
                    </div>
                    <div 
                        onClick={() => { setActiveFolder('sent'); setSelectedEmail(null); setIsComposing(false); }}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-md cursor-pointer transition-colors ${activeFolder === 'sent' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/5'}`}
                    >
                        <Send size={16} /> <span>Sent</span>
                    </div>
                    <div 
                        onClick={() => { setActiveFolder('drafts'); setSelectedEmail(null); setIsComposing(false); }}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-md cursor-pointer transition-colors ${activeFolder === 'drafts' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/5'}`}
                    >
                        <FileText size={16} /> <span>Drafts</span>
                         {emails.filter(e => e.folder === 'drafts').length > 0 && (
                             <span className="text-xs font-bold ml-auto text-gray-400">{emails.filter(e => e.folder === 'drafts').length}</span>
                        )}
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/5 rounded-md cursor-pointer transition-colors opacity-50">
                        <Trash2 size={16} /> <span>Trash</span>
                    </div>
                </div>
            </div>

            {/* Email List */}
            <div className={`w-full md:w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-white/10 flex flex-col ${(selectedEmail || isComposing) ? 'hidden md:flex' : 'flex'} animate-in slide-in-from-left-4 duration-300`}>
                <div className="p-3 border-b border-gray-200 dark:border-white/10 flex flex-col space-y-2">
                     <div className="flex items-center justify-between px-1">
                         <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 capitalize">{activeFolder}</h2>
                         <button onClick={handleComposeClick} className="md:hidden p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-lg">
                            <Plus size={18} />
                         </button>
                     </div>
                     <div className="relative">
                        <Search size={14} className="absolute left-2.5 top-1.5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search" 
                            className="w-full bg-gray-100 dark:bg-gray-800 rounded-md pl-8 pr-2 py-1 text-sm outline-none focus:bg-white dark:focus:bg-gray-700 focus:ring-1 focus:ring-blue-300 transition-all dark:text-gray-200" 
                        />
                     </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                     {filteredEmails.length === 0 ? (
                         <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center">
                            <Inbox size={32} className="mb-2 opacity-20" />
                            No messages
                         </div>
                     ) : (
                        filteredEmails.map(email => (
                            <div 
                                key={email.id}
                                onClick={() => { setSelectedEmail(email.id); setIsComposing(false); }}
                                className={`p-3 border-b border-gray-100 dark:border-white/5 cursor-pointer transition-colors group ${selectedEmail === email.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-50 dark:hover:bg-white/5 bg-white dark:bg-gray-900'}`}
                            >
                                <div className="flex justify-between items-baseline mb-1">
                                    <div className="flex items-center space-x-2 overflow-hidden">
                                        {!email.read && email.folder === 'inbox' && (
                                            <div className={`w-2 h-2 rounded-full bg-blue-500 shrink-0 ${selectedEmail === email.id ? 'bg-white' : ''}`}></div>
                                        )}
                                        <span className={`font-semibold truncate text-sm ${selectedEmail === email.id ? 'text-white' : 'text-gray-900 dark:text-gray-200'}`}>{email.from}</span>
                                    </div>
                                    <span className={`text-xs shrink-0 ${selectedEmail === email.id ? 'text-blue-100' : 'text-gray-400'}`}>{email.time}</span>
                                </div>
                                <div className={`text-xs font-medium truncate mb-0.5 ${selectedEmail === email.id ? 'text-blue-50' : 'text-gray-700 dark:text-gray-400'}`}>{email.subject}</div>
                                <div className={`text-xs truncate ${selectedEmail === email.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-500'}`}>{email.body}</div>
                            </div>
                        ))
                     )}
                </div>
            </div>

            {/* Reading Pane / Compose */}
            <div className={`flex-1 flex flex-col bg-white dark:bg-gray-900 overflow-hidden ${(selectedEmail || isComposing) ? 'flex' : 'hidden md:flex'}`}>
                {/* Mobile Back Button */}
                <div className="md:hidden p-3 border-b border-gray-200 dark:border-white/10 flex items-center text-blue-500 cursor-pointer" onClick={handleBackToList}>
                    <div className="flex items-center space-x-1">
                        <span>‹</span>
                        <span className="font-medium">{activeFolder}</span>
                    </div>
                </div>

                {isComposing ? (
                    // Compose View
                    <div className="h-full flex flex-col relative animate-in fade-in duration-300">
                         <div className="border-b border-gray-200 dark:border-white/10 px-4 py-3 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">New Message</span>
                            <div className="flex space-x-3">
                                <button onClick={handleDraft} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" title="Save to Drafts">
                                    <FileText size={18} />
                                </button>
                            </div>
                         </div>
                         <div className="p-4 space-y-4 border-b border-gray-200 dark:border-white/10">
                            <div className="flex space-x-3 items-center">
                                <span className="text-gray-500 text-sm w-12 text-right font-medium">To:</span>
                                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-sm truncate flex items-center space-x-1">
                                    <span>Nkematu Bonaventure</span>
                                    <span className="opacity-50 text-xs">&lt;{RESUME.personal.email}&gt;</span>
                                </div>
                            </div>
                            <div className="flex space-x-3 items-center">
                                <span className="text-gray-500 text-sm w-12 text-right font-medium">Subject:</span>
                                <input 
                                    type="text" 
                                    className="flex-1 outline-none bg-transparent text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400" 
                                    placeholder="Enter subject..." 
                                    value={composeSubject}
                                    onChange={(e) => setComposeSubject(e.target.value)}
                                    disabled={isSending}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <textarea 
                            className="flex-1 p-6 outline-none resize-none text-sm leading-relaxed bg-transparent text-gray-800 dark:text-gray-200 font-sans" 
                            placeholder="Write your message here..."
                            value={composeBody}
                            onChange={(e) => setComposeBody(e.target.value)}
                            disabled={isSending}
                        ></textarea>
                        <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-end bg-gray-50 dark:bg-gray-800 items-center space-x-4">
                            <button onClick={handleDraft} className="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">Cancel</button>
                            <button 
                                onClick={handleSend} 
                                disabled={isSending || !composeSubject || !composeBody}
                                className={`flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-sm transition-all text-sm font-medium ${isSending || !composeSubject || !composeBody ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                <span>{isSending ? 'Sending...' : 'Send'}</span>
                            </button>
                        </div>
                    </div>
                ) : selectedEmail && activeEmail ? (
                    // Viewing Email
                    <div className="flex flex-col h-full animate-in fade-in duration-300">
                        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{activeEmail.subject}</h2>
                                <div className="flex space-x-3 text-gray-400">
                                    <Archive size={18} className="hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer transition-colors" />
                                    <Trash2 size={18} className="hover:text-red-500 cursor-pointer transition-colors" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 rounded-full ${activeEmail.avatar} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                                    {activeEmail.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm text-gray-900 dark:text-white">{activeEmail.from}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">To: Me &lt;{RESUME.personal.email}&gt;</div>
                                </div>
                                <div className="text-xs text-gray-400">{activeEmail.time}</div>
                            </div>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap selection:bg-blue-100 dark:selection:bg-blue-900">
                            {activeEmail.body}
                            {activeEmail.folder === 'inbox' && (
                                <>
                                    <div className="w-full h-px bg-gray-100 dark:bg-white/5 my-8"></div>
                                    <div className="text-gray-400 text-xs italic">Sent from my iPhone</div>
                                </>
                            )}
                        </div>
                        {/* Quick Reply Bar */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-white/10">
                            <button 
                                onClick={() => { 
                                    setComposeSubject(`Re: ${activeEmail.subject}`); 
                                    setComposeBody(`\n\nOn ${activeEmail.time}, ${activeEmail.from} wrote:\n> ${activeEmail.body.replace(/\n/g, '\n> ')}`);
                                    setSelectedEmail(null); 
                                    setIsComposing(true); 
                                }} 
                                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center space-x-2 transition-colors"
                            >
                               <Send size={16} className="rotate-180" /> <span>Reply</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    // Default Empty State
                    <div className="h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-600">
                         <MailIcon size={64} strokeWidth={1} className="mb-4" />
                         <p className="text-sm font-medium">No Message Selected</p>
                    </div>
                )}
            </div>
        </div>
    );
};

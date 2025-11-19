
import { useState, useEffect, useRef, ReactNode } from 'react';
import { RESUME } from '../../constants';

export const Terminal = () => {
  const [history, setHistory] = useState<Array<{ type: 'input' | 'output'; content: string | ReactNode }>>([
    { type: 'output', content: 'Last login: ' + new Date().toUTCString() + ' on ttys000' },
    { type: 'output', content: 'Welcome to Nkematu-OS v1.0. Type "help" to see available commands.' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    const newHistory = [...history, { type: 'input', content: cmd } as const];

    let output: ReactNode = '';

    switch (cleanCmd) {
      case 'help':
        output = (
          <div className="text-yellow-300">
            Available commands:
            <br />  <span className="text-white font-bold">ls</span> - List directory contents
            <br />  <span className="text-white font-bold">about</span> - Display profile summary
            <br />  <span className="text-white font-bold">skills</span> - List technical skills
            <br />  <span className="text-white font-bold">contact</span> - Show contact info
            <br />  <span className="text-white font-bold">projects</span> - List major projects
            <br />  <span className="text-white font-bold">clear</span> - Clear the terminal
            <br />  <span className="text-white font-bold">sudo rm -rf /</span> - Don't try this at home
          </div>
        );
        break;
      case 'ls':
        output = (
          <div className="flex flex-wrap gap-4 font-bold">
            <span className="text-blue-400">Bio.md</span>
            <span className="text-yellow-400">Experience.json</span>
            <span className="text-blue-500">Skills.ts</span>
            <span className="text-blue-400">Projects.tsx</span>
            <span className="text-yellow-400">Contact.json</span>
          </div>
        );
        break;
      case 'about':
        output = RESUME.summary;
        break;
      case 'skills':
        output = (
            <div>
                <div className="text-green-400 font-bold">Frontend:</div> {RESUME.skills.frontend.join(', ')}
                <div className="text-green-400 font-bold mt-2">Backend:</div> {RESUME.skills.backend.join(', ')}
                <div className="text-green-400 font-bold mt-2">Tools:</div> {RESUME.skills.tools.join(', ')}
            </div>
        );
        break;
      case 'contact':
        output = (
            <div>
                Email: <a href={`mailto:${RESUME.personal.email}`} className="underline text-blue-400">{RESUME.personal.email}</a><br/>
                GitHub: <a href={`https://${RESUME.personal.github}`} className="underline text-blue-400" target="_blank" rel="noreferrer">{RESUME.personal.github}</a><br/>
                Phone: {RESUME.personal.phone}
            </div>
        );
        break;
      case 'projects':
        output = (
            <ul className="list-disc pl-4">
                {RESUME.projects.map(p => (
                    <li key={p.name}>
                        <span className="text-purple-400 font-bold">{p.name}</span>: {p.tech}
                    </li>
                ))}
            </ul>
        );
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'sudo rm -rf /':
        output = <span className="text-red-500 font-bold">Permission denied: You are not root! Nice try though.</span>;
        break;
      case '':
        output = '';
        break;
      default:
        output = `Command not found: ${cleanCmd}. Type 'help' for options.`;
    }

    if (output) {
        newHistory.push({ type: 'output', content: output });
    }
    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="h-full bg-[#1C1C1E] p-4 text-sm font-mono overflow-y-auto text-gray-300" onClick={() => document.getElementById('term-input')?.focus()}>
      {history.map((item, idx) => (
        <div key={idx} className="mb-1 break-words">
          {item.type === 'input' ? (
            <div>
              <span className="text-green-500 mr-2">➜</span>
              <span className="text-blue-400 mr-2">~</span>
              <span className="text-white">{item.content}</span>
            </div>
          ) : (
            <div className="pl-0">{item.content}</div>
          )}
        </div>
      ))}
      <div className="flex items-center">
        <span className="text-green-500 mr-2">➜</span>
        <span className="text-blue-400 mr-2">~</span>
        <input
          id="term-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
          className="bg-transparent border-none outline-none flex-1 text-white"
          autoFocus
          autoComplete="off"
        />
      </div>
      <div ref={endRef} />
    </div>
  );
};

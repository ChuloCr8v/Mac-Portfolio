export type AppID = 'finder' | 'terminal' | 'vscode' | 'mail' | 'safari';

export interface WindowState {
  id: AppID;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export interface ResumeData {
  personal: {
    name: string;
    title: string;
    phone: string;
    email: string;
    github: string;
    linkedin: string;
    portfolio: string;
    location: string;
  };
  summary: string;
  skills: {
    frontend: string[];
    backend: string[];
    database: string[];
    stateManagement: string[];
    tools: string[];
    softSkills: string[];
  };
  experience: {
    company: string;
    role: string;
    period: string;
    achievements: string[];
  }[];
  projects: {
    name: string;
    tech: string;
    description: string[];
    image: string;
  }[];
}
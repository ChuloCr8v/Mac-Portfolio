import { ResumeData } from './types';

export const RESUME: ResumeData = {
  personal: {
    name: "Nkematu Bonaventure",
    title: "Senior Frontend Developer",
    phone: "+2348138369977",
    email: "nkematubona@gmail.com",
    github: "github.com/chulocr8v",
    linkedin: "Nkematu Bonaventure",
    portfolio: "cleverdeveloper360.vercel.app",
    location: "Lagos/Nigeria"
  },
  summary: "Frontend Developer with 5+ years of experience building scalable web and mobile applications using React, TypeScript, and NestJS. Skilled in delivering efficient solutions across both remote and onsite teams, with a strong focus on clean code, problem-solving, and teamwork.",
  skills: {
    frontend: ["JavaScript", "TypeScript", "React", "Next.js", "React Native", "Tailwind CSS", "Bootstrap", "HTML", "SCSS"],
    backend: ["Node.js", "Express.js", "NestJS"],
    database: ["PostgreSQL", "Prisma ORM", "MongoDB"],
    stateManagement: ["Redux Toolkit"],
    tools: ["Git", "GitHub", "Postman", "Figma", "Firebase", "Jest"],
    softSkills: ["Collaboration", "Problem-Solving", "Time Management", "Leadership", "Emotional Intelligence"]
  },
  experience: [
    {
      company: "Zoracom",
      role: "Front-End Developer",
      period: "2021 - Present",
      achievements: [
        "Built a customer support platform with React, TypeScript, and Ant Design, reducing ticket resolution time by 35% and improving customer satisfaction by 15%.",
        "Developed a telecom observability dashboard with React, Typescript, and Redux Toolkit in a 5-person team, improving client data insights and management efficiency by 60%.",
        "Redesigned a CRM interface with React and Ant Design, implementing RTK Query for data management, which increased load speed by 30% and user engagement by 25%.",
        "Contributed to a vendor management system built with React and TypeScript, automating vendor selection and accelerating project delivery by 40%.",
        "Created a real-time POS analytics dashboard with React, Tailwind CSS, and Redux Toolkit, delivering live visibility into key operational metrics.",
        "Led the design and development of an employee management system, cutting excess paperwork by 90%.",
        "Developed a React Native mobile application for field task management, enhancing operational efficiency by 40%.",
        "Mentored two junior developers, providing technical guidance leading to full-time employment."
      ]
    }
  ],
  projects: [
    {
      name: "Sugbox Digital Suggestion Box",
      tech: "React, TypeScript, NestJS, MongoDB, Prisma",
      description: [
        "Built a web application for collecting and managing team suggestions, enabling real-time feedback loops.",
        "Designed a scalable backend with NestJS and MongoDB, implementing Prisma ORM.",
        "Created a user-friendly interface with React and TypeScript, integrating authentication and role-based access."
      ],
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop&q=60"
    },
    {
      name: "Food Delivery Platform",
      tech: "React, TypeScript, NestJS, React Native, Redux Toolkit, Tailwind CSS",
      description: [
        "Developed a complete delivery platform consisting of an admin dashboard, vendor mobile app, customer mobile app, and rider mobile app.",
        "Implemented vendor and product management, order tracking, and delivery assignment workflows.",
        "Delivered modern, intuitive UIs with React (web) and React Native (mobile), styled with Tailwind CSS."
      ],
      image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=500&auto=format&fit=crop&q=60"
    }
  ]
};
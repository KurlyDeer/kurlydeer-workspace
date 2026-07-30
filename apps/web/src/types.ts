export interface Project {
  id: string;
  title: string;
  description: string;
  category: "Full-Stack" | "AI & Labs" | "Systems & CLI" | "Hardware & IoT" | "Misc";
  status: "In Progress" | "Completed" | "Prototyping" | "Research";
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  createdAt: string;
  readme?: string; // Optional detailed writeup
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  difficulty: "Introductory" | "Intermediate" | "Advanced" | "Expert";
  author: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

import { Project, BlogPost } from "../types";

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj_1",
    title: "Core Switch Network Migration",
    description: "A major enterprise-grade network infrastructure upgrade involving the deployment and configuration of Cisco Catalyst 9500 core switches.",
    category: "Networking",
    status: "Completed",
    technologies: ["Cisco Catalyst 9500", "Enterprise Routing", "Switching", "VLAN Management"],
    createdAt: "2026-01-15",
    readme: `# Core Switch Network Migration

### Overview
This project involved a comprehensive migration of a legacy core network infrastructure to modern Cisco Catalyst 9500 hardware. The primary goal was to increase backplane bandwidth, ensure high availability, and secure routing protocols across the enterprise.

### Technical Achievements
- Configured StackWise Virtual for Catalyst 9500 to ensure seamless high-availability redundancy.
- Migrated legacy Layer 2/Layer 3 topologies to a robust OSPF-driven routing architecture.
- Implemented strict QoS policies and access control lists (ACLs) to secure inter-VLAN routing and optimize critical traffic.
`
  },
  {
    id: "proj_2",
    title: "Silo - Personal Finance Manager",
    description: "A comprehensive personal finance and budgeting tool built with a focus on a sleek, modern UI and smooth user experience.",
    category: "Full-Stack Mobile",
    status: "Completed",
    technologies: ["Flutter", "Dart", "Python", "REST API"],
    githubUrl: "https://github.com/example/silo",
    createdAt: "2025-11-20",
    readme: `# Silo - Personal Finance & Budgeting

### Overview
Silo is a financial tracking tool designed to make budgeting effortless and visually appealing. It leverages a modern frontend to provide insightful graphs and categorized spending analytics.

### Architecture
- **Frontend**: Built with Flutter for smooth cross-platform mobile performance.
- **Backend**: Python-based REST API handling authentication, transaction logic, and data aggregation.
- **Design**: Implements a glassmorphic aesthetic with fluid micro-animations to enhance user engagement during data entry.
`
  },
  {
    id: "proj_3",
    title: "Clave - Language Learning Platform",
    description: "A custom-built, interactive language learning application optimized for web deployment.",
    category: "Web & Mobile",
    status: "Completed",
    technologies: ["TypeScript", "React", "Python", "PostgreSQL"],
    liveUrl: "https://clave.kurlydeer.com",
    createdAt: "2026-03-05",
    readme: `# Clave Language Platform

### Overview
Clave bridges the gap between structured grammar lessons and conversational practice for Spanish speakers learning English. 

### Key Features
- **Spaced Repetition System (SRS)**: Algorithmically schedules vocabulary reviews to maximize long-term retention.
- **Interactive Exercises**: Drag-and-drop sentence building and real-time pronunciation feedback.
- **Progress Tracking**: Detailed dashboards showing fluency metrics and daily learning streaks.
`
  }
];

export const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: "blog_1",
    title: "About Me: System Administrator & IT Professional",
    summary: "An overview of my professional journey specializing in virtualization, enterprise networking, and full-stack development.",
    category: "Profile",
    tags: ["System Administration", "IT Infrastructure", "Proxmox", "Cisco"],
    publishedAt: "2026-06-15",
    readTime: "5 min read",
    difficulty: "Beginner",
    author: "KurlyDeer",
    content: `# About Me

Hello! I am an IT Professional and System Administrator with a deep passion for building resilient infrastructure and scalable software. My expertise spans both the physical hardware layer and the application stack.

## Professional Focus
My daily work involves orchestrating complex environments, ensuring high availability, and automating redundant tasks. 

### Key Areas of Expertise:
- **Virtualization & Hypervisors**: Extensive experience configuring and managing Proxmox clusters for optimal resource allocation and disaster recovery.
- **Enterprise Networking**: Designing and maintaining secure, high-throughput networks utilizing Cisco and Fortinet routing and switching technologies.
- **Full-Stack & Mobile Development**: Bridging the gap between infrastructure and software by building custom applications. I primarily use Python for backend services and Dart/Flutter for sleek, cross-platform mobile experiences.

I thrive in environments where I can optimize system performance, secure network perimeters, and deliver polished software solutions.
`
  },
  {
    id: "blog_2",
    title: "My Core Technical Skills & Toolstack",
    summary: "A detailed breakdown of the networking gear, hypervisors, storage solutions, and programming languages I use daily.",
    category: "Skills",
    tags: ["Networking", "Storage", "Development", "TrueNAS"],
    publishedAt: "2026-06-14",
    readTime: "4 min read",
    difficulty: "Intermediate",
    author: "KurlyDeer",
    content: `# Core Skills List

Over the years, I've curated a robust toolstack that allows me to tackle infrastructure challenges from the ground up, all the way to the frontend application layer.

## 1. Enterprise Networking
- **Cisco & Fortinet**: Extensive experience deploying, configuring, and troubleshooting enterprise-grade switches and firewalls. From Catalyst 9500 core switch migrations to setting up secure Fortinet VPN tunnels and IDS/IPS policies.

## 2. Virtualization & Hypervisors
- **Proxmox VE**: My go-to hypervisor for deploying high-availability clusters, managing LXC containers, and orchestrating virtual machines with custom SDN configurations.

## 3. Storage Solutions
- **TrueNAS**: Architecting scalable, ZFS-backed storage pools. Ensuring data integrity, snapshot replication, and high-speed SMB/NFS sharing for enterprise workloads.

## 4. Programming Languages & Frameworks
- **Python**: Used heavily for infrastructure automation, scripting, and building robust backend API services.
- **Dart & Flutter**: My primary choice for developing responsive, natively compiled mobile applications with beautiful user interfaces.
- **TypeScript & React**: Used for building dynamic, single-page web applications and internal dashboard interfaces.
`
  }
];

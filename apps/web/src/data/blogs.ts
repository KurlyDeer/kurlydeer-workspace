import { BlogPost } from "../types";

export const BLOGS: BlogPost[] = [
  {
    id: "blog_1",
    title: "About Me: System Administrator & IT Professional",
    summary: "An overview of my professional journey specializing in virtualization, enterprise networking, and full-stack development.",
    category: "Profile",
    tags: ["System Administration", "IT Infrastructure", "Proxmox", "Cisco"],
    publishedAt: "2026-06-15",
    readTime: "5 min read",
    difficulty: "Introductory",
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

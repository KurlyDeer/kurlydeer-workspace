import { Project } from "../types";

export const PROJECTS: Project[] = [
  {
    id: "proj_1",
    title: "Core Switch Network Migration",
    description: "A major enterprise-grade network infrastructure upgrade involving the deployment and configuration of Cisco Catalyst 9500 core switches.",
    category: "Systems & CLI",
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
    category: "Full-Stack",
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
    id: "clave",
    title: "CLAVE",
    description: "AI-powered Spanish-to-English language learning platform with real-time speech grading and adaptive learning.",
    category: "Full-Stack",
    status: "Completed",
    type: "live_app",
    technologies: ["Flutter Web", "Firebase", "Web Speech API", "Tailwind"],
    liveUrl: "https://clave.kurlydeer.com",
    featured: true,
    createdAt: "2026-03-05",
    readme: `# Clave Language Platform

### Overview
Clave bridges the gap between structured grammar lessons and conversational practice for Spanish speakers learning English. 

### Key Features
- **Spaced Repetition System (SRS)**: Algorithmically schedules vocabulary reviews to maximize long-term retention.
- **Interactive Exercises**: Drag-and-drop sentence building and real-time pronunciation feedback.
- **Progress Tracking**: Detailed dashboards showing fluency metrics and daily learning streaks.
`
  },
  {
    id: "cybergrid",
    title: "CyberGrid",
    description: "Automated network security & infrastructure telemetry framework for hybrid server nodes.",
    category: "Systems & CLI",
    status: "Completed",
    type: "github_project",
    technologies: ["TypeScript", "Security", "Docker", "Node.js", "CLI"],
    githubUrl: "https://github.com/KurlyDeer/cybergrid",
    featured: true,
    createdAt: "2026-08-09",
    readme: `# CyberGrid 🛡️🌐
> Automated Network Security, Grid Monitoring & Infrastructure Defense Framework

CyberGrid is a high-performance, modular security monitoring and automated grid infrastructure telemetry platform designed to monitor network nodes, secure multi-cloud/homelab environments, detect anomalies, and streamline system administration workflows.

---

## 📦 Features

- **Real-Time Node Telemetry:** Live heartbeat, bandwidth, and resource tracking across hybrid server nodes.
- **Automated Security Audit Engine:** Continuous scanning for open ports, unexpected service bindings, and configuration drift.
- **Modular Integration Grid:** Custom hooks for firewall rules (FortiGate/iptables), DNS filters, and container logs.
- **High-Contrast Terminal Dashboard:** Sleek, low-latency web and CLI dashboard inspired by enterprise grid operations.
- **Alerting & Webhooks:** Instant notifications via Discord, Slack, Telegram, or custom webhooks upon security threshold breaches.
`
  }
];

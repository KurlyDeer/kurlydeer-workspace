# KurlyDeer Hub — Systems Portfolio & Command Console

Welcome to the personal portfolio and telemetry dashboard of **Christian Lopez Robles**, Senior Information Technology Associate, Systems Architect, and Full-Stack Developer based in Charlotte, NC.

This application is designed with a sleek, dark-mode, command-console aesthetic. It integrates public single-page landing components, system status trackers, interactive project listings, and a secure admin control plane.

---

## 🛠️ Technology Stack

- **Core & Routing**: React 19 (Single Page App) & React Router v7.
- **Build Tooling**: Vite & TypeScript.
- **Styling & UI**: Tailwind CSS v4, Lucide React icons, and Framer Motion for scroll reveal and drawer transitions.
- **Backend & Auth**: Supabase (PostgreSQL database + session-based authentication).

---

## 🏗️ Architecture Features

1. **Top Navigation Bar**: Sticky, glass-morphic (`backdrop-blur-md`) top navigation bar with smooth-scroll anchors for the homepage and direct drawer triggers.
2. **Infinite Tech Stack Marquee**: A seamlessly looping custom CSS marquee separating page content, showcasing enterprise and software stack tokens.
3. **Telemetry & System Status**: Centered live status indicator pill showing system uptime and ping diagnostics.
4. **Slide-Out Contact Drawer**: Interactive right-side sliding contact form that transmits messages to local storage and syncs with your dashboard console.
5. **Secure Admin Boundary**: A dedicated `/admin` control console protected by `<ProtectedRoute />` which automatically bounces unauthenticated sessions back to `/login` via Supabase auth.
6. **Terminal-themed 404 Page**: Custom, full-screen diagnostic error layout indicating connection timeout or dropped packets for unrecognized URLs.

---

## 🚀 Local Development

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Environment Variables
Create a `.env.local` file in the root directory and add your Supabase project credentials:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```
The server will boot by default on port `3000` (accessible at `http://localhost:3000`).

### 5. Production Compilation Check
```bash
npm run build
```
This builds static artifacts under the `dist/` directory.

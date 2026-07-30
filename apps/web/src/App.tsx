/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Header from "@/components/Header";
import HomeSection from "@/components/HomeSection";
import ProjectGrid from "@/components/ProjectGrid";
import BlogSection from "@/components/BlogSection";
import MessagesSection from "@/components/MessagesSection";
import Login from "@/components/Login";
import AdminDashboard from "@/components/AdminDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/components/NotFound";
import ContactDrawer from "@/components/ContactDrawer";
import BackToTop from "@/components/BackToTop";
import { DEFAULT_PROJECTS, DEFAULT_BLOGS } from "@/defaultData";
import { Project, BlogPost, ContactMessage } from "@/types";

export default function App() {
  const location = useLocation();
  
  const getActiveTabFromPath = () => {
    switch(location.pathname) {
      case '/': return 'home';
      case '/projects': return 'projects';
      case '/blog': return 'blog';
      case '/messages': return 'messages';
      default: return 'home'; // fallback for /login or /admin if needed
    }
  };
  
  const activeTab = getActiveTabFromPath();
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Load datasets on first render
  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem("nexus_projects");
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      } else {
        setProjects(DEFAULT_PROJECTS);
        localStorage.setItem("nexus_projects", JSON.stringify(DEFAULT_PROJECTS));
      }

      const storedBlogs = localStorage.getItem("nexus_blogs");
      if (storedBlogs) {
        setBlogs(JSON.parse(storedBlogs));
      } else {
        setBlogs(DEFAULT_BLOGS);
        localStorage.setItem("nexus_blogs", JSON.stringify(DEFAULT_BLOGS));
      }

      const storedMessages = localStorage.getItem("nexus_messages");
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (err) {
      console.error("Local storage sync error: ", err);
      // Fallback
      setProjects(DEFAULT_PROJECTS);
      setBlogs(DEFAULT_BLOGS);
    }
  }, []);

  // Sync state helpers
  const saveProjectsToLocalStorage = (newProjs: Project[]) => {
    setProjects(newProjs);
    localStorage.setItem("nexus_projects", JSON.stringify(newProjs));
  };

  const saveBlogsToLocalStorage = (newBlogs: BlogPost[]) => {
    setBlogs(newBlogs);
    localStorage.setItem("nexus_blogs", JSON.stringify(newBlogs));
  };

  const saveMessagesToLocalStorage = (newMsgs: ContactMessage[]) => {
    setMessages(newMsgs);
    localStorage.setItem("nexus_messages", JSON.stringify(newMsgs));
  };

  // State actions
  const handleAddProject = (p: Omit<Project, "id" | "createdAt">) => {
    const freshProject: Project = {
      ...p,
      id: `proj_custom_${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0]
    };
    saveProjectsToLocalStorage([freshProject, ...projects]);
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    saveProjectsToLocalStorage(updated);
  };

  const handleResetProjects = () => {
    saveProjectsToLocalStorage(DEFAULT_PROJECTS);
  };

  const handleAddBlog = (b: Omit<BlogPost, "id" | "publishedAt">) => {
    const freshBlog: BlogPost = {
      ...b,
      id: `blog_custom_${Date.now()}`,
      publishedAt: new Date().toISOString().split("T")[0]
    };
    saveBlogsToLocalStorage([freshBlog, ...blogs]);
  };

  const handleDeleteBlog = (id: string) => {
    const updated = blogs.filter((b) => b.id !== id);
    saveBlogsToLocalStorage(updated);
  };

  const handleResetBlogs = () => {
    saveBlogsToLocalStorage(DEFAULT_BLOGS);
  };

  const handleAddContactMessage = (msg: Omit<ContactMessage, "id" | "createdAt">) => {
    const freshMsg: ContactMessage = {
      ...msg,
      id: `msg_${Date.now()}`,
      createdAt: new Date().toLocaleString()
    };
    saveMessagesToLocalStorage([freshMsg, ...messages]);
  };

  const handleDeleteMessage = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    saveMessagesToLocalStorage(updated);
  };

  const handleClearAllMessages = () => {
    saveMessagesToLocalStorage([]);
  };

  const isConsolePath = ["/projects", "/blog", "/messages"].includes(location.pathname);
  const isHomepagePath = location.pathname === "/";

  return (
    <div className={`min-h-screen bg-zinc-950 text-zinc-150 flex antialiased select-text ${isConsolePath ? "flex-col lg:flex-row" : "flex-col"}`}>
      {/* Show Navigation Console Sidebar only on console dashboard routes */}
      {isConsolePath && (
        <Navigation
          activeTab={activeTab as "home" | "projects" | "blog" | "messages"}
          messageCount={messages.length}
        />
      )}

      {/* Main Console Stage */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Sticky top Navbar for Homepage */}
        {isHomepagePath && <Navbar onContactClick={() => setIsContactDrawerOpen(true)} />}

        {/* Dynamic Telemetry Header for Console dashboard routes */}
        {isConsolePath && (
          <Header activeTab={activeTab as "home" | "projects" | "blog" | "messages"} />
        )}

        {/* Console Workspace Area */}
        <main className={`flex-1 overflow-y-auto bg-[#070708] ${isConsolePath ? "border-l border-zinc-900/60" : ""}`}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <HomeSection
                  onContactMessageSubmit={handleAddContactMessage}
                  projectsCount={projects.length}
                  blogsCount={blogs.length}
                  onContactClick={() => setIsContactDrawerOpen(true)}
                />
              } />

              <Route path="/projects" element={
                <ProjectGrid
                  projects={projects}
                  onAddProject={handleAddProject}
                  onDeleteProject={handleDeleteProject}
                  onResetProjects={handleResetProjects}
                />
              } />

              <Route path="/blog" element={
                <BlogSection
                  blogs={blogs}
                  onAddBlog={handleAddBlog}
                  onDeleteBlog={handleDeleteBlog}
                  onResetBlogs={handleResetBlogs}
                />
              } />

              <Route path="/messages" element={
                <MessagesSection
                  messages={messages}
                  onDeleteMessage={handleDeleteMessage}
                  onClearAllMessages={handleClearAllMessages}
                />
              } />

              <Route path="/login" element={<Login />} />
              
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Footer for Homepage */}
        {isHomepagePath && <Footer />}
      </div>

      {/* Slide-out Contact Drawer */}
      <ContactDrawer
        isOpen={isContactDrawerOpen}
        onClose={() => setIsContactDrawerOpen(false)}
        onSubmit={(data) => handleAddContactMessage({ ...data, subject: "Secure Drawer Transmission" })}
      />

      {/* Global Back to Top Button */}
      <BackToTop />
    </div>
  );
}

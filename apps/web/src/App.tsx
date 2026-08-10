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
import { PROJECTS } from "@/data/projects";
import { BLOGS } from "@/data/blogs";
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

  if (typeof window !== 'undefined') {
    localStorage.removeItem('nexus_projects');
    localStorage.removeItem('nexus_blogs');
  }

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const stored = localStorage.getItem("nexus_messages");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Admin interface is kept local for messages only in this version


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
                  projects={PROJECTS}
                  blogs={BLOGS}
                  onContactMessageSubmit={handleAddContactMessage}
                  projectsCount={PROJECTS.length}
                  blogsCount={BLOGS.length}
                  onContactClick={() => setIsContactDrawerOpen(true)}
                />
              } />

              <Route path="/projects" element={
                <ProjectGrid
                  projects={PROJECTS}
                  onAddProject={() => {}}
                  onDeleteProject={() => {}}
                  onResetProjects={() => {}}
                />
              } />

              <Route path="/blog" element={
                <BlogSection
                  blogs={BLOGS}
                  onAddBlog={() => {}}
                  onDeleteBlog={() => {}}
                  onResetBlogs={() => {}}
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

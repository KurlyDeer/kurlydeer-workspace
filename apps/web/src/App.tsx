/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Header from "@/components/Header";
import HomeSection from "@/components/HomeSection";


import MessagesSection from "@/components/MessagesSection";
import Login from "@/components/Login";

import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/components/NotFound";
import ContactDrawer from "@/components/ContactDrawer";
import BackToTop from "@/components/BackToTop";
import { usePublicContent } from "@/lib/usePublicContent";
import { Project, BlogPost, ContactMessage } from "@/types";

const AdminDashboard = lazy(() => import("@/components/AdminDashboard"));
const ProjectGrid = lazy(() => import("@/components/ProjectGrid"));
const BlogSection = lazy(() => import("@/components/BlogSection"));

export default function App() {
  const location = useLocation();
  const { projects, blogs } = usePublicContent();
  
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

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const stored = localStorage.getItem("nexus_messages");
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed.filter(m => m && typeof m.id === "string" && typeof m.message === "string") : [];
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // This is a browser-local history, not an inbox or message delivery service.
  const saveMessagesToLocalStorage = (newMessages: ContactMessage[]) => {
    localStorage.setItem("nexus_messages", JSON.stringify(newMessages));
    setMessages(newMessages);
  };


  const handleAddContactMessage = async (msg: Omit<ContactMessage, "id" | "createdAt">) => {
    const key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (!key) throw new Error('Contact delivery is not configured.');
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: key, ...msg }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error('Message delivery failed.');
    const freshMsg: ContactMessage = {
      ...msg,
      id: `msg_${Date.now()}`,
      createdAt: new Date().toLocaleString()
    };
    // A local history failure must not report an already-delivered message as failed.
    try { saveMessagesToLocalStorage([freshMsg, ...messages]); }
    catch { setMessages(prev => [freshMsg, ...prev]); }
  };

  const handleDeleteMessage = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    try { saveMessagesToLocalStorage(updated); } catch { window.alert("Could not update browser-local history."); }
  };

  const handleClearAllMessages = () => {
    try { saveMessagesToLocalStorage([]); } catch { window.alert("Could not clear browser-local history."); }
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
            <Suspense fallback={<p role="status" className="p-6">Loading…</p>}><Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <HomeSection
                  projects={projects}
                  blogs={blogs}
                  onContactMessageSubmit={handleAddContactMessage}
                  projectsCount={projects.length}
                  blogsCount={blogs.length}
                  onContactClick={() => setIsContactDrawerOpen(true)}
                />
              } />

              <Route path="/projects" element={
                <ProjectGrid
                  projects={projects}
                />
              } />

              <Route path="/blog" element={
                <BlogSection
                  blogs={blogs}
                />
              } />

              <Route path="/messages" element={
                <ProtectedRoute><MessagesSection
                  messages={messages}
                  onDeleteMessage={handleDeleteMessage}
                  onClearAllMessages={handleClearAllMessages}
                /></ProtectedRoute>
              } />

              <Route path="/login" element={<Login />} />
              
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes></Suspense>
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

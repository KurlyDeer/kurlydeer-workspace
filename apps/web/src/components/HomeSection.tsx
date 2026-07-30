import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, AlertCircle, Terminal } from "lucide-react";
import { ContactMessage } from "@/types";
import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import ProjectsGrid from "@/components/ProjectsGrid";
import Infrastructure from "@/components/Infrastructure";
import BlogTeaser from "@/components/BlogTeaser";
import TechMarquee from "@/components/TechMarquee";

interface HomeSectionProps {
  onContactMessageSubmit: (msg: Omit<ContactMessage, "id" | "createdAt">) => void;
  projectsCount: number;
  blogsCount: number;
  onContactClick: () => void;
}

export default function HomeSection({ onContactMessageSubmit, projectsCount, blogsCount, onContactClick }: HomeSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSending(true);
    setSendStatus("idle");

    setTimeout(() => {
      onContactMessageSubmit(formData);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSending(false);
      setSendStatus("success");
      setTimeout(() => setSendStatus("idle"), 4000);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 1. Hero Section */}
      <Hero onContactClick={onContactClick} />

      {/* Tech Marquee */}
      <TechMarquee />

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      </div>

      {/* 2. About Me */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <AboutMe />
      </motion.div>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      </div>

      {/* 3. Software Engineering Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <ProjectsGrid />
      </motion.div>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      </div>

      {/* 3. Infrastructure & Homelab */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Infrastructure />
      </motion.div>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      </div>

      {/* 4. Blog Teaser */}
      <BlogTeaser />

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      </div>

      {/* 5. Contact Form */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center justify-center">
                <Mail className="h-4 w-4 text-rose-400" />
              </div>
              <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
                Get in Touch
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-100 tracking-tight mb-3">
              Send a Message
            </h2>
            <p className="font-sans text-sm text-zinc-500 mb-10">
              Have a project idea, collaboration opportunity, or just want to connect? Drop me a line.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleFormSubmit}
            className="bg-zinc-900/70 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-8 space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2 block">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans placeholder:text-zinc-700"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2 block">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans placeholder:text-zinc-700"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2 block">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans placeholder:text-zinc-700"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2 block">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans resize-none placeholder:text-zinc-700"
                placeholder="Tell me about your project or idea..."
              />
            </div>

            {/* Status messages */}
            {sendStatus === "success" && (
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                <Terminal className="h-3.5 w-3.5" />
                <span>Message transmitted successfully.</span>
              </div>
            )}
            {sendStatus === "error" && (
              <div className="flex items-center gap-2 text-rose-400 font-mono text-xs">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Transmission failed. Please retry.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-display font-bold text-sm rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] cursor-pointer"
            >
              {isSending ? "Transmitting..." : "Send Message"}
            </button>
          </motion.form>
        </div>
      </section>
    </motion.div>
  );
}

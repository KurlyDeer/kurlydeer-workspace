import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronRight, Download, Github, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const TYPING_LINES = [
  "$ whoami",
  "> Christian — Senior IT Associate & Full-Stack Developer",
  "$ cat /etc/mission.conf",
  "> Building infrastructure that scales. Shipping software that matters.",
  "$ uptime",
  "> 8+ years | Systems · Networking · Code",
];

interface HeroProps {
  onContactClick: () => void;
}

export default function Hero({ onContactClick }: HeroProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  // Fetch availability status from Supabase
  useEffect(() => {
    const fetchStatus = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key_name", "availability_status")
        .single();
      if (data) {
        setIsAvailable(data.value === "available");
      } else {
        setIsAvailable(true); // fallback
      }
    };
    fetchStatus();
  }, []);

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor((p) => !p), 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typing animation
  useEffect(() => {
    if (currentLineIndex >= TYPING_LINES.length) return;

    const line = TYPING_LINES[currentLineIndex];
    const isCommand = line.startsWith("$");
    const delay = isCommand ? 45 : 18;

    if (currentCharIndex < line.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          updated[currentLineIndex] = line.slice(0, currentCharIndex + 1);
          return updated;
        });
        setCurrentCharIndex((c) => c + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLineIndex((i) => i + 1);
        setCurrentCharIndex(0);
        setDisplayedLines((prev) => [...prev, ""]);
      }, isCommand ? 400 : 700);
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex]);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Subtle radial background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-sky-500/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-10"
        >
          {/* Status badge */}
          <div className="flex items-center gap-2">
            {isAvailable === null ? (
              /* Skeleton loader while fetching */
              <>
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700 animate-pulse" />
                <span className="h-3 w-24 bg-zinc-800 rounded animate-pulse" />
              </>
            ) : (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isAvailable ? "bg-emerald-400" : "bg-amber-400"
                  }`} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isAvailable ? "bg-emerald-500" : "bg-amber-500"
                  }`} />
                </span>
                <span className={`font-mono text-[11px] tracking-widest uppercase ${
                  isAvailable ? "text-emerald-400/80" : "text-amber-400/80"
                }`}>
                  {isAvailable ? "Available for opportunities" : "Currently Engaged"}
                </span>
              </>
            )}
          </div>

          {/* Name & Title */}
          <div className="space-y-4">
            <h1 className="font-display font-bold text-5xl md:text-7xl text-zinc-50 tracking-tight leading-[1.1]">
              Christian
              <span className="text-emerald-400">.</span>
            </h1>
            <p className="font-display text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
              Senior Information Technology Associate
              <span className="text-zinc-600 mx-2">·</span>
              Full-Stack Developer
            </p>
          </div>

          {/* Terminal block */}
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/80 rounded-xl overflow-hidden shadow-2xl shadow-black/30 max-w-2xl">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-950/60 border-b border-zinc-800/60">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
              </div>
              <span className="font-mono text-[10px] text-zinc-500 ml-2">christian@homelab ~ %</span>
            </div>

            {/* Terminal body */}
            <div className="p-5 font-mono text-sm leading-relaxed min-h-[180px]">
              {displayedLines.map((line, i) => (
                <div key={i} className="flex">
                  <span
                    className={
                      line.startsWith("$")
                        ? "text-emerald-400"
                        : line.startsWith(">")
                        ? "text-zinc-300"
                        : "text-zinc-500"
                    }
                  >
                    {line}
                  </span>
                  {i === currentLineIndex && (
                    <span
                      className={`ml-0.5 inline-block w-2 h-4 bg-emerald-400 translate-y-[3px] ${
                        showCursor ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-display font-bold text-sm rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              View Projects
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <button
              onClick={onContactClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 font-display font-bold text-sm rounded-lg transition-all duration-200 cursor-pointer"
            >
              Contact Me
            </button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 pt-1">
            <a
              href="https://www.linkedin.com/in/kurlydeer"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:border-zinc-700 transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/KurlyDeer"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:border-zinc-700 transition-all"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

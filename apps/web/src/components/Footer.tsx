import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-950/40 border-t border-zinc-900/60 py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Copyright & Engineering location */}
        <div className="flex flex-col gap-1 text-center md:text-left">
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            © 2026 Christian Lopez Robles.
          </p>
          <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider">
            Engineered in Charlotte, NC.
          </p>
        </div>

        {/* Center/Right: Social links & subtle login */}
        <div className="flex flex-col md:items-end gap-3">
          <div className="flex items-center gap-4 justify-center">
            <a
              href="https://www.linkedin.com/in/kurlydeer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-emerald-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/KurlyDeer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-emerald-400 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>

          <Link
            to="/login"
            className="font-mono text-[8px] text-zinc-800/60 hover:text-zinc-650 transition-colors uppercase tracking-widest text-center md:text-right"
          >
            sys_login
          </Link>
        </div>
      </div>
    </footer>
  );
}

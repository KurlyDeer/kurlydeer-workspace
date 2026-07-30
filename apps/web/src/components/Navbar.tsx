import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeProvider";

interface NavbarProps {
  onContactClick: () => void;
}

export default function Navbar({ onContactClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Update URL hash without breaking history or causing reloads
      window.history.pushState(null, "", `#${id}`);
    }
    setMobileOpen(false);
  };

  const navLinkClass =
    "font-mono text-[11px] text-zinc-400 hover:text-emerald-400 uppercase tracking-wider transition-colors font-medium";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full backdrop-blur-md border-b border-zinc-900/60 transition-all duration-300 ${
        scrolled
          ? "bg-zinc-950/85 shadow-lg shadow-black/20"
          : "bg-zinc-950/70"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left Side: Logo */}
        <a
          href="/"
          className="font-display font-bold text-sm tracking-widest text-zinc-100 hover:text-emerald-400 transition-colors"
        >
          C.LOPEZ
        </a>

        {/* Right Side: Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 md:gap-8">
          <a
            href="https://clave.kurlydeer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-emerald-400 hover:text-emerald-300 uppercase tracking-wider transition-colors font-bold"
          >
            Clave
          </a>
          <a
            href="#about"
            onClick={(e) => handleScroll(e, "about")}
            className={navLinkClass}
          >
            About
          </a>
          <a
            href="#projects"
            onClick={(e) => handleScroll(e, "projects")}
            className={navLinkClass}
          >
            Projects
          </a>
          <a
            href="#infrastructure"
            onClick={(e) => handleScroll(e, "infrastructure")}
            className={navLinkClass}
          >
            Infrastructure
          </a>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:border-zinc-700 transition-all"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              onContactClick();
            }}
            className="font-mono text-[11px] text-zinc-450 hover:text-emerald-400 uppercase tracking-wider transition-colors font-semibold"
          >
            Contact
          </a>
        </nav>

        {/* Mobile: Theme Toggle + Hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:border-zinc-700 transition-all"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
            className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:border-zinc-700 transition-all"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/60"
          >
            <div className="flex flex-col gap-4 px-6 py-5">
              <a
                href="https://clave.kurlydeer.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-emerald-400 hover:text-emerald-300 uppercase tracking-wider transition-colors font-bold"
              >
                Clave
              </a>
              <a
                href="#about"
                onClick={(e) => handleScroll(e, "about")}
                className={navLinkClass}
              >
                About
              </a>
              <a
                href="#projects"
                onClick={(e) => handleScroll(e, "projects")}
                className={navLinkClass}
              >
                Projects
              </a>
              <a
                href="#infrastructure"
                onClick={(e) => handleScroll(e, "infrastructure")}
                className={navLinkClass}
              >
                Infrastructure
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  onContactClick();
                  setMobileOpen(false);
                }}
                className="font-mono text-[11px] text-zinc-450 hover:text-emerald-400 uppercase tracking-wider transition-colors font-semibold"
              >
                Contact
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

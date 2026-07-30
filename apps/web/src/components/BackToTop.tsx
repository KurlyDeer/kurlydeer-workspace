import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 h-10 w-10 sm:h-11 sm:w-11 rounded-xl
            bg-zinc-900/80 dark:bg-zinc-900/80 backdrop-blur-md
            border border-zinc-700/60
            flex items-center justify-center
            text-zinc-400 hover:text-emerald-400
            shadow-lg shadow-black/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]
            hover:border-emerald-500/40
            transition-all duration-300 cursor-pointer
            light:bg-white/80 light:border-zinc-300/60 light:text-zinc-500 light:hover:text-emerald-600 light:shadow-zinc-200/50"
        >
          <ChevronUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

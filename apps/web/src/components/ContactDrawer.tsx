import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Send, Terminal } from "lucide-react";

interface ContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; message: string }) => void;
}

export default function ContactDrawer({ isOpen, onClose, onSubmit }: ContactDrawerProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSending(true);
    setStatus("idle");

    try {
      const payload = {
        access_key: "YOUR_ACCESS_KEY_HERE",
        from_name: "KurlyDeer Portfolio Transmission",
        name: formData.name,
        email: formData.email,
        message: formData.message,
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        // Also persist locally for the admin messages dashboard
        onSubmit(formData);
        setFormData({ name: "", email: "", message: "" });
        setStatus("success");
        setTimeout(() => {
          setStatus("idle");
          onClose();
        }, 2500);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950/85 backdrop-blur-xl border-l border-zinc-900 z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-900/60">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wide">
                    Secure Channel
                  </h3>
                  <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                    Direct Connection
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-750 text-zinc-400 hover:text-zinc-200 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-5 overflow-y-auto">
              <div>
                <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2 block font-medium">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-900/40 border border-zinc-850 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans placeholder:text-zinc-750"
                  placeholder="Identify yourself"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2 block font-medium">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-900/40 border border-zinc-850 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans placeholder:text-zinc-750"
                  placeholder="contact@domain.com"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2 block font-medium">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-zinc-900/40 border border-zinc-850 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans resize-none placeholder:text-zinc-750"
                  placeholder="Transmission details..."
                />
              </div>

              {/* Status Indicator */}
              {status === "success" && (
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                  <Terminal className="h-3.5 w-3.5 animate-pulse shrink-0" />
                  <span>Transmission successfully queued.</span>
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 text-red-400 font-mono text-[11px] bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                  <Terminal className="h-3.5 w-3.5 shrink-0" />
                  <span>Transmission failed. Please retry.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSending || status === "success"}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-display font-bold text-sm rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                {isSending ? "Sending..." : status === "success" ? "Transmission Sent!" : "Send Transmission"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

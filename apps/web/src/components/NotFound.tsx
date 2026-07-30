import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Terminal, ShieldAlert, ChevronRight, Home } from "lucide-react";

export default function NotFound() {
  const location = useLocation();
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor((p) => !p), 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-300 font-mono antialiased select-none">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/[0.02] rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/80 rounded-xl overflow-hidden shadow-2xl shadow-black/40"
      >
        {/* Title Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950/60 border-b border-zinc-800/60">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/30" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
          </div>
          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
            gateway_router.sh
          </span>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Terminal Body */}
        <div className="p-6 space-y-6 text-xs md:text-sm">
          {/* Header Status */}
          <div className="flex items-start gap-3.5">
            <div className="h-9 w-9 shrink-0 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-zinc-100 uppercase tracking-tight">
                404: Packet Dropped
              </h1>
              <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-0.5">
                ERR_CONNECTION_TIMEOUT
              </p>
            </div>
          </div>

          <div className="h-px bg-zinc-800/60" />

          {/* Code/Error output trace */}
          <div className="space-y-3 font-mono text-zinc-400 bg-zinc-950/50 p-4 border border-zinc-900 rounded-lg overflow-x-auto leading-relaxed">
            <p className="text-zinc-500"># DIAGNOSTIC TELEMETRY TRACE</p>
            <p>
              <span className="text-zinc-500">[{new Date().toISOString()}]</span>{" "}
              <span className="text-rose-400">WARNING:</span> Route resolution failed.
            </p>
            <p>
              $ curl -I https://c.lopez.dev{location.pathname}
            </p>
            <p className="text-zinc-500">
              &gt; HTTP/1.1 404 Not Found<br />
              &gt; Server: Netlify/Vercel/Homelab<br />
              &gt; Reason: The route you requested does not exist on this server.
            </p>
            <div className="flex items-center text-zinc-500 mt-2">
              <span>visitor@host ~ % _</span>
              <span
                className={`ml-0.5 inline-block w-1.5 h-3.5 bg-zinc-500 -translate-y-[1px] ${
                  showCursor ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex justify-end">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-650 text-zinc-200 hover:text-zinc-100 font-display font-semibold text-xs rounded-lg transition-all duration-200"
            >
              <Home className="h-3.5 w-3.5" />
              Return to Main Gateway
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

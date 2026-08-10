import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Shield, Activity, Server, Lock } from "lucide-react";

interface CyberGridDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CyberGridDocsModal({ isOpen, onClose }: CyberGridDocsModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex justify-end"
          >
            {/* Modal/Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl h-full bg-zinc-950 border-l border-zinc-800/80 shadow-2xl flex flex-col z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-sky-500/10 border border-sky-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-sky-400" />
                  </div>
                  <h2 className="font-display font-bold text-xl text-zinc-100">
                    CyberGrid Documentation
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-zinc-400 hover:text-zinc-100 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                {/* Introduction */}
                <div>
                  <h3 className="font-display font-bold text-2xl text-zinc-100 mb-3 tracking-tight">
                    Automated Network Security, Grid Monitoring & Infrastructure Defense Framework
                  </h3>
                  <p className="font-sans text-zinc-400 leading-relaxed">
                    CyberGrid is a high-performance, modular security monitoring and automated grid
                    infrastructure telemetry platform designed to monitor network nodes, secure
                    multi-cloud/homelab environments, detect anomalies, and streamline system
                    administration workflows.
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-emerald-400" />
                      <h4 className="font-bold text-zinc-200">Real-Time Telemetry</h4>
                    </div>
                    <p className="text-sm text-zinc-500">Live heartbeat, bandwidth, and resource tracking across hybrid server nodes.</p>
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-rose-400" />
                      <h4 className="font-bold text-zinc-200">Automated Audit</h4>
                    </div>
                    <p className="text-sm text-zinc-500">Continuous scanning for open ports, unexpected service bindings, and drift.</p>
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Server className="h-4 w-4 text-indigo-400" />
                      <h4 className="font-bold text-zinc-200">Modular Integration</h4>
                    </div>
                    <p className="text-sm text-zinc-500">Custom hooks for firewall rules (FortiGate/iptables), DNS filters, and containers.</p>
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-sky-400" />
                      <h4 className="font-bold text-zinc-200">Instant Alerting</h4>
                    </div>
                    <p className="text-sm text-zinc-500">Instant notifications via Discord, Slack, Telegram, or custom webhooks.</p>
                  </div>
                </div>

                {/* Installation */}
                <div>
                  <h3 className="font-display font-bold text-xl text-zinc-100 mb-4 flex items-center gap-2">
                    <span className="h-6 w-1 bg-sky-500 rounded-full" />
                    Installation & Quick Start
                  </h3>
                  <div className="space-y-4">
                    <p className="font-sans text-sm text-zinc-400">
                      Deploy the containerized version in a few simple steps. Requires Docker Engine 24.0+ and elevated network access.
                    </p>
                    <div className="bg-[#0D0D0D] border border-zinc-800/80 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-zinc-500 text-xs">bash</span>
                      </div>
                      <code className="text-zinc-300">
                        <span className="text-zinc-500"># 1. Clone the repository</span><br/>
                        git clone https://github.com/KurlyDeer/cybergrid.git<br/>
                        cd cybergrid<br/><br/>
                        <span className="text-zinc-500"># 2. Copy the environment configuration template</span><br/>
                        cp .env.example .env<br/><br/>
                        <span className="text-zinc-500"># 3. Build and launch containers</span><br/>
                        docker compose up -d --build
                      </code>
                    </div>
                  </div>
                </div>
                
                {/* Footer space */}
                <div className="h-8" />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import React from "react";
import { Activity } from "lucide-react";

export default function SystemStatus() {
  return (
    <div className="inline-flex items-center gap-3 bg-zinc-900/80 backdrop-blur-sm border border-zinc-850 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.08)]">
      {/* Pulsing indicator */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      {/* Telemetry text */}
      <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-2">
        <Activity className="h-3 w-3 text-emerald-400/80" />
        All Systems Operational 
        <span className="text-zinc-750">|</span> 
        99.9% Uptime 
        <span className="text-zinc-750">|</span> 
        12ms
      </span>
    </div>
  );
}

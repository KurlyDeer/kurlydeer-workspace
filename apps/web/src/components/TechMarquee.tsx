import React from "react";
import {
  Cpu,
  Shield,
  Layers,
  HardDrive,
  Network,
  Smartphone,
  Code2,
  Terminal,
  Flame,
  Database,
} from "lucide-react";

interface TechItem {
  name: string;
  icon: React.ReactNode;
  color: string;
}

const TECH_ITEMS: TechItem[] = [
  { name: "Cisco IOS-XE", icon: <Cpu className="h-4 w-4" />, color: "text-blue-400" },
  { name: "Fortinet NGFW", icon: <Shield className="h-4 w-4" />, color: "text-red-400" },
  { name: "Proxmox VE", icon: <Layers className="h-4 w-4" />, color: "text-orange-400" },
  { name: "TrueNAS", icon: <HardDrive className="h-4 w-4" />, color: "text-sky-400" },
  { name: "Active Directory", icon: <Network className="h-4 w-4" />, color: "text-indigo-400" },
  { name: "Flutter", icon: <Smartphone className="h-4 w-4" />, color: "text-teal-400" },
  { name: "React", icon: <Code2 className="h-4 w-4" />, color: "text-emerald-400" },
  { name: "Python", icon: <Terminal className="h-4 w-4" />, color: "text-yellow-400" },
  { name: "Firebase", icon: <Flame className="h-4 w-4" />, color: "text-amber-500" },
  { name: "Supabase", icon: <Database className="h-4 w-4" />, color: "text-emerald-500" },
];

export default function TechMarquee() {
  // We double the list to ensure a seamless looping effect
  const marqueeItems = [...TECH_ITEMS, ...TECH_ITEMS];

  return (
    <div className="relative w-full max-w-full overflow-hidden py-8 bg-zinc-950/40 border-y border-zinc-900/60 my-6">
      {/* Left/Right Fades for premium transition effect */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

      {/* Marquee Row */}
      <div className="flex w-max animate-marquee">
        {marqueeItems.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex items-center gap-2.5 mx-6 bg-zinc-900/40 border border-zinc-850 px-4 py-2.5 rounded-xl hover:border-zinc-700 transition-all duration-300 select-none group"
          >
            <span className={`${item.color} group-hover:scale-110 transition-transform duration-200`}>
              {item.icon}
            </span>
            <span className="font-mono text-xs text-zinc-300 uppercase tracking-widest font-medium">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Clock, Activity, HardDrive, ShieldCheck } from "lucide-react";

interface HeaderProps {
  activeTab: "home" | "projects" | "blog" | "messages";
}

export default function Header({ activeTab }: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getSectionTitle = () => {
    switch (activeTab) {
      case "home":
        return { main: "Developer Profile", sub: "Personal summary, biography, and professional contacts" };
      case "projects":
        return { main: "Project Showcase", sub: "Interactive catalog of application laboratories and scripts" };
      case "blog":
        return { main: "Technical Publications", sub: "Systems walkthroughs, code guides, and technical reports" };
      case "messages":
        return { main: "Saved Contact Messages", sub: "Inbox log of direct visitor transmission form requests" };
    }
  };

  const titleInfo = getSectionTitle();

  return (
    <header className="bg-zinc-950/80 backdrop-blur-md border-b border-zinc-850 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
      <div>
        <h2 className="font-display font-semibold text-base text-zinc-100 tracking-wide">
          {titleInfo.main}
        </h2>
        <p className="font-sans text-[11px] text-zinc-400 mt-0.5">
          {titleInfo.sub}
        </p>
      </div>

      {/* Lab Telemetry Deck */}
      <div className="flex items-center gap-4 text-xs font-mono">
        {/* System Time */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-350">
          <Clock className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[11px] tabular-nums tracking-wider text-zinc-200">
            {time.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </header>
  );
}

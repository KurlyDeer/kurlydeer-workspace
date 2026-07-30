import React from "react";
import { motion } from "motion/react";
import { Shield, Server, Code2, Lock, ArrowRight } from "lucide-react";

const PILLARS = [
  { icon: <Shield className="h-4 w-4" />, label: "Cybersecurity", color: "text-rose-400" },
  { icon: <Server className="h-4 w-4" />, label: "Infrastructure", color: "text-amber-400" },
  { icon: <Code2 className="h-4 w-4" />, label: "Full-Stack Dev", color: "text-sky-400" },
  { icon: <Lock className="h-4 w-4" />, label: "Compliance", color: "text-indigo-400" },
];

export default function AboutMe() {
  return (
    <section id="about" className="px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start"
        >
          {/* Text Column — 3/5 */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-zinc-800 border border-zinc-700/50 rounded-lg flex items-center justify-center">
                <span className="font-mono text-xs text-zinc-400">01</span>
              </div>
              <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
                About Me
              </span>
            </div>

            <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-100 tracking-tight leading-tight">
              Systems Architect
              <span className="text-emerald-400">.</span>
              <br />
              <span className="text-zinc-400">Software Engineer</span>
              <span className="text-emerald-400">.</span>
            </h2>

            <p className="font-sans text-[15px] text-zinc-400 leading-[1.8] max-w-2xl">
              I am a Senior Information Technology Associate and Systems Architect based in the Charlotte area. My foundation is built on Cybersecurity—specializing in engineering high-availability enterprise networks, orchestrating major infrastructure migrations, and locking down data in highly regulated environments. But I don't just configure Cisco switches and firewalls. I am also a full-stack developer bridging the gap between deep hardware infrastructure and modern software. Whether I'm designing layered network security, managing my homelab, or building cloud-integrated applications, my goal is simple: I build the apps, and I architect the secure, resilient infrastructure they run on.
            </p>

            {/* Pillar badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              {PILLARS.map((p) => (
                <div
                  key={p.label}
                  className="flex items-center gap-2 bg-zinc-900/70 border border-zinc-800/80 rounded-lg px-3 py-2 hover:border-zinc-700/80 transition-all"
                >
                  <span className={p.color}>{p.icon}</span>
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Graphic Column — 2/5 */}
          <div className="lg:col-span-2 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full max-w-[280px] aspect-square"
            >
              {/* Abstract layered graphic */}
              <div className="absolute inset-0 bg-zinc-900/50 border border-zinc-800/60 rounded-3xl rotate-3 scale-95" />
              <div className="absolute inset-0 bg-zinc-900/70 border border-zinc-800/70 rounded-3xl -rotate-2 scale-[0.97]" />
              <div className="relative h-full bg-zinc-900/90 backdrop-blur-sm border border-zinc-800/80 rounded-3xl flex flex-col items-center justify-center p-8 overflow-hidden">
                {/* Radial glow */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-500/[0.06] rounded-full blur-[60px]" />
                </div>

                {/* Monogram */}
                <div className="relative z-10 h-20 w-20 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                  <span className="font-display font-bold text-3xl text-emerald-400">C</span>
                </div>

                <p className="relative z-10 font-display font-bold text-sm text-zinc-300 text-center">
                  Christian
                </p>
                <p className="relative z-10 font-mono text-[10px] text-zinc-500 text-center mt-1 uppercase tracking-widest">
                  Charlotte, NC
                </p>

                {/* Tech stack mini indicators */}
                <div className="relative z-10 flex gap-2 mt-5">
                  {["Cisco", "Proxmox", "React", "Python"].map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[8px] text-zinc-600 uppercase tracking-wider bg-zinc-800/50 border border-zinc-700/30 rounded px-1.5 py-0.5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

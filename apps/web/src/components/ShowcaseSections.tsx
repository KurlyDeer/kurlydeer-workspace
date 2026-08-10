import React from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowUpRight, Code2, Server, Star, BookOpen, ExternalLink } from "lucide-react";
import { Project } from "@/types";
import { Link } from "react-router-dom";

interface ShowcaseSectionsProps {
  projects: Project[];
  onOpenCyberGridDocs: () => void;
}

function TechBadge({ tech }: { tech: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    "flutter web": { bg: "bg-sky-500/15", text: "text-sky-400", border: "border-sky-500/25" },
    firebase: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/25" },
    "web speech api": { bg: "bg-rose-500/15", text: "text-rose-400", border: "border-rose-500/25" },
    tailwind: { bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-cyan-500/25" },
    typescript: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/25" },
    security: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/25" },
    docker: { bg: "bg-sky-500/15", text: "text-sky-400", border: "border-sky-500/25" },
    cli: { bg: "bg-zinc-500/15", text: "text-zinc-400", border: "border-zinc-500/25" },
    "node.js": { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/25" },
  };

  const c = colors[tech.toLowerCase()] || { bg: "bg-zinc-700/20", text: "text-zinc-400", border: "border-zinc-600/20" };

  return (
    <span className={`${c.bg} ${c.text} ${c.border} border rounded-md px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider`}>
      {tech}
    </span>
  );
}

export default function ShowcaseSections({ projects, onOpenCyberGridDocs }: ShowcaseSectionsProps) {
  // Separate into types
  const liveApps = projects.filter(p => p.type === "live_app");
  const githubProjects = projects.filter(p => p.type === "github_project");

  return (
    <div className="space-y-24">
      {/* SECTION A: Live Hosted Applications */}
      {liveApps.length > 0 && (
        <section id="live-apps" className="px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
                  Live Hosted Applications
                </span>
              </div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-100 tracking-tight">
                Production Apps
              </h2>
              <p className="font-sans text-sm text-zinc-500 mt-3 max-w-xl">
                Fully featured applications running live in production environments.
              </p>
            </motion.div>

            <div className="space-y-8">
              {liveApps.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative bg-[#0A0A0A] backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-zinc-700/80 hover:-translate-y-1 overflow-hidden"
                  style={{ boxShadow: "0 4px 20px -5px rgba(0,0,0,0.3)" }}
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                  
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                          <Star className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-2xl text-zinc-100">{project.title}</h3>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5 shrink-0">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-mono text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">🟢 Live Web App</span>
                      </div>
                    </div>

                    <div className="aspect-[21/9] w-full rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-white/5 flex items-center justify-center overflow-hidden">
                      <span className="font-display font-bold text-7xl text-emerald-400 opacity-30 select-none">
                        {project.title.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    <p className="font-sans text-base text-zinc-400 leading-relaxed max-w-3xl">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <TechBadge key={tech} tech={tech} />
                      ))}
                    </div>

                    {project.liveUrl && (
                      <div className="pt-2">
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold font-display rounded-lg transition-all"
                        >
                          Launch App ↗
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION B: Open Source & Engineering Projects */}
      {githubProjects.length > 0 && (
        <section id="open-source" className="px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 bg-sky-500/10 border border-sky-500/20 rounded-lg flex items-center justify-center">
                  <Code2 className="h-4 w-4 text-sky-400" />
                </div>
                <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
                  Open Source & Engineering
                </span>
              </div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-100 tracking-tight">
                Engineering Projects
              </h2>
              <p className="font-sans text-sm text-zinc-500 mt-3 max-w-xl">
                Open source frameworks and infrastructure tools.
              </p>
            </motion.div>

            <div className="space-y-8">
              {githubProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative bg-[#0A0A0A] backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-zinc-700/80 hover:-translate-y-1 overflow-hidden"
                  style={{ boxShadow: "0 4px 20px -5px rgba(0,0,0,0.3)" }}
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
                  
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center text-sky-400">
                          <Server className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-2xl text-zinc-100">{project.title}</h3>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-3 py-1.5 shrink-0">
                        <span className="font-mono text-[10px] text-sky-400 font-semibold uppercase tracking-wider">🛡️ Open Source</span>
                      </div>
                    </div>

                    <div className="aspect-[21/9] w-full rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-500/5 border border-white/5 flex items-center justify-center overflow-hidden">
                      <span className="font-display font-bold text-7xl text-sky-400 opacity-30 select-none">
                        {project.title.substring(0, 2).toUpperCase()}
                      </span>
                    </div>

                    <p className="font-sans text-base text-zinc-400 leading-relaxed max-w-3xl">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <TechBadge key={tech} tech={tech} />
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold font-display rounded-lg transition-all border border-zinc-700 hover:border-zinc-600"
                        >
                          GitHub Repo ↗
                        </a>
                      )}
                      {project.id === "cybergrid" && (
                        <button 
                          onClick={onOpenCyberGridDocs}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-semibold font-display rounded-lg transition-all border border-sky-500/20 hover:border-sky-500/30"
                        >
                          View Docs <BookOpen className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* View All Projects Button */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-sm font-semibold text-zinc-100 transition-colors"
          >
            View All Projects ({projects.length}) ➔
          </Link>
        </div>
      </section>
    </div>
  );
}

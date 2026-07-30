import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowUpRight, Code2, Star } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface SupabaseProject {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  status: string;
  live_url: string | null;
  created_at: string;
}

const ACCENT_CYCLE = ["emerald", "sky", "amber", "rose"] as const;

const accentMap: Record<string, { border: string; text: string; bg: string; dot: string; tagBg: string; tagText: string; glow: string; gradientFrom: string; gradientTo: string }> = {
  emerald: {
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    dot: "bg-emerald-500",
    tagBg: "bg-emerald-500/10",
    tagText: "text-emerald-400",
    glow: "rgba(16,185,129,0.15)",
    gradientFrom: "from-emerald-500/20",
    gradientTo: "to-emerald-500/5",
  },
  sky: {
    border: "border-sky-500/20",
    text: "text-sky-400",
    bg: "bg-sky-500/10",
    dot: "bg-sky-500",
    tagBg: "bg-sky-500/10",
    tagText: "text-sky-400",
    glow: "rgba(14,165,233,0.15)",
    gradientFrom: "from-sky-500/20",
    gradientTo: "to-sky-500/5",
  },
  amber: {
    border: "border-amber-500/20",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    dot: "bg-amber-500",
    tagBg: "bg-amber-500/10",
    tagText: "text-amber-400",
    glow: "rgba(245,158,11,0.15)",
    gradientFrom: "from-amber-500/20",
    gradientTo: "to-amber-500/5",
  },
  rose: {
    border: "border-rose-500/20",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    dot: "bg-rose-500",
    tagBg: "bg-rose-500/10",
    tagText: "text-rose-400",
    glow: "rgba(244,63,94,0.15)",
    gradientFrom: "from-rose-500/20",
    gradientTo: "to-rose-500/5",
  },
};

/* ------------------------------------------------------------------ */
/*  Per-technology color badges                                       */
/* ------------------------------------------------------------------ */
const TECH_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  flutter:    { bg: "bg-sky-500/15",     text: "text-sky-400",     border: "border-sky-500/25" },
  dart:       { bg: "bg-sky-500/15",     text: "text-sky-400",     border: "border-sky-500/25" },
  python:     { bg: "bg-yellow-500/15",  text: "text-yellow-400",  border: "border-yellow-500/25" },
  supabase:   { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/25" },
  vercel:     { bg: "bg-zinc-700/30",    text: "text-zinc-300",    border: "border-zinc-600/30" },
  typescript: { bg: "bg-blue-500/15",    text: "text-blue-400",    border: "border-blue-500/25" },
  react:      { bg: "bg-cyan-500/15",    text: "text-cyan-400",    border: "border-cyan-500/25" },
  postgresql: { bg: "bg-indigo-500/15",  text: "text-indigo-400",  border: "border-indigo-500/25" },
  "rest api": { bg: "bg-amber-500/15",   text: "text-amber-400",   border: "border-amber-500/25" },
};

const DEFAULT_TECH_COLOR = { bg: "bg-zinc-700/20", text: "text-zinc-400", border: "border-zinc-600/20" };

function getTechColor(tech: string) {
  return TECH_COLORS[tech.toLowerCase()] ?? DEFAULT_TECH_COLOR;
}

/* ------------------------------------------------------------------ */
/*  Featured detection                                                */
/* ------------------------------------------------------------------ */
function isFeatured(title: string): boolean {
  const lower = title.toLowerCase();
  return lower.includes("silo") || lower.includes("clave");
}

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-6 animate-pulse">
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-zinc-800 rounded-xl" />
            <div>
              <div className="h-5 w-28 bg-zinc-800 rounded mb-2" />
              <div className="h-3 w-40 bg-zinc-800/60 rounded" />
            </div>
          </div>
          <div className="h-4 w-20 bg-zinc-800 rounded" />
        </div>
        <div className="aspect-video w-full rounded-xl bg-zinc-800/50" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-zinc-800/60 rounded" />
          <div className="h-3 w-4/5 bg-zinc-800/60 rounded" />
          <div className="h-3 w-3/5 bg-zinc-800/60 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-zinc-800/60 rounded-md" />
          <div className="h-6 w-16 bg-zinc-800/60 rounded-md" />
          <div className="h-6 w-16 bg-zinc-800/60 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tech badge component                                              */
/* ------------------------------------------------------------------ */
function TechBadge({ tech }: { tech: string }) {
  const c = getTechColor(tech);
  return (
    <span
      className={`${c.bg} ${c.text} ${c.border} border rounded-md px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider`}
    >
      {tech}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Gradient initial-letter placeholder                               */
/* ------------------------------------------------------------------ */
function InitialLetterPlaceholder({
  title,
  colors,
  featured,
}: {
  title: string;
  colors: (typeof accentMap)[string];
  featured: boolean;
}) {
  return (
    <div
      className={`${
        featured ? "aspect-[21/9]" : "aspect-video"
      } w-full rounded-xl bg-gradient-to-br ${colors.gradientFrom} ${colors.gradientTo} border border-white/5 flex items-center justify-center overflow-hidden`}
    >
      <span
        className={`font-display font-bold ${
          featured ? "text-7xl" : "text-5xl"
        } ${colors.text} opacity-30 select-none`}
      >
        {title.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

export default function ProjectsGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [projects, setProjects] = useState<SupabaseProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch projects:", error);
      }

      if (data && data.length > 0) {
        setProjects(data);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  // Separate featured projects from the rest
  const featuredProjects = projects.filter((p) => isFeatured(p.title));
  const regularProjects = projects.filter((p) => !isFeatured(p.title));
  const sortedProjects = [...featuredProjects, ...regularProjects];

  return (
    <section id="projects" className="px-6 py-20">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
              Software Engineering
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-100 tracking-tight">
            Featured Projects
          </h2>
          <p className="font-sans text-sm text-zinc-500 mt-3 max-w-xl">
            Production applications and active development — built from concept to deployment.
          </p>
        </motion.div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : projects.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <Code2 className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
              <p className="font-mono text-sm text-zinc-600">No projects found in database.</p>
            </div>
          ) : (
            sortedProjects.map((project, index) => {
              const accentKey = ACCENT_CYCLE[index % ACCENT_CYCLE.length];
              const colors = accentMap[accentKey];
              const featured = isFeatured(project.title);

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`group relative bg-zinc-900/70 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 transition-all duration-300 hover:border-zinc-700/80 hover:-translate-y-1 overflow-hidden ${
                    featured ? "lg:col-span-2" : ""
                  }`}
                  style={{
                    boxShadow:
                      hoveredIndex === index
                        ? `0 20px 60px -15px ${colors.glow}, 0 0 0 1px ${colors.glow}`
                        : "0 4px 20px -5px rgba(0,0,0,0.3)",
                  }}
                >
                  {/* Top accent line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-500 ${
                      hoveredIndex === index ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      background: `linear-gradient(90deg, transparent, ${colors.glow.replace("0.15", "0.8")}, transparent)`,
                    }}
                  />

                  <div className={`${featured ? "space-y-6" : "space-y-5"}`}>
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 ${colors.bg} border ${colors.border} rounded-xl flex items-center justify-center ${colors.text}`}>
                          <Code2 className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-xl text-zinc-100 flex items-center gap-2">
                            {project.title}
                            {project.live_url && (
                              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                                <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                              </a>
                            )}
                            {!project.live_url && (
                              <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                            )}
                          </h3>
                        </div>
                      </div>

                      {/* Status badge — single instance */}
                      <div className="flex items-center gap-2">
                        {featured && (
                          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[10px] font-semibold uppercase tracking-wider rounded-full px-2.5 py-1">
                            <Star className="h-3 w-3" />
                            Featured
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 bg-zinc-800/60 border border-zinc-700/40 rounded-full px-2.5 py-1">
                          <span className={`h-2 w-2 rounded-full ${colors.dot} animate-pulse`} />
                          <span className="font-mono text-[10px] text-zinc-400">{project.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* Gradient initial-letter placeholder */}
                    <InitialLetterPlaceholder
                      title={project.title}
                      colors={colors}
                      featured={featured}
                    />

                    {/* Description */}
                    <p
                      className={`font-sans text-sm text-zinc-400 leading-relaxed ${
                        featured ? "text-base max-w-2xl" : ""
                      }`}
                    >
                      {project.description}
                    </p>

                    {/* Tech-stack badges */}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.tech_stack.map((tag) => (
                          <TechBadge key={tag} tech={tag} />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

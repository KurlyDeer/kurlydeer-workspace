import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Plus, Filter, Github, Globe, Calendar, Terminal, X, ChevronRight, RefreshCw, Trash2, Server, Code, Smartphone, Network } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Project } from "../types";

interface ProjectGridProps {
  projects: Project[];
  onAddProject: (p: Omit<Project, "id" | "createdAt">) => void;
  onDeleteProject: (id: string) => void;
  onResetProjects: () => void;
}

export default function ProjectGrid({ projects, onAddProject, onDeleteProject, onResetProjects }: ProjectGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newProj, setNewProj] = useState({
    title: "",
    description: "",
    category: "Software Development" as Project["category"],
    status: "In Progress" as Project["status"],
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    readme: ""
  });

  const categories = ["All", "Enterprise Infrastructure", "Software Development", "Networking", "Mobile Apps"];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Enterprise Infrastructure":
      case "Systems & CLI":
        return <Server className="h-4 w-4 text-indigo-400 shrink-0" />;
      case "Networking":
        return <Network className="h-4 w-4 text-blue-400 shrink-0" />;
      case "Mobile Apps":
        return <Smartphone className="h-4 w-4 text-emerald-400 shrink-0" />;
      default:
        return <Code className="h-4 w-4 text-emerald-400 shrink-0" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Enterprise Infrastructure":
      case "Systems & CLI":
        return "group-hover:bg-indigo-500/20";
      case "Networking":
        return "group-hover:bg-blue-500/20";
      case "Mobile Apps":
        return "group-hover:bg-emerald-500/20";
      default:
        return "group-hover:bg-emerald-500/20";
    }
  };

  // Filter project arrays
  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.technologies.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" || proj.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProj.title || !newProj.description) return;

    const formattedTech = newProj.technologies
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onAddProject({
      title: newProj.title,
      description: newProj.description,
      category: newProj.category,
      status: newProj.status,
      technologies: formattedTech.length > 0 ? formattedTech : ["React", "TypeScript"],
      githubUrl: newProj.githubUrl || undefined,
      liveUrl: newProj.liveUrl || undefined,
      readme: newProj.readme || `# ${newProj.title}\n\nNo detailed logs registered yet.`
    });

    // Reset Form
    setNewProj({
      title: "",
      description: "",
      category: "Full-Stack",
      status: "In Progress",
      technologies: "",
      githubUrl: "",
      liveUrl: "",
      readme: ""
    });
    setIsAddModalOpen(false);
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "In Progress":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Prototyping":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "Research":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Search and Action Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
            <input
              id="project-search"
              type="text"
              placeholder="Search specifications, keywords, stack tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-805 rounded-xl pl-10 pr-4 py-3 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Quick Clear Filter / Reset Controls */}
          <div className="flex gap-2">
            <button
              id="reset-project-list-btn"
              onClick={onResetProjects}
              title="Reset dashboard to clean core presets"
              className="px-3 py-3 bg-zinc-950 border border-zinc-805 hover:border-zinc-700 hover:text-emerald-400 rounded-xl font-mono text-[11px] text-zinc-400 flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            <button
              id="open-add-project-modal"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-sans font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[3px]" />
              <span>Register Lab App</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category filter selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="h-4 w-4 text-zinc-500 shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            id={`category-filter-${cat.replace(/\s+/g, "-")}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-sans text-xs font-medium tracking-wide transition-all ${
              selectedCategory === cat
                ? "bg-zinc-100 text-zinc-950"
                : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid Display */}
      {filteredProjects.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
          <Terminal className="h-10 w-10 text-zinc-650 mx-auto mb-3" />
          <p className="font-sans text-sm text-zinc-300 font-medium">No projects found matching current criteria</p>
          <p className="font-mono text-[10px] text-zinc-500 mt-1">Try broadening search parameters or check your categories</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredProjects.map((proj) => (
            <motion.div
              key={proj.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)" }}
              transition={{ duration: 0.2 }}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-5 rounded-2xl flex flex-col justify-between transition-all duration-200 relative group overflow-hidden shadow-lg"
            >
              {/* Category indicator line */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-transparent ${getCategoryColor(proj.category)} transition-all`}></div>

              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {getCategoryIcon(proj.category)}
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">{proj.category}</span>
                  </div>
                  <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded border ${getStatusColor(proj.status)}`}>
                    {proj.status}
                  </span>
                </div>

                <h3 className="font-display font-semibold text-base text-zinc-100 tracking-wide mt-2 group-hover:text-emerald-400 transition-colors">
                  {proj.title}
                </h3>
                
                <p className="font-sans text-xs text-zinc-400 leading-relaxed mt-2 line-clamp-3">
                  {proj.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {proj.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[10px] bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-850 px-2 py-0.5 rounded transition"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Controls */}
              <div className="mt-6 pt-4 border-t border-zinc-850/60 flex items-center justify-between">
                <span className="font-mono text-[9px] text-zinc-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {proj.createdAt}
                </span>

                <div className="flex items-center gap-2">
                  {/* Delete custom project if it isn't a preset */}
                  {!proj.id.startsWith("proj_") && (
                    <button
                      title="Decommission project registry"
                      onClick={() => onDeleteProject(proj.id)}
                      className="p-1.5 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 rounded-lg border border-transparent hover:border-rose-500/20 transition mr-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}

                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="p-1.5 bg-zinc-950 border border-zinc-850 hover:border-zinc-700 hover:text-zinc-100 rounded-lg text-zinc-400 transition"
                      title="Explore repository details"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  )}

                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="p-1.5 bg-zinc-955 border border-zinc-850 hover:border-zinc-700 hover:text-emerald-400 rounded-lg text-emerald-500 transition"
                      title="Open deployed application"
                    >
                      <Globe className="h-3.5 w-3.5" />
                    </a>
                  )}

                  <button
                    onClick={() => setSelectedProject(proj)}
                    className="flex items-center gap-1 font-sans font-semibold text-[11px] bg-zinc-950 hover:bg-zinc-800 text-zinc-200 hover:text-emerald-400 border border-zinc-850 px-2 py-1.5 rounded-lg transition overflow-hidden cursor-pointer"
                  >
                    <span>Spec</span>
                    <ChevronRight className="h-3.5 w-3.5 mt-[0.5px]" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* REGISTER NEW APPLICATION MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <div className="flex items-center justify-between p-5 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4.5 w-4.5 text-emerald-400" />
                  <h3 className="font-display font-semibold text-sm text-zinc-100 uppercase tracking-widest">
                    Register New Lab App
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-zinc-500 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Title */}
                <div className="space-y-1">
                  <label htmlFor="reg-title" className="font-mono text-[10px] text-zinc-500 uppercase tracking-wide">
                    Project Display Title *
                  </label>
                  <input
                    id="reg-title"
                    type="text"
                    required
                    value={newProj.title}
                    onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                    placeholder="e.g. Synapse Cluster Client"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-emerald-500 transition"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label htmlFor="reg-desc" className="font-mono text-[10px] text-zinc-500 uppercase tracking-wide">
                    Short Description Abstract *
                  </label>
                  <textarea
                    id="reg-desc"
                    required
                    rows={2}
                    value={newProj.description}
                    onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                    placeholder="Brief 2-sentence breakdown of intent, language, and core value."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1">
                    <label htmlFor="reg-cat" className="font-mono text-[10px] text-zinc-500 uppercase tracking-wide">
                      Lab Category
                    </label>
                    <select
                      id="reg-cat"
                      value={newProj.category}
                      onChange={(e) => setNewProj({ ...newProj, category: e.target.value as Project["category"] })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 outline-none focus:border-emerald-500 transition cursor-pointer"
                    >
                      <option value="Enterprise Infrastructure">Enterprise Infrastructure</option>
                      <option value="Networking">Networking</option>
                      <option value="Software Development">Software Development</option>
                      <option value="Mobile Apps">Mobile Apps</option>
                      <option value="Misc">Misc</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label htmlFor="reg-status" className="font-mono text-[10px] text-zinc-500 uppercase tracking-wide">
                      Active Status
                    </label>
                    <select
                      id="reg-status"
                      value={newProj.status}
                      onChange={(e) => setNewProj({ ...newProj, status: e.target.value as Project["status"] })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 outline-none focus:border-emerald-500 transition cursor-pointer"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Prototyping">Prototyping</option>
                      <option value="Research">Research</option>
                    </select>
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-1">
                  <label htmlFor="reg-techs" className="font-mono text-[10px] text-zinc-500 uppercase tracking-wide">
                    Technology Tags (comma-separated)
                  </label>
                  <input
                    id="reg-techs"
                    type="text"
                    value={newProj.technologies}
                    onChange={(e) => setNewProj({ ...newProj, technologies: e.target.value })}
                    placeholder="e.g. Go, Rust, WebAssembly, React"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Repo URL */}
                  <div className="space-y-1">
                    <label htmlFor="reg-github" className="font-mono text-[10px] text-zinc-500 uppercase tracking-wide">
                      GitHub Source Link URL
                    </label>
                    <input
                      id="reg-github"
                      type="url"
                      value={newProj.githubUrl}
                      onChange={(e) => setNewProj({ ...newProj, githubUrl: e.target.value })}
                      placeholder="https://github.com/profile/repo"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Live URL */}
                  <div className="space-y-1">
                    <label htmlFor="reg-live" className="font-mono text-[10px] text-zinc-500 uppercase tracking-wide">
                      Live Application Demo URL
                    </label>
                    <input
                      id="reg-live"
                      type="url"
                      value={newProj.liveUrl}
                      onChange={(e) => setNewProj({ ...newProj, liveUrl: e.target.value })}
                      placeholder="https://my-demo-hub.com"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                {/* Readme Markdown */}
                <div className="space-y-1">
                  <label htmlFor="reg-readme" className="font-mono text-[10px] text-zinc-500 uppercase tracking-wide flex justify-between items-center">
                    <span>Readme Specification Draft (Markdown supported)</span>
                    <span className="text-[9px] text-zinc-650 tracking-normal text-right"># Title, ## Headers</span>
                  </label>
                  <textarea
                    id="reg-readme"
                    rows={5}
                    value={newProj.readme}
                    onChange={(e) => setNewProj({ ...newProj, readme: e.target.value })}
                    placeholder="# Detailed specs...&#13;Write deployment parameters, architecture tables, or code samples."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-emerald-500 transition font-mono"
                  />
                </div>

                <button
                  id="reg-project-submit"
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-sans font-semibold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Mount Project to Core Hub</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PROJECT README SPEC DETAILED DIALOG */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 bg-zinc-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950/40">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest">{selectedProject.category}</span>
                    <span className="text-zinc-600 font-sans text-xs">/</span>
                    <span className="font-sans text-xs text-zinc-500">{selectedProject.createdAt}</span>
                  </div>
                  <h3 className="font-display font-semibold text-sm text-zinc-100 uppercase mt-0.5 tracking-wide">
                    {selectedProject.title} Specification
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1 px-1 text-zinc-500 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Readme rendering area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div>
                  <p className="font-sans text-xs text-zinc-300 leading-relaxed bg-zinc-950 border border-zinc-850 p-4 rounded-xl">
                    <span className="font-mono text-[10px] text-zinc-500 block mb-1 font-semibold">Abstract:</span>
                    {selectedProject.description}
                  </p>
                </div>

                <div className="prose prose-invert prose-emerald max-w-none text-zinc-300">
                  <div className="markdown-body text-xs leading-relaxed space-y-4">
                    <Markdown remarkPlugins={[remarkGfm]}>{selectedProject.readme}</Markdown>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-850">
                  {selectedProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[10px] bg-zinc-950 text-emerald-400/90 border border-emerald-500/10 px-2 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 flex items-center justify-between font-mono text-[10px]">
                <span className="text-zinc-500">Status ID: {selectedProject.status}</span>
                <div className="flex gap-2">
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 rounded-lg text-zinc-400 transition flex items-center gap-1"
                    >
                      <Github className="h-3 w-3" /> Repo
                    </a>
                  )}
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-emerald-400 rounded-lg text-emerald-500 transition flex items-center gap-1"
                    >
                      <Globe className="h-3 w-3" /> Active Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

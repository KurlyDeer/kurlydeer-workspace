import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Plus, BookOpen, Terminal, X, ChevronLeft, Eye, Edit3, Calendar, Tag, ShieldAlert, Sparkles, RefreshCw, Trash2, ArrowRight } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BlogPost } from "../types";

interface BlogSectionProps {
  blogs: BlogPost[];
  onAddBlog: (b: Omit<BlogPost, "id" | "publishedAt">) => void;
  onDeleteBlog: (id: string) => void;
  onResetBlogs: () => void;
}

export default function BlogSection({ blogs, onAddBlog, onDeleteBlog, onResetBlogs }: BlogSectionProps) {
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Editor states
  const [newBlog, setNewBlog] = useState({
    title: "",
    summary: "",
    category: "Distributed Systems",
    tags: "",
    difficulty: "Intermediate" as BlogPost["difficulty"],
    content: `# My Lab Report\n\n## 1. Abstract\nDiscuss your experiment or app design parameter logs here.\n\n## 2. Experimental Data Table\n\n| Cycle ID | Ingress Rate | Error Ratio |\n|---|---|---|\n| L1-Node | 450 req/s | 0.00% |\n| L2-Node | 890 req/s | 0.02% |`
  });

  const categories = ["All", "Distributed Systems", "AI & Embedded", "Web Engineering", "Other Systems"];

  // Filter blog list
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleEditorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.summary || !newBlog.content) return;

    const formattedTags = newBlog.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onAddBlog({
      title: newBlog.title,
      summary: newBlog.summary,
      category: newBlog.category,
      tags: formattedTags.length > 0 ? formattedTags : ["Lab Log", "Tech Systems"],
      difficulty: newBlog.difficulty,
      content: newBlog.content,
      readTime: `${Math.ceil(newBlog.content.split(/\s+/).length / 150)} min read`,
      author: "Portfolio Controller"
    });

    // Reset Form & Editor views
    setNewBlog({
      title: "",
      summary: "",
      category: "Distributed Systems",
      tags: "",
      difficulty: "Intermediate",
      content: `# My Lab Report\n\n## 1. Abstract\nDiscuss your experiment or app design parameter logs here.\n\n## 2. Experimental Data Table\n\n| Cycle ID | Ingress Rate | Error Ratio |\n|---|---|---|\n| L1-Node | 450 req/s | 0.00% |\n| L2-Node | 890 req/s | 0.02% |`
    });
    setIsEditorOpen(false);
  };

  const getDifficultyColor = (diff: BlogPost["difficulty"]) => {
    switch (diff) {
      case "Introductory":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
      case "Intermediate":
        return "bg-sky-500/10 text-sky-400 border-sky-500/25";
      case "Advanced":
        return "bg-amber-500/10 text-amber-400 border-amber-500/25";
      case "Expert":
        return "bg-rose-500/10 text-rose-400 border-rose-500/25 animate-pulse";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <AnimatePresence mode="wait">
        {/* VIEW ARCHIVE MODE (BLOG INDEX LIST) */}
        {!activeBlog && !isEditorOpen && (
          <motion.div
            key="blog-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
              <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-grow">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
                  <input
                    id="blog-search"
                    type="text"
                    placeholder="Search logs, keywords, compilation notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-805 rounded-xl pl-10 pr-4 py-3 text-xs text-zinc-200 placeholder-zinc-650 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    id="reset-blog-archive-btn"
                    onClick={onResetBlogs}
                    title="Restore pristine lab records"
                    className="px-3 py-3 bg-zinc-950 border border-zinc-805 hover:border-zinc-700 hover:text-emerald-400 rounded-xl font-mono text-[11px] text-zinc-400 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Reset Baseline Docs</span>
                  </button>

                  <button
                    id="open-blog-editor-btn"
                    onClick={() => setIsEditorOpen(true)}
                    className="px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-sans font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] cursor-pointer"
                  >
                    <Plus className="h-4 w-4 stroke-[3px]" />
                    <span>Post Tech Report</span>
                  </button>
                </div>
              </div>
            </div>

            {/* category slider */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  id={`blog-filter-${cat.replace(/\s+/g, "-")}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-sans text-xs font-medium tracking-wide transition-all shrink-0 ${
                    selectedCategory === cat
                      ? "bg-zinc-100 text-zinc-950 font-medium"
                      : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* blog listings */}
            {filteredBlogs.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                <BookOpen className="h-10 w-10 text-zinc-650 mx-auto mb-3" />
                <p className="font-sans text-sm text-zinc-300 font-medium">No documentation reports logged</p>
                <p className="font-mono text-[10px] text-zinc-500 mt-1">Adjust search parameters or insert a fresh custom technical article above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBlogs.map((blog) => (
                  <motion.div
                    key={blog.id}
                    onClick={() => setActiveBlog(blog)}
                    className="bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 hover:border-zinc-700/80 p-5 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-2 flex-grow">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded border ${getDifficultyColor(blog.difficulty)}`}>
                          {blog.difficulty}
                        </span>
                        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                          {blog.category}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-zinc-800"></span>
                        <span className="font-mono text-[10px] text-zinc-500">{blog.publishedAt}</span>
                      </div>

                      <h3 className="font-display font-medium text-base text-zinc-100 mt-1 group-hover:text-emerald-400 transition-colors">
                        {blog.title}
                      </h3>

                      <p className="font-sans text-xs text-zinc-400 line-clamp-2 max-w-4xl leading-relaxed">
                        {blog.summary}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {blog.tags.map((tag) => (
                          <span key={tag} className="font-mono text-[9px] bg-zinc-950 text-zinc-550 px-1.5 py-0.5 rounded border border-zinc-900">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-zinc-850/60 pt-3 sm:pt-0 shrink-0 select-none">
                      <span className="font-mono text-[10px] text-zinc-500">{blog.readTime}</span>
                      
                      <div className="flex items-center gap-2 mt-2">
                        {/* Delete customized journal reports */}
                        {!blog.id.startsWith("blog_") && (
                          <button
                            title="Discard technical report"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteBlog(blog.id);
                            }}
                            className="p-1 px-1.5 hover:bg-rose-500/10 text-zinc-650 hover:text-rose-400 rounded border border-transparent hover:border-rose-500/25 transition cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}

                        <span className="font-sans text-xs text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          View <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* DETAILED ARTICLE READER MODE */}
        {activeBlog && (
          <motion.article
            key="blog-details"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-6 md:p-8 space-y-6"
          >
            {/* Back to list controller */}
            <div className="flex justify-between items-center pb-4 border-b border-zinc-850">
              <button
                id="back-to-blog-archive"
                onClick={() => setActiveBlog(null)}
                className="flex items-center gap-1.5 font-sans font-semibold text-xs text-zinc-400 hover:text-zinc-200 transition bg-zinc-950 border border-zinc-850 px-3 py-2 rounded-xl cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Return to Archive</span>
              </button>

              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className="text-zinc-500">Log Protocol ID: {activeBlog.id}</span>
              </div>
            </div>

            {/* Document Header Panel */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${getDifficultyColor(activeBlog.difficulty)}`}>
                  {activeBlog.difficulty} level
                </span>
                <span className="font-mono text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                  {activeBlog.category}
                </span>
                <span className="text-zinc-650">•</span>
                <span className="font-mono text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-zinc-500" /> {activeBlog.publishedAt}
                </span>
                <span className="text-zinc-650">•</span>
                <span className="font-mono text-[11px] text-zinc-400">{activeBlog.readTime}</span>
              </div>

              <h1 className="font-display font-bold text-2xl md:text-3xl text-zinc-100 tracking-tight leading-tight pt-1">
                {activeBlog.title}
              </h1>

              <p className="font-sans text-sm text-zinc-400 italic bg-zinc-950 border-l-2 border-emerald-500 p-3.5 rounded-r-xl">
                {activeBlog.summary}
              </p>
            </div>

            {/* Computed Markdown Content layout */}
            <div className="prose prose-invert prose-emerald max-w-none text-zinc-300 border-t border-zinc-850 pt-6">
              <div className="markdown-body text-xs md:text-sm leading-relaxed space-y-5">
                <Markdown remarkPlugins={[remarkGfm]}>{activeBlog.content}</Markdown>
              </div>
            </div>

            {/* Meta Footer list */}
            <div className="pt-6 border-t border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-zinc-500">
              <div className="flex items-center gap-2">
                <Tag className="h-3.5 w-3.5" />
                <span>INDEX TAGS:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeBlog.tags.map((tag) => (
                    <span key={tag} className="text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900 text-[10px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <span>Author Token: {activeBlog.author}</span>
            </div>
          </motion.article>
        )}

        {/* DOUBLE-PANE DOCK EDITOR WORKSPACE FOR NEW LOGS */}
        {isEditorOpen && (
          <motion.div
            key="blog-editor"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Control Header */}
            <div className="flex justify-between items-center bg-zinc-90 w-full p-4 border border-zinc-800 rounded-2xl bg-zinc-900">
              <div className="flex items-center gap-2 font-display">
                <Terminal className="h-4.5 w-4.5 text-emerald-400" />
                <h3 className="font-semibold text-xs tracking-widest uppercase text-zinc-200">
                  Technical Workspace Draft Mode
                </h3>
              </div>

              <button
                id="close-blog-editor"
                onClick={() => setIsEditorOpen(false)}
                className="flex items-center gap-1 px-3 py-1.5 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-400 hover:text-zinc-200 rounded-lg transition scroll-smooth cursor-pointer"
              >
                <X className="h-4 w-4" />
                Cancel Draft
              </button>
            </div>

            {/* Double Pane Splitted layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* LEFT PANE - WRITING INPUT FORM */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <h4 className="font-mono text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1 px-1">
                  <Edit3 className="h-3.5 w-3.5 text-emerald-400" /> Edit Metadata & body markdown
                </h4>

                <form onSubmit={handleEditorSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="blog-title" className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
                      Document Title *
                    </label>
                    <input
                      id="blog-title"
                      type="text"
                      required
                      placeholder="e.g., Analyzing Core V-DOM Diffing Algorithms"
                      value={newBlog.title}
                      onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-emerald-500 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="blog-summary" className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
                      Synopsis Abstract Summary *
                    </label>
                    <input
                      id="blog-summary"
                      type="text"
                      required
                      placeholder="A short concise, one-sentence abstract explaining target findings."
                      value={newBlog.summary}
                      onChange={(e) => setNewBlog({ ...newBlog, summary: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-emerald-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="blog-cat" className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
                        Archive Category
                      </label>
                      <select
                        id="blog-cat"
                        value={newBlog.category}
                        onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 outline-none focus:border-emerald-500 transition cursor-pointer"
                      >
                        <option value="Distributed Systems">Distributed Systems</option>
                        <option value="AI & Embedded">AI & Embedded</option>
                        <option value="Web Engineering">Web Engineering</option>
                        <option value="Other Systems">Other Systems</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="blog-difficulty" className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
                        Document Difficulty
                      </label>
                      <select
                        id="blog-difficulty"
                        value={newBlog.difficulty}
                        onChange={(e) => setNewBlog({ ...newBlog, difficulty: e.target.value as BlogPost["difficulty"] })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 outline-none focus:border-emerald-500 transition cursor-pointer"
                      >
                        <option value="Introductory">Introductory</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="blog-tags" className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
                      Index tags / Keywords (comma-separated)
                    </label>
                    <input
                      id="blog-tags"
                      type="text"
                      placeholder="e.g. Go, Consensus, Networks"
                      value={newBlog.tags}
                      onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-emerald-500 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label htmlFor="blog-content" className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
                        Body Content Markdown *
                      </label>
                      <span className="text-[9px] text-zinc-600 font-mono text-right">Markdown syntax supported</span>
                    </div>
                    <textarea
                      id="blog-content"
                      required
                      rows={12}
                      value={newBlog.content}
                      onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-880 rounded-lg p-3 text-xs text-zinc-200 placeholder-zinc-700 outline-none focus:border-emerald-500 transition font-mono leading-relaxed"
                    />
                  </div>

                  <button
                    id="blog-publish-submit"
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-sans font-semibold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Publish Report Document</span>
                  </button>
                </form>
              </div>

              {/* RIGHT PANE - LIVE RENDER PREVIEW */}
              <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h4 className="font-mono text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1 mb-4 px-1">
                    <Eye className="h-3.5 w-3.5 text-sky-400" /> Compiled output preview log
                  </h4>

                  <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl min-h-[300px] max-h-[500px] overflow-y-auto space-y-4">
                    {/* Render live title and description in preview */}
                    {newBlog.title && (
                      <div>
                        <h2 className="font-display font-semibold text-sm text-zinc-100">{newBlog.title}</h2>
                        <span className="font-mono text-[9px] text-emerald-400 mt-1 block">{newBlog.category} // {newBlog.difficulty}</span>
                      </div>
                    )}
                    
                    <div className="prose prose-invert prose-emerald select-none">
                      <div className="markdown-body text-xs leading-relaxed space-y-4 text-zinc-300">
                        <Markdown remarkPlugins={[remarkGfm]}>{newBlog.content}</Markdown>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-zinc-950 border border-zinc-850 rounded-xl text-[10px] font-mono text-zinc-500 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-500/80 mr-1 shrink-0" />
                  <span>The live compiler processes headers, tables, links, bold states, and scripts on-the-fly dynamically.</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Database,
  Save,
  FolderKanban,
  PenLine,
  Activity,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Youtube,
  X,
  CheckCircle2,
  Circle,
  Loader2,
} from "lucide-react";

type Tab = "projects" | "content" | "status";

interface ProjectDraft {
  title: string;
  description: string;
  tags: string[];
  tagInput: string;
  status: "In Progress" | "Completed";
}

interface ContentDraft {
  title: string;
  markdown: string;
  youtubeUrl: string;
  publishState: "draft" | "published";
}

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Availability toggle
  const [isAvailable, setIsAvailable] = useState(true);

  // Load initial availability from Supabase
  useEffect(() => {
    const loadAvailability = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key_name", "availability_status")
        .single();
      if (data) {
        setIsAvailable(data.value === "available");
      }
    };
    loadAvailability();
  }, []);

  const handleToggleAvailability = async () => {
    const newValue = !isAvailable;
    setIsAvailable(newValue);
    const { error } = await supabase
      .from("site_settings")
      .update({ value: newValue ? "available" : "engaged" })
      .eq("key_name", "availability_status");
    if (error) {
      console.error("Supabase availability update error:", error);
      setIsAvailable(!newValue); // revert on failure
      showSaveConfirmation("Error updating status");
    } else {
      console.log("Availability status updated to:", newValue ? "available" : "engaged");
      showSaveConfirmation(newValue ? "Status: Available" : "Status: Engaged");
    }
  };

  // Project form state
  const [project, setProject] = useState<ProjectDraft>({
    title: "",
    description: "",
    tags: [],
    tagInput: "",
    status: "In Progress",
  });

  // Content form state
  const [content, setContent] = useState<ContentDraft>({
    title: "",
    markdown: "",
    youtubeUrl: "",
    publishState: "draft",
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const showSaveConfirmation = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleAddTag = () => {
    const tag = project.tagInput.trim();
    if (tag && !project.tags.includes(tag)) {
      setProject((p) => ({ ...p, tags: [...p.tags, tag], tagInput: "" }));
    }
  };

  const handleRemoveTag = (tag: string) => {
    setProject((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));
  };

  const handleSaveProject = async () => {
    if (!project.title) return;
    setSaving(true);
    const { error } = await supabase.from("projects").insert([
      {
        title: project.title,
        description: project.description,
        tech_stack: project.tags,
        status: project.status,
        live_url: null,
      },
    ]);
    setSaving(false);
    if (error) {
      console.error("Supabase project insert error:", error);
      showSaveConfirmation("Error: " + error.message);
    } else {
      console.log("Project saved to Supabase successfully");
      showSaveConfirmation("Project saved to Supabase");
      setProject({ title: "", description: "", tags: [], tagInput: "", status: "In Progress" });
    }
  };

  const handleSaveContent = async () => {
    if (!content.title) return;
    setSaving(true);
    const { error } = await supabase.from("posts").insert([
      {
        title: content.title,
        body: content.markdown,
        youtube_url: content.youtubeUrl || null,
        status: content.publishState,
      },
    ]);
    setSaving(false);
    if (error) {
      console.error("Supabase post insert error:", error);
      showSaveConfirmation("Error: " + error.message);
    } else {
      console.log(`Post ${content.publishState === "published" ? "published" : "saved as draft"} to Supabase`);
      showSaveConfirmation(`Post ${content.publishState === "published" ? "published" : "saved as draft"}`);
      setContent({ title: "", markdown: "", youtubeUrl: "", publishState: "draft" });
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "projects", label: "Projects", icon: <FolderKanban className="h-4 w-4" /> },
    { id: "content", label: "Content", icon: <PenLine className="h-4 w-4" /> },
    { id: "status", label: "Status", icon: <Activity className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/60 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
              <Database className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wide">
                Admin CMS
              </h1>
              <p className="font-mono text-[9px] text-zinc-500 truncate max-w-[160px]">
                {user?.email || "admin@local"}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="h-9 w-9 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 hover:text-rose-400 hover:border-rose-500/30 transition-all cursor-pointer"
            aria-label="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Tab Bar — mobile-friendly horizontal scroll */}
      <nav className="sticky top-[57px] z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/40 px-4">
        <div className="max-w-3xl mx-auto flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-display font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer border-b-2 ${
                activeTab === tab.id
                  ? "text-emerald-400 border-emerald-400"
                  : "text-zinc-500 border-transparent hover:text-zinc-300"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Save Confirmation Toast */}
      {saveMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-zinc-950 font-display font-bold text-sm px-5 py-2.5 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center gap-2 animate-[fadeIn_0.2s_ease-out]">
          <CheckCircle2 className="h-4 w-4" />
          {saveMessage}
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 py-6 pb-20">
        <div className="max-w-3xl mx-auto">

          {/* ═══════════════════════════════════════ */}
          {/* PROJECTS MANAGER TAB                    */}
          {/* ═══════════════════════════════════════ */}
          {activeTab === "projects" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-zinc-100">New Project</h2>
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-widest font-semibold cursor-pointer transition-all ${
                    project.status === "In Progress"
                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}
                  onClick={() =>
                    setProject((p) => ({
                      ...p,
                      status: p.status === "In Progress" ? "Completed" : "In Progress",
                    }))
                  }
                >
                  {project.status === "In Progress" ? (
                    <Circle className="h-3 w-3" />
                  ) : (
                    <CheckCircle2 className="h-3 w-3" />
                  )}
                  {project.status}
                </div>
              </div>

              <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
                {/* Title */}
                <div>
                  <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5 block">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => setProject((p) => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Silo Finance App"
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans placeholder:text-zinc-700"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5 block">
                    Description
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => setProject((p) => ({ ...p, description: e.target.value }))}
                    rows={4}
                    placeholder="Describe the project scope and tech stack..."
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans resize-none placeholder:text-zinc-700"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5 block">
                    Tech Stack Tags
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={project.tagInput}
                      onChange={(e) => setProject((p) => ({ ...p, tagInput: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                      placeholder="Add tag..."
                      className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans placeholder:text-zinc-700"
                    />
                    <button
                      onClick={handleAddTag}
                      className="h-10 w-10 bg-zinc-800 border border-zinc-700/50 rounded-lg flex items-center justify-center text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider"
                        >
                          {tag}
                          <button onClick={() => handleRemoveTag(tag)} className="hover:text-rose-400 transition-colors cursor-pointer">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveProject}
                  disabled={saving || !project.title}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-display font-bold text-sm rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] cursor-pointer flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "Saving..." : "Save Project"}
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* CONTENT STUDIO TAB                      */}
          {/* ═══════════════════════════════════════ */}
          {activeTab === "content" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-zinc-100">Content Studio</h2>
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-widest font-semibold cursor-pointer transition-all ${
                    content.publishState === "published"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                  onClick={() =>
                    setContent((c) => ({
                      ...c,
                      publishState: c.publishState === "draft" ? "published" : "draft",
                    }))
                  }
                >
                  {content.publishState === "published" ? (
                    <ToggleRight className="h-3.5 w-3.5" />
                  ) : (
                    <ToggleLeft className="h-3.5 w-3.5" />
                  )}
                  {content.publishState === "published" ? "Publish" : "Draft"}
                </div>
              </div>

              <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
                {/* Post Title */}
                <div>
                  <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5 block">
                    Post Title
                  </label>
                  <input
                    type="text"
                    value={content.title}
                    onChange={(e) => setContent((c) => ({ ...c, title: e.target.value }))}
                    placeholder="e.g. Optimizing Homelab Energy Consumption"
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans placeholder:text-zinc-700"
                  />
                </div>

                {/* YouTube URL */}
                <div>
                  <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5 block">
                    YouTube URL (Optional)
                  </label>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-2.5 h-4 w-4 text-zinc-600" />
                    <input
                      type="text"
                      value={content.youtubeUrl}
                      onChange={(e) => setContent((c) => ({ ...c, youtubeUrl: e.target.value }))}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all font-mono placeholder:text-zinc-700"
                    />
                  </div>
                </div>

                {/* Markdown Editor */}
                <div>
                  <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5 block">
                    Markdown Body
                  </label>
                  <textarea
                    value={content.markdown}
                    onChange={(e) => setContent((c) => ({ ...c, markdown: e.target.value }))}
                    rows={12}
                    placeholder="# Your Title&#10;&#10;Write your post in Markdown..."
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-mono leading-relaxed resize-none placeholder:text-zinc-700"
                  />
                  <p className="font-mono text-[9px] text-zinc-600 mt-1.5">
                    {content.markdown.length} characters · Markdown supported
                  </p>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveContent}
                  disabled={saving || !content.title}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-display font-bold text-sm rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] cursor-pointer flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving
                    ? "Saving..."
                    : content.publishState === "published"
                    ? "Publish Post"
                    : "Save Draft"}
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* QUICK STATUS TAB                        */}
          {/* ═══════════════════════════════════════ */}
          {activeTab === "status" && (
            <div className="space-y-5">
              <h2 className="font-display font-bold text-lg text-zinc-100">Quick Status</h2>

              <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5 space-y-6">
                {/* Availability Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-sm text-zinc-200">
                      Homepage Availability Beacon
                    </h3>
                    <p className="font-mono text-[10px] text-zinc-500 mt-1">
                      Controls the public status indicator on the Hero section
                    </p>
                  </div>
                  <button
                    onClick={handleToggleAvailability}
                    className="cursor-pointer shrink-0"
                    aria-label="Toggle availability"
                  >
                    {isAvailable ? (
                      <div className="flex items-center gap-2">
                        <ToggleRight className="h-8 w-8 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ToggleLeft className="h-8 w-8 text-zinc-600" />
                      </div>
                    )}
                  </button>
                </div>

                {/* Status Preview */}
                <div className={`rounded-xl p-4 border transition-all ${
                  isAvailable
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-amber-500/5 border-amber-500/20"
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isAvailable ? "bg-emerald-400" : "bg-amber-400"
                      }`} />
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                        isAvailable ? "bg-emerald-500" : "bg-amber-500"
                      }`} />
                    </span>
                    <span className={`font-mono text-[11px] uppercase tracking-widest ${
                      isAvailable ? "text-emerald-400/80" : "text-amber-400/80"
                    }`}>
                      {isAvailable ? "Available for opportunities" : "Currently Engaged"}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-zinc-800/60" />

                {/* System Info */}
                <div className="space-y-3">
                  <h3 className="font-display font-semibold text-sm text-zinc-200">
                    System Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-zinc-950/50 border border-zinc-800/60 rounded-lg p-3">
                      <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">Auth Provider</p>
                      <p className="font-sans text-sm text-zinc-300 mt-1">Supabase</p>
                    </div>
                    <div className="bg-zinc-950/50 border border-zinc-800/60 rounded-lg p-3">
                      <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">Session</p>
                      <p className="font-sans text-sm text-zinc-300 mt-1 truncate">{user?.email || "—"}</p>
                    </div>
                    <div className="bg-zinc-950/50 border border-zinc-800/60 rounded-lg p-3">
                      <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">Framework</p>
                      <p className="font-sans text-sm text-zinc-300 mt-1">Vite + React</p>
                    </div>
                    <div className="bg-zinc-950/50 border border-zinc-800/60 rounded-lg p-3">
                      <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">Database</p>
                      <p className="font-sans text-sm text-zinc-300 mt-1">PostgreSQL (Supabase)</p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-zinc-800/60" />

                {/* Sign Out (large mobile-friendly target) */}
                <button
                  onClick={handleSignOut}
                  className="w-full py-3 bg-zinc-950 hover:bg-rose-500/10 border border-zinc-800 hover:border-rose-500/30 text-zinc-400 hover:text-rose-400 font-display font-bold text-sm rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Terminate Session
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

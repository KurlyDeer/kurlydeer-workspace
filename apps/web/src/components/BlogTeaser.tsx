import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BookOpen, Clock, ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

interface SupabasePost {
  id: string;
  title: string;
  body: string;
  youtube_url: string | null;
  status: string;
  created_at: string;
}

const ACCENT_CYCLE = [
  { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
  { bg: "bg-sky-500/10", border: "border-sky-500/20", text: "text-sky-400" },
  { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
] as const;

function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-6 animate-pulse flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="h-6 w-24 bg-zinc-800 rounded-lg" />
        <div className="h-4 w-16 bg-zinc-800/60 rounded" />
      </div>
      <div className="h-5 w-full bg-zinc-800 rounded mb-2" />
      <div className="h-5 w-3/4 bg-zinc-800/60 rounded mb-4" />
      <div className="mt-4 space-y-2 flex-1">
        <div className="h-2 bg-zinc-800/60 rounded-full w-full" />
        <div className="h-2 bg-zinc-800/60 rounded-full w-4/5" />
        <div className="h-2 bg-zinc-800/60 rounded-full w-3/5" />
      </div>
      <div className="mt-5 pt-4 border-t border-zinc-800/60">
        <div className="h-3 w-20 bg-zinc-800/60 rounded" />
      </div>
    </div>
  );
}

export default function BlogTeaser() {
  const [posts, setPosts] = useState<SupabasePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Failed to fetch posts:", error);
      }

      if (data) {
        setPosts(data);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <section className="px-6 py-20">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-indigo-400" />
              </div>
              <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
                Latest Insights
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-100 tracking-tight">
              From the Blog
            </h2>
            <p className="font-sans text-sm text-zinc-500 mt-3 max-w-xl">
              Technical deep-dives, homelab experiments, and curated interests.
            </p>
          </div>
          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 font-display font-semibold text-sm transition-colors shrink-0"
          >
            View all posts
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : posts.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <FileText className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
              <p className="font-mono text-sm text-zinc-600">No published posts yet.</p>
            </div>
          ) : (
            posts.map((post, index) => {
              const accent = ACCENT_CYCLE[index % ACCENT_CYCLE.length];
              const readTime = estimateReadTime(post.body || "");
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group bg-zinc-900/70 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 hover:border-zinc-700/80 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                >
                  {/* Category & Read Time */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`${accent.bg} border ${accent.border} rounded-lg px-2.5 py-1 flex items-center gap-1.5`}>
                      <BookOpen className={`h-3.5 w-3.5 ${accent.text}`} />
                      <span className={`font-mono text-[10px] ${accent.text} uppercase tracking-widest font-semibold`}>
                        Post
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-600">
                      <Clock className="h-3 w-3" />
                      <span className="font-mono text-[10px]">{readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-lg text-zinc-200 group-hover:text-zinc-50 transition-colors leading-snug flex-1">
                    {post.title}
                  </h3>

                  {/* Preview lines */}
                  <div className="mt-4 space-y-2">
                    <div className="h-2 bg-zinc-800/60 rounded-full w-full" />
                    <div className="h-2 bg-zinc-800/60 rounded-full w-4/5" />
                    <div className="h-2 bg-zinc-800/60 rounded-full w-3/5" />
                  </div>

                  {/* Read more */}
                  <div className="mt-5 pt-4 border-t border-zinc-800/60 flex items-center gap-2">
                    <span className="font-display text-xs font-semibold text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      Read article
                    </span>
                    <ArrowRight className="h-3 w-3 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.article>
              );
            })
          )}
        </div>

        {/* CMS integration note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
            Powered by Supabase CMS
          </p>
        </motion.div>
      </div>
    </section>
  );
}

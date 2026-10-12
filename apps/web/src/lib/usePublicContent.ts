import { useEffect, useState } from 'react';
import { PROJECTS } from '@/data/projects';
import { BLOGS } from '@/data/blogs';
import { supabase } from './supabaseClient';
import { loadContent } from './content';
import type { Project, BlogPost } from '@/types';

export function usePublicContent() {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [blogs, setBlogs] = useState<BlogPost[]>(BLOGS);
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    let request = 0;
    const refresh = async () => {
      const current = ++request;
      try {
        const rows = await loadContent();
        if (!active || current !== request) return;
        setProjects(rows.filter(r => r.kind === 'project').map(r => r.payload as Project));
        setBlogs(rows.filter(r => r.kind === 'blog').map(r => r.payload as BlogPost));
      } catch {
        // Keep the last successful content, or bundled content on first load.
      }
    };
    void refresh();
    window.addEventListener('hub-content-changed', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      active = false;
      window.removeEventListener('hub-content-changed', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);
  return { projects, blogs };
}

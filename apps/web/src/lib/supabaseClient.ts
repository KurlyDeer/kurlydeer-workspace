import { createClient } from '@supabase/supabase-js';

const env: Record<string, string | undefined> = import.meta.env ?? {};
function configuredClient() {
  if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) return null;
  try { return createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY); }
  catch { return null; }
}
// Public pages remain usable without CMS configuration. Never synthesize a session.
export const supabase = configuredClient();

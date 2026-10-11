import type { BlogPost, Project } from '@/types';
import { supabase } from './supabaseClient';

export interface ContentRecord {
  id: string;
  kind: 'project' | 'blog';
  published: boolean;
  payload: Project | BlogPost;
  updated_at: string;
}
export function cmsClient() {
  if (!supabase) throw new Error('Content editing is not configured.');
  return supabase;
}
export async function loadContent(publicOnly = true): Promise<ContentRecord[]> {
  let query = cmsClient().from('hub_content').select('*').order('created_at', { ascending: false });
  if (publicOnly) query = query.eq('published', true);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
export function notifyContentChanged() {
  window.dispatchEvent(new Event('hub-content-changed'));
}
export function safeUrl(value: string) {
  if (!value.trim()) return '';
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Links must use https:// or http://.');
  return url.href;
}
export const attachmentTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
export function validateAttachment(file: Pick<File, 'size' | 'type'>) {
  if (!attachmentTypes.includes(file.type)) throw new Error('Choose a JPEG, PNG, WebP image or PDF.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Files must be 5 MB or smaller.');
  if (!file.size) throw new Error('The file is empty.');
}

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { cmsClient, ContentRecord, loadContent, notifyContentChanged, safeUrl, validateAttachment } from '@/lib/content';
import type { Project, BlogPost } from '@/types';

const control = 'w-full min-h-11 rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-base';
const button = 'min-h-11 rounded-lg border border-zinc-700 px-4 py-2 text-base disabled:opacity-50';
const categories: Project['category'][] = ['Full-Stack', 'AI & Labs', 'Systems & CLI', 'Hardware & IoT', 'Misc'];
const statuses: Project['status'][] = ['In Progress', 'Completed', 'Prototyping', 'Research'];
const difficulties: BlogPost['difficulty'][] = ['Introductory', 'Intermediate', 'Advanced', 'Expert'];

function newRecord(kind: ContentRecord['kind']): ContentRecord {
  const id = crypto.randomUUID();
  const payload: Project | BlogPost = kind === 'project'
    ? { id, title: '', description: '', category: 'Full-Stack', status: 'In Progress', technologies: [], type: 'github_project', createdAt: new Date().toISOString(), featured: false }
    : { id, title: '', summary: '', content: '', category: 'Engineering', tags: [], publishedAt: new Date().toISOString().slice(0, 10), readTime: '1 min read', difficulty: 'Introductory', author: 'KurlyDeer' };
  return { id, kind, published: false, payload, updated_at: '' };
}

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<'project' | 'blog' | 'status'>('project');
  const [rows, setRows] = useState<ContentRecord[]>([]);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [editor, setEditor] = useState<ContentRecord | null>(null);
  const [tags, setTags] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const dialog = useRef<HTMLDialogElement>(null);
  const menu = useRef<HTMLDialogElement>(null);
  const operation = useRef(false);

  const refresh = async () => {
    const items = await loadContent(false);
    const { data, error } = await cmsClient().from('hub_settings').select('available').eq('id', 1).single();
    if (error) throw error;
    setRows(items);
    setIsAvailable(data.available);
    setReady(true);
  };
  useEffect(() => { void refresh().catch(e => setError(e.message)); }, []);
  useEffect(() => {
    if (editor) dialog.current?.showModal();
    else dialog.current?.close();
  }, [Boolean(editor)]);
  useEffect(() => {
    if (menuOpen) menu.current?.showModal();
    else menu.current?.close();
  }, [menuOpen]);
  useEffect(() => {
    if (!editor && !menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [Boolean(editor), menuOpen]);

  const run = async (action: () => Promise<void>) => {
    if (operation.current) return;
    operation.current = true;
    setBusy(true); setError(''); setNotice('');
    try { await action(); }
    catch (e) { setError(e instanceof Error ? e.message : 'The operation failed. Please retry.'); }
    finally { operation.current = false; setBusy(false); }
  };
  const edit = (record: ContentRecord) => {
    setError(''); setNotice('');
    setEditor(structuredClone(record));
    setTags((record.kind === 'project' ? (record.payload as Project).technologies : (record.payload as BlogPost).tags).join(', '));
  };
  const patch = (key: string, value: unknown) => setEditor(prev => prev && ({ ...prev, payload: { ...prev.payload, [key]: value } }));
  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editor) return;
    void run(async () => {
      const payload = { ...editor.payload, title: editor.payload.title.trim() };
      if (!payload.title) throw new Error('Enter a title.');
      const list = [...new Set(tags.split(',').map(t => t.trim()).filter(Boolean))];
      if (editor.kind === 'project') {
        const p = payload as Project;
        p.technologies = list;
        if (p.featured && !['live_app', 'github_project'].includes(p.type ?? '')) throw new Error('Choose a showcase type for a featured project.');
        p.liveUrl = safeUrl(p.liveUrl ?? '');
        p.githubUrl = safeUrl(p.githubUrl ?? '');
        if (!p.description.trim()) throw new Error('Enter a project description.');
      } else {
        const p = payload as BlogPost;
        p.tags = list;
        if (!p.content.trim() || !p.summary.trim()) throw new Error('Enter a summary and article body.');
      }
      const values = { id: editor.id, kind: editor.kind, published: editor.published, payload };
      // Compare the server timestamp to avoid silently overwriting another device's edits.
      const query = editor.updated_at
        ? cmsClient().from('hub_content').update(values).eq('id', editor.id).eq('updated_at', editor.updated_at)
        : cmsClient().from('hub_content').insert(values);
      const { data, error } = await query.select().single();
      if (error || !data) throw new Error(error?.code === 'PGRST116' ? 'This item changed on another device. Close and reload before editing again.' : error?.message ?? 'Save failed.');
      setRows(prev => [data as ContentRecord, ...prev.filter(r => r.id !== editor.id)]);
      setEditor(null);
      notifyContentChanged();
      setNotice(editor.published ? 'Published successfully.' : 'Draft saved.');
    });
  };
  const upload = (file?: File) => {
    if (!file || !editor || !user) return;
    void run(async () => {
      validateAttachment(file);
      const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'application/pdf': 'pdf' }[file.type];
      const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
      const { error } = await cmsClient().storage.from('hub-assets').upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      const { data } = cmsClient().storage.from('hub-assets').getPublicUrl(path);
      const key = editor.kind === 'project' ? 'readme' : 'content';
      const body = editor.kind === 'project' ? (editor.payload as Project).readme : (editor.payload as BlogPost).content;
      patch(key, `${body ?? ''}\n\n${file.type === 'application/pdf' ? '[Download attachment]' : '![Image]'}(${data.publicUrl})`);
      setNotice('File uploaded. Save the item to keep the attachment link. Uploaded files are public.');
    });
  };
  const navigation = <nav aria-label="Admin sections" className="flex flex-col sm:flex-row gap-2">
    {(['project', 'blog', 'status'] as const).map(item => <button key={item} className={`${button} ${tab === item ? 'bg-emerald-700' : ''}`} aria-current={tab === item ? 'page' : undefined} onClick={() => { setTab(item); setMenuOpen(false); }}>{item === 'project' ? 'Projects' : item === 'blog' ? 'Articles' : 'Availability'}</button>)}
  </nav>;
  const field = (label: string, key: string, value: string, options?: { multiline?: boolean; required?: boolean; type?: string }) => <label className="block space-y-2"> <span>{label}</span>
    {options?.multiline ? <textarea className={control} value={value} rows={key === 'content' || key === 'readme' ? 10 : 3} required={options.required} onChange={e => patch(key, e.target.value)} />
      : <input className={control} type={options?.type ?? 'text'} value={value} required={options?.required} maxLength={500} onChange={e => patch(key, e.target.value)} />}
  </label>;
  const select = (label: string, key: string, value: string, values: string[]) => <label className="block space-y-2"><span>{label}</span><select className={control} value={value} onChange={e => patch(key, e.target.value)}>{values.map(v => <option key={v}>{v}</option>)}</select></label>;

  return <div className="min-h-dvh bg-zinc-950 text-zinc-100 p-4 sm:p-6">
    <header className="mx-auto max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-6">
      <h1 className="text-xl font-bold">Content admin</h1>
      <div className="flex gap-2 flex-wrap">
        <button className={`${button} sm:hidden`} aria-haspopup="dialog" onClick={() => setMenuOpen(true)}>Menu</button>
        <Link className={button} to="/">View site</Link>
        <button className={button} disabled={busy} onClick={() => void run(signOut)}>Sign out</button>
      </div>
    </header>
    <main className="max-w-4xl mx-auto space-y-5">
      <div className="hidden sm:block">{navigation}</div>
      {!editor && error && <p role="alert" className="text-rose-300 break-words">{error}</p>}
      {!editor && notice && <p role="status" className="text-emerald-300">{notice}</p>}
      <button className={button} disabled={busy} onClick={() => void run(refresh)}>Reload content</button>
      {!ready && <p>Content is unavailable until the CMS connection and migration are ready.</p>}
      {ready && tab === 'status' && <section className="rounded-xl border border-zinc-800 p-5 space-y-4">
        <h2 className="text-lg">Availability</h2>
        <p>{isAvailable ? 'Available for work' : 'Currently engaged'}</p>
        <button className={button} disabled={busy} onClick={() => void run(async () => {
          const { error } = await cmsClient().from('hub_settings').update({ available: !isAvailable }).eq('id', 1).select().single();
          if (error) throw error;
          setIsAvailable(!isAvailable); notifyContentChanged(); setNotice('Availability saved.');
        })}>Mark as {isAvailable ? 'engaged' : 'available'}</button>
      </section>}
      {ready && tab !== 'status' && <>
        <button className={`${button} bg-emerald-700`} disabled={busy} onClick={() => edit(newRecord(tab))}>New {tab === 'project' ? 'project' : 'article'}</button>
        <div className="grid gap-4 sm:grid-cols-2">
          {rows.filter(r => r.kind === tab).map(row => <article key={row.id} className="min-w-0 rounded-xl border border-zinc-800 p-5 space-y-3">
            <h2 className="text-lg font-semibold break-words">{row.payload.title}</h2>
            <p>{row.published ? 'Published' : 'Draft'}</p>
            <button className={button} disabled={busy} onClick={() => edit(row)} aria-label={`Edit ${row.payload.title}`}>Edit</button>
          </article>)}
        </div>
        {!rows.some(r => r.kind === tab) && <p>No items yet. Create a draft to get started.</p>}
      </>}
    </main>
    <dialog ref={menu} onCancel={() => setMenuOpen(false)} aria-label="Admin navigation" className="m-0 h-dvh max-h-dvh w-72 bg-zinc-900 text-zinc-100 p-5 backdrop:bg-black/70">
      <button className={`${button} mb-5`} onClick={() => setMenuOpen(false)}>Close menu</button>{navigation}
    </dialog>
    <dialog ref={dialog} aria-labelledby="editor-title" onCancel={event => { if (busy) event.preventDefault(); else setEditor(null); }} className="m-auto max-h-[100dvh] w-full max-w-2xl overflow-y-auto bg-zinc-900 text-zinc-100 p-4 sm:p-6 sm:rounded-xl backdrop:bg-black/70">
      {editor && <form onSubmit={save} className="space-y-5">
        <div className="flex justify-between items-center gap-3"><h2 id="editor-title" className="text-xl">Edit {editor.kind === 'project' ? 'project' : 'article'}</h2><button type="button" className={button} disabled={busy} onClick={() => setEditor(null)}>Cancel</button></div>
        {error && <p role="alert" className="text-rose-300 break-words">{error}</p>}
        {notice && <p role="status" className="text-emerald-300">{notice}</p>}
        <fieldset disabled={busy} className="space-y-5">
          {field('Title', 'title', editor.payload.title, { required: true })}
          {editor.kind === 'project' ? <>
            {field('Description', 'description', (editor.payload as Project).description, { multiline: true, required: true })}
            {select('Category', 'category', (editor.payload as Project).category, categories)}
            {select('Status', 'status', (editor.payload as Project).status, statuses)}
            {field('Live URL', 'liveUrl', (editor.payload as Project).liveUrl ?? '', { type: 'url' })}
            {field('GitHub URL', 'githubUrl', (editor.payload as Project).githubUrl ?? '', { type: 'url' })}
            {select('Showcase type', 'type', (editor.payload as Project).type ?? '', ['', 'live_app', 'github_project'])}
            <label className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={Boolean((editor.payload as Project).featured)} onChange={e => patch('featured', e.target.checked)} />Featured on homepage</label>
            {field('Project write-up (Markdown)', 'readme', (editor.payload as Project).readme ?? '', { multiline: true })}
          </> : <>
            {field('Summary', 'summary', (editor.payload as BlogPost).summary, { multiline: true, required: true })}
            {field('Article (Markdown)', 'content', (editor.payload as BlogPost).content, { multiline: true, required: true })}
            {field('Category', 'category', (editor.payload as BlogPost).category, { required: true })}
            {field('Author', 'author', (editor.payload as BlogPost).author, { required: true })}
            {field('Publication date', 'publishedAt', (editor.payload as BlogPost).publishedAt, { type: 'date', required: true })}
            {field('Reading time', 'readTime', (editor.payload as BlogPost).readTime, { required: true })}
            {select('Difficulty', 'difficulty', (editor.payload as BlogPost).difficulty, difficulties)}
          </>}
          <label className="block space-y-2"><span>{editor.kind === 'project' ? 'Technologies' : 'Tags'} (comma separated)</span><input className={control} value={tags} onChange={e => setTags(e.target.value)} /></label>
          <label className="block space-y-2"><span>Attach an image or PDF (public, up to 5 MB)</span><input className={`${control} max-w-full`} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={e => { upload(e.target.files?.[0]); e.target.value = ''; }} /></label>
          <label className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={editor.published} onChange={e => setEditor({ ...editor, published: e.target.checked })} />Published — visible to everyone</label>
        </fieldset>
        <div className="sticky bottom-0 bg-zinc-900 py-3 flex flex-wrap gap-3 border-t border-zinc-700">
          <button className={`${button} bg-emerald-700 flex-1`} type="submit" disabled={busy}>{busy ? 'Working…' : 'Save changes'}</button>
          {editor.updated_at && <button className={`${button} text-rose-300`} type="button" disabled={busy} onClick={() => {
            if (!window.confirm(`Delete “${editor.payload.title}”? This cannot be undone.`)) return;
            void run(async () => {
              const { error } = await cmsClient().from('hub_content').delete().eq('id', editor.id).eq('updated_at', editor.updated_at).select().single();
              if (error) throw error;
              setRows(prev => prev.filter(r => r.id !== editor.id)); setEditor(null); notifyContentChanged(); setNotice('Item deleted.');
            });
          }}>Delete</button>}
        </div>
      </form>}
    </dialog>
  </div>;
}

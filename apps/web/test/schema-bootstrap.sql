-- Only for a disposable test database: minimal Supabase interfaces for RLS tests.
create role anon nologin;
create role authenticated nologin;
create schema auth;
create schema storage;
create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
create function auth.uid() returns uuid language sql stable as $$ select (auth.jwt()->>'sub')::uuid $$;
grant usage on schema auth, storage to anon, authenticated;
create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
create table storage.objects (id uuid default gen_random_uuid(), bucket_id text references storage.buckets(id), name text);
alter table storage.objects enable row level security;
grant select, insert, update, delete on storage.objects to anon, authenticated;
create function storage.foldername(text) returns text[] language sql immutable as $$ select (string_to_array($1, '/'))[1:array_length(string_to_array($1, '/'), 1)-1] $$;

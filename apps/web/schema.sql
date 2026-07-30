-- Supabase Schema & Row Level Security (RLS) Configuration

-- 1. Create the 'blogs' table
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    markdown_body TEXT NOT NULL,
    youtube_id TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    -- Link the post to the specific admin user who created it
    user_id UUID REFERENCES auth.users(id) NOT NULL
);

-- 2. Create the 'subscribers' table
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- ENABLE ROW LEVEL SECURITY
-- ==========================================
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- BLOGS POLICIES
-- ==========================================

-- Policy 1: Public Read Access
-- Anyone visiting your site can read the published blogs
CREATE POLICY "Allow public read access to blogs" 
ON public.blogs FOR SELECT 
TO public 
USING (true);

-- Policy 2: Admin Write Access
-- Only logged in users (your Admin account) can Insert, Update, or Delete blogs
CREATE POLICY "Allow admin full access to blogs" 
ON public.blogs FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- ==========================================
-- SUBSCRIBERS POLICIES
-- ==========================================

-- Policy 1: Public Insert Access
-- Anyone can submit their email to the subscriber list
CREATE POLICY "Allow public insert to subscribers" 
ON public.subscribers FOR INSERT 
TO public 
WITH CHECK (true);

-- Policy 2: Admin Read/Manage Access
-- Only your Admin account can view, modify, or delete the subscriber list
CREATE POLICY "Allow admin full access to subscribers" 
ON public.subscribers FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

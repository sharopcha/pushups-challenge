-- Push-Up Challenge Database Schema
-- This migration creates all necessary tables, views, and RLS policies

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create pushup_entries table
CREATE TABLE IF NOT EXISTS public.pushup_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  count INTEGER NOT NULL CHECK (count > 0),
  performed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create weekly leaderboard view
CREATE OR REPLACE VIEW public.weekly_leaderboard_current AS
SELECT
  date_trunc('week', performed_at) AS week_start,
  user_id,
  SUM(count) AS total_pushups
FROM public.pushup_entries
WHERE date_trunc('week', performed_at) = date_trunc('week', TIMEZONE('utc', NOW()))
GROUP BY week_start, user_id
ORDER BY total_pushups DESC;

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Anyone can read profiles"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Enable RLS on pushup_entries table
ALTER TABLE public.pushup_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pushup_entries
CREATE POLICY "Users can insert own entries"
ON public.pushup_entries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select own entries"
ON public.pushup_entries FOR SELECT
USING (auth.uid() = user_id);

-- Grant permissions for leaderboard view
GRANT SELECT ON public.weekly_leaderboard_current TO anon, authenticated;

-- Create index for performance
CREATE INDEX IF NOT EXISTS pushup_entries_user_id_idx ON public.pushup_entries(user_id);
CREATE INDEX IF NOT EXISTS pushup_entries_performed_at_idx ON public.pushup_entries(performed_at);

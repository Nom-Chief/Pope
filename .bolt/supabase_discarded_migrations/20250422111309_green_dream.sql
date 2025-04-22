/*
  # Create pope_updates table

  1. New Tables
    - `pope_updates`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with time zone, default now())
      - `title` (text, not null)
      - `content` (text, not null)
      - `audio_url` (text, not null)
      - `source` (text, not null)
  2. Security
    - Enable RLS on `pope_updates` table
    - Add policy for public users to read pope updates
*/

CREATE TABLE IF NOT EXISTS public.pope_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  title text NOT NULL,
  content text NOT NULL,
  audio_url text NOT NULL,
  source text NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.pope_updates ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to pope_updates" 
  ON public.pope_updates
  FOR SELECT
  TO public
  USING (true);

-- Create index on created_at for better performance on ordered queries
CREATE INDEX idx_pope_updates_created_at ON public.pope_updates(created_at);
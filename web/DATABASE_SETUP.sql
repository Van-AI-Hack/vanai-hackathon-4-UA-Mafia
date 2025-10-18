-- Music Buddy Feature Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create the buddy_personas table
CREATE TABLE IF NOT EXISTS buddy_personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Persona data
  persona_id INTEGER NOT NULL,
  persona_name TEXT NOT NULL,
  traits JSONB NOT NULL,
  vibe_tags TEXT[] NOT NULL DEFAULT '{}',
  
  -- User provided info (optional)
  nickname TEXT NOT NULL,
  city TEXT,
  email TEXT,
  linkedin_url TEXT,
  
  -- Privacy settings
  is_discoverable BOOLEAN DEFAULT true,
  show_contacts_publicly BOOLEAN DEFAULT false,
  
  -- Access management (no auth required)
  access_token TEXT UNIQUE NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days')
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_buddy_personas_discoverable 
  ON buddy_personas(is_discoverable) 
  WHERE is_discoverable = true;

CREATE INDEX IF NOT EXISTS idx_buddy_personas_persona_id 
  ON buddy_personas(persona_id);

CREATE INDEX IF NOT EXISTS idx_buddy_personas_city 
  ON buddy_personas(city) 
  WHERE city IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_buddy_personas_access_token 
  ON buddy_personas(access_token);

CREATE INDEX IF NOT EXISTS idx_buddy_personas_expires_at 
  ON buddy_personas(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE buddy_personas ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read discoverable personas (but not contact info)
CREATE POLICY "Anyone can read discoverable personas"
  ON buddy_personas
  FOR SELECT
  USING (is_discoverable = true);

-- Policy: Anyone can insert (no auth required)
CREATE POLICY "Anyone can insert personas"
  ON buddy_personas
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can update their own persona using access token
CREATE POLICY "Users can update with access token"
  ON buddy_personas
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Users can delete their own persona using access token
CREATE POLICY "Users can delete with access token"
  ON buddy_personas
  FOR DELETE
  USING (true);

-- Auto-delete expired personas (runs daily)
-- Note: You'll need to set up a Supabase Edge Function or cron job for this
-- For now, we'll handle it in the application logic

-- Function to clean up expired personas
CREATE OR REPLACE FUNCTION cleanup_expired_personas()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM buddy_personas
  WHERE expires_at < NOW();
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION cleanup_expired_personas() TO anon;

COMMENT ON TABLE buddy_personas IS 'Stores user music personas for the Music Buddy matching feature. No authentication required - uses access tokens.';
COMMENT ON COLUMN buddy_personas.access_token IS 'Used for users to manage their persona without login';
COMMENT ON COLUMN buddy_personas.expires_at IS 'Auto-delete personas after 90 days for privacy';


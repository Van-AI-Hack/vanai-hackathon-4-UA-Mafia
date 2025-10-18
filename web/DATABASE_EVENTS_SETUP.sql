-- Events and Venues Tables for Music Buddy Events Feature

-- Create venues table
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('karaoke', 'live_music', 'music_cafe', 'concert_venue', 'dance_club')),
  rating DECIMAL(2,1) DEFAULT 0.0,
  user_ratings_total INTEGER DEFAULT 0,
  price_level INTEGER CHECK (price_level BETWEEN 1 AND 4),
  phone TEXT,
  website TEXT,
  photo_url TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  features TEXT[] DEFAULT '{}',
  opening_hours TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  organizer_name TEXT NOT NULL,
  organizer_id TEXT, -- access token of the creator
  price DECIMAL(10,2),
  event_type TEXT NOT NULL CHECK (event_type IN ('karaoke_night', 'open_mic', 'singing_workshop', 'music_jam', 'concert', 'dance_party')),
  tags TEXT[] DEFAULT '{}',
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_pattern TEXT CHECK (recurring_pattern IN ('weekly', 'monthly')),
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_events table
CREATE TABLE saved_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- access token
  notes TEXT,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create event_participants table
CREATE TABLE event_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- access token
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_events_venue_id ON events(venue_id);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_saved_events_user_id ON saved_events(user_id);
CREATE INDEX idx_event_participants_event_id ON event_participants(event_id);
CREATE INDEX idx_event_participants_user_id ON event_participants(user_id);
CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_venues_category ON venues(category);

-- Enable Row Level Security (RLS)
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

-- Policies for venues (read-only for all, insert/update for authenticated users)
CREATE POLICY "Allow read access to all venues"
ON venues FOR SELECT
USING (TRUE);

CREATE POLICY "Allow insert for authenticated users"
ON venues FOR INSERT
WITH CHECK (TRUE);

CREATE POLICY "Allow update for venue creators"
ON venues FOR UPDATE
USING (TRUE);

-- Policies for events
CREATE POLICY "Allow read access to all events"
ON events FOR SELECT
USING (TRUE);

CREATE POLICY "Allow insert for authenticated users"
ON events FOR INSERT
WITH CHECK (TRUE);

CREATE POLICY "Allow update for event organizers"
ON events FOR UPDATE
USING (organizer_id = current_setting('app.access_token', TRUE)::TEXT);

CREATE POLICY "Allow delete for event organizers"
ON events FOR DELETE
USING (organizer_id = current_setting('app.access_token', TRUE)::TEXT);

-- Policies for saved_events
CREATE POLICY "Allow users to manage their own saved events"
ON saved_events FOR ALL
USING (user_id = current_setting('app.access_token', TRUE)::TEXT);

-- Policies for event_participants
CREATE POLICY "Allow users to manage their own event participation"
ON event_participants FOR ALL
USING (user_id = current_setting('app.access_token', TRUE)::TEXT);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update current_participants count
CREATE OR REPLACE FUNCTION update_event_participants_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events 
        SET current_participants = current_participants + 1 
        WHERE id = NEW.event_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE events 
        SET current_participants = current_participants - 1 
        WHERE id = OLD.event_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for participant count
CREATE TRIGGER update_participants_count
    AFTER INSERT OR DELETE ON event_participants
    FOR EACH ROW EXECUTE FUNCTION update_event_participants_count();

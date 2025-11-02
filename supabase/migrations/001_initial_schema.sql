-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  theme TEXT DEFAULT 'default',
  custom_css TEXT,
  analytics_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_-]+$')
);

-- Sections table
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('links', 'rss', 'social', 'video', 'contact', 'newsletter')),
  title TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  layout TEXT DEFAULT 'list' CHECK (layout IN ('list', 'grid', 'timeline', 'carousel', 'bento')),
  position INTEGER NOT NULL,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Links table
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_url TEXT,
  thumbnail_url TEXT,
  description TEXT,
  position INTEGER NOT NULL,
  click_count INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RSS sources table
CREATE TABLE rss_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE NOT NULL,
  feed_url TEXT NOT NULL,
  feed_type TEXT DEFAULT 'generic',
  update_frequency INTEGER DEFAULT 3600,
  last_fetched TIMESTAMP WITH TIME ZONE,
  cache_items JSONB,
  max_items INTEGER DEFAULT 10
);

-- Link clicks analytics
CREATE TABLE link_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for sections
CREATE POLICY "Sections are viewable by everyone"
  ON sections FOR SELECT
  USING (true);

CREATE POLICY "Users can insert sections for own profile"
  ON sections FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = sections.profile_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can update own sections"
  ON sections FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = sections.profile_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own sections"
  ON sections FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = sections.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Similar policies for links and rss_sources
CREATE POLICY "Links are viewable by everyone"
  ON links FOR SELECT
  USING (true);

CREATE POLICY "Users can manage links in own sections"
  ON links FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM sections
      JOIN profiles ON sections.profile_id = profiles.id
      WHERE sections.id = links.section_id
      AND profiles.id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_sections_profile_id ON sections(profile_id);
CREATE INDEX idx_links_section_id ON links(section_id);
CREATE INDEX idx_rss_sources_section_id ON rss_sources(section_id);
CREATE INDEX idx_link_clicks_link_id ON link_clicks(link_id);

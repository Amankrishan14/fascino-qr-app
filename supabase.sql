-- Create tables with RLS enabled
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  handle TEXT NOT NULL UNIQUE,
  headline TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('IMAGE', 'VIDEO')),
  url TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS socials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('TWITTER', 'INSTAGRAM', 'LINKEDIN', 'GITHUB', 'YOUTUBE', 'FACEBOOK', 'TIKTOK', 'OTHER')),
  handle TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT admins_user_id_key UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE socials ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles: owner can read/write, public can read only approved profiles
CREATE POLICY "Profiles are viewable by owner" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Profiles are editable by owner" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Profiles are insertable by owner" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Profiles are viewable by public if approved" ON profiles
  FOR SELECT USING (is_approved = TRUE);

-- Media: owner of parent profile can read/write
CREATE POLICY "Media is viewable by profile owner" ON media
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = media.profile_id
    )
  );

CREATE POLICY "Media is editable by profile owner" ON media
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = media.profile_id
    )
  );

CREATE POLICY "Media is insertable by profile owner" ON media
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = media.profile_id
    )
  );

CREATE POLICY "Media is deletable by profile owner" ON media
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = media.profile_id
    )
  );

CREATE POLICY "Media is viewable by public if profile is approved" ON media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = media.profile_id AND is_approved = TRUE
    )
  );

-- Links: owner of parent profile can read/write
CREATE POLICY "Links are viewable by profile owner" ON links
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = links.profile_id
    )
  );

CREATE POLICY "Links are editable by profile owner" ON links
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = links.profile_id
    )
  );

CREATE POLICY "Links are insertable by profile owner" ON links
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = links.profile_id
    )
  );

CREATE POLICY "Links are deletable by profile owner" ON links
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = links.profile_id
    )
  );

CREATE POLICY "Links are viewable by public if profile is approved" ON links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = links.profile_id AND is_approved = TRUE
    )
  );

-- Socials: owner of parent profile can read/write
CREATE POLICY "Socials are viewable by profile owner" ON socials
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = socials.profile_id
    )
  );

CREATE POLICY "Socials are editable by profile owner" ON socials
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = socials.profile_id
    )
  );

CREATE POLICY "Socials are insertable by profile owner" ON socials
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = socials.profile_id
    )
  );

CREATE POLICY "Socials are deletable by profile owner" ON socials
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = socials.profile_id
    )
  );

CREATE POLICY "Socials are viewable by public if profile is approved" ON socials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = socials.profile_id AND is_approved = TRUE
    )
  );

-- Admins: only admins can access admin table
CREATE POLICY "Admins can view admin table" ON admins
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM admins
    )
  );

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM admins
    )
  );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM admins
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS profiles_handle_idx ON profiles (handle);
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles (user_id);
CREATE INDEX IF NOT EXISTS media_profile_id_idx ON media (profile_id);
CREATE INDEX IF NOT EXISTS links_profile_id_idx ON links (profile_id);
CREATE INDEX IF NOT EXISTS socials_profile_id_idx ON socials (profile_id);
CREATE INDEX IF NOT EXISTS admins_user_id_idx ON admins (user_id);

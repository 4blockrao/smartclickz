
-- Add missing columns to companies table for detailed company pages
ALTER TABLE companies ADD COLUMN IF NOT EXISTS employee_count INTEGER;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS headquarters TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS company_type TEXT DEFAULT 'MLM'; -- MLM, Direct Sales, Network Marketing
ALTER TABLE companies ADD COLUMN IF NOT EXISTS ceo_name TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS products_services TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS company_video_url TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Add missing social media and professional fields to profiles for networker pages
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tiktok_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_company TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_position TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS years_experience INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS achievements TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS languages TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS time_zone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'Available'; -- Available, Busy, Away
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS follower_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS connection_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_views INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create company_followers table for users to follow companies
CREATE TABLE IF NOT EXISTS company_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- Enable RLS for company_followers
ALTER TABLE company_followers ENABLE ROW LEVEL SECURITY;

-- RLS policies for company_followers
CREATE POLICY "Users can follow companies" ON company_followers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unfollow companies" ON company_followers
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public can view company followers" ON company_followers
  FOR SELECT USING (true);

-- Create company_team_members table to track top networkers for each company
CREATE TABLE IF NOT EXISTS company_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  position TEXT,
  join_date DATE,
  is_verified BOOLEAN DEFAULT false,
  performance_rank INTEGER,
  total_sales DECIMAL(12,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(company_id, profile_id)
);

-- Enable RLS for company_team_members
ALTER TABLE company_team_members ENABLE ROW LEVEL SECURITY;

-- RLS policies for company_team_members
CREATE POLICY "Public can view company team members" ON company_team_members
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own company team associations" ON company_team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = company_team_members.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- Create connection_requests table for networker connections
CREATE TABLE IF NOT EXISTS connection_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, rejected
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(sender_id, receiver_id)
);

-- Enable RLS for connection_requests
ALTER TABLE connection_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for connection_requests
CREATE POLICY "Users can send connection requests" ON connection_requests
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can manage their connection requests" ON connection_requests
  FOR ALL USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Update profile followers count trigger
CREATE OR REPLACE FUNCTION update_profile_follower_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles 
    SET follower_count = follower_count + 1 
    WHERE id = (SELECT id FROM profiles WHERE user_id = NEW.following_id);
    
    UPDATE profiles 
    SET following_count = following_count + 1 
    WHERE id = (SELECT id FROM profiles WHERE user_id = NEW.follower_id);
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles 
    SET follower_count = follower_count - 1 
    WHERE id = (SELECT id FROM profiles WHERE user_id = OLD.following_id);
    
    UPDATE profiles 
    SET following_count = following_count - 1 
    WHERE id = (SELECT id FROM profiles WHERE user_id = OLD.follower_id);
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profile_follower_count_trigger
  AFTER INSERT OR DELETE ON profile_followers
  FOR EACH ROW EXECUTE FUNCTION update_profile_follower_count();

-- Insert sample data for company details
INSERT INTO companies (id, name, description, website, country, founded_year, is_verified, industry, employee_count, headquarters, linkedin_url, twitter_url, company_type, ceo_name, products_services, rating, total_reviews)
VALUES 
  (
    '5e765bc6-c5ca-432a-9b7c-762773c205ac',
    'Amway',
    'Amway is a global leader in health, beauty, and home care products through direct selling. Founded in 1959 by Rich DeVos and Jay Van Andel, Amway has grown to become one of the world''s largest direct selling companies.',
    'https://www.amway.com',
    'USA',
    1959,
    true,
    'Health & Beauty',
    21000,
    'Ada, Michigan, USA',
    'https://linkedin.com/company/amway',
    'https://twitter.com/amway',
    'Direct Sales',
    'Milind Pant',
    'Nutrition supplements, skincare, cosmetics, home care products, water treatment systems',
    4.2,
    1250
  ),
  (
    '8e525b6f-19d8-4d57-8f21-8a6bcead47d0',
    'Herbalife',
    'Herbalife Nutrition is a global multi-level marketing corporation that develops and sells dietary supplements, weight management, sports nutrition, and personal-care products.',
    'https://www.herbalife.com',
    'USA',
    1980,
    true,
    'Nutrition & Wellness',
    10000,
    'Los Angeles, California, USA',
    'https://linkedin.com/company/herbalife',
    'https://twitter.com/herbalife',
    'MLM',
    'John Agwunobi',
    'Protein shakes, vitamins, weight management products, sports nutrition, skin care',
    4.0,
    892
  )
ON CONFLICT (id) DO UPDATE SET
  description = EXCLUDED.description,
  industry = EXCLUDED.industry,
  employee_count = EXCLUDED.employee_count,
  headquarters = EXCLUDED.headquarters,
  linkedin_url = EXCLUDED.linkedin_url,
  twitter_url = EXCLUDED.twitter_url,
  company_type = EXCLUDED.company_type,
  ceo_name = EXCLUDED.ceo_name,
  products_services = EXCLUDED.products_services,
  rating = EXCLUDED.rating,
  total_reviews = EXCLUDED.total_reviews;

-- Insert sample company team members
INSERT INTO company_team_members (company_id, profile_id, position, join_date, is_verified, performance_rank, total_sales)
SELECT 
  '5e765bc6-c5ca-432a-9b7c-762773c205ac',
  p.id,
  'Independent Business Owner',
  '2023-01-15',
  true,
  ROW_NUMBER() OVER (ORDER BY p.points DESC),
  (p.points * 100.0)
FROM profiles p
WHERE p.key_skills IS NOT NULL
LIMIT 5
ON CONFLICT (company_id, profile_id) DO NOTHING;

INSERT INTO company_team_members (company_id, profile_id, position, join_date, is_verified, performance_rank, total_sales)
SELECT 
  '8e525b6f-19d8-4d57-8f21-8a6bcead47d0',
  p.id,
  'Distributor',
  '2023-03-20',
  true,
  ROW_NUMBER() OVER (ORDER BY p.points DESC),
  (p.points * 85.0)
FROM profiles p
WHERE p.key_skills IS NOT NULL
LIMIT 5
ON CONFLICT (company_id, profile_id) DO NOTHING;

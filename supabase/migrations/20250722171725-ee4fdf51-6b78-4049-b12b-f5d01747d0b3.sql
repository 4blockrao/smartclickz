
-- Insert sample profiles with diverse data
INSERT INTO profiles (
  user_id, display_name, bio, email, phone, country, city, key_skills, 
  current_company, current_position, referral_user_id, points, xp_level,
  team_size, follower_count, following_count, profile_image_url,
  linkedin_url, twitter_url, facebook_url, instagram_url, website_url,
  specialization, achievements, languages, availability_status, networker_type
) VALUES 
-- Top Networkers (50 records)
(gen_random_uuid(), 'Sarah Chen', 'Digital marketing strategist with 10+ years in MLM', 'sarah.chen@email.com', '+1-555-0101', 'United States', 'Los Angeles', 'Digital Marketing, Lead Generation, Team Building', 'MarketPro Solutions', 'Senior Marketing Director', 'AA' || lpad((random() * 99999)::text, 5, '0'), 15420, 8, 156, 2341, 1876, 'https://images.unsplash.com/photo-1494790108755-2616b612b05b?w=150', 'https://linkedin.com/in/sarahchen', 'https://twitter.com/sarahchen', 'https://facebook.com/sarahchen', 'https://instagram.com/sarahchen', 'https://sarahchen.com', 'MLM Leadership', 'Top Performer 2023, Diamond Rank', 'English, Mandarin, Spanish', 'Available', 'premium'),
(gen_random_uuid(), 'Marcus Johnson', 'Network marketing expert specializing in team development', 'marcus.j@email.com', '+1-555-0102', 'Canada', 'Toronto', 'Team Leadership, Sales Training, Mentorship', 'Global Connect', 'Regional Director', 'AA' || lpad((random() * 99999)::text, 5, '0'), 18750, 9, 203, 3102, 2145, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'https://linkedin.com/in/marcusj', 'https://twitter.com/marcusj', 'https://facebook.com/marcusj', 'https://instagram.com/marcusj', 'https://marcusjohnson.net', 'Team Development', 'Platinum Leader 2023, Mentor of the Year', 'English, French', 'Available', 'premium'),
(gen_random_uuid(), 'Elena Rodriguez', 'Health and wellness MLM specialist', 'elena.r@email.com', '+1-555-0103', 'Spain', 'Madrid', 'Health Products, Wellness Coaching, Social Media', 'WellLife International', 'Country Manager', 'AA' || lpad((random() * 99999)::text, 5, '0'), 12680, 7, 189, 2876, 1654, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'https://linkedin.com/in/elenarodriguez', 'https://twitter.com/elenarodriguez', 'https://facebook.com/elenarodriguez', 'https://instagram.com/elenarodriguez', 'https://elenarodriguez.es', 'Health & Wellness', 'Gold Star Award, Health Advocate 2023', 'Spanish, English, Portuguese', 'Available', 'premium'),
(gen_random_uuid(), 'David Kim', 'Technology and cryptocurrency MLM leader', 'david.kim@email.com', '+82-10-1234-5678', 'South Korea', 'Seoul', 'Cryptocurrency, Blockchain, Tech Education', 'CryptoNet Solutions', 'Technical Director', 'AA' || lpad((random() * 99999)::text, 5, '0'), 21340, 10, 267, 4123, 2987, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'https://linkedin.com/in/davidkim', 'https://twitter.com/davidkim', 'https://facebook.com/davidkim', 'https://instagram.com/davidkim', 'https://davidkim.kr', 'Cryptocurrency MLM', 'Innovation Leader 2023, Tech Pioneer', 'Korean, English, Japanese', 'Available', 'premium'),
(gen_random_uuid(), 'Amanda Foster', 'Beauty and cosmetics network marketing pro', 'amanda.f@email.com', '+44-7700-900123', 'United Kingdom', 'London', 'Beauty Products, Brand Building, Influencer Marketing', 'Beauty Empire', 'Brand Ambassador', 'AA' || lpad((random() * 99999)::text, 5, '0'), 14590, 8, 198, 3456, 2234, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 'https://linkedin.com/in/amandafoster', 'https://twitter.com/amandafoster', 'https://facebook.com/amandafoster', 'https://instagram.com/amandafoster', 'https://amandafoster.co.uk', 'Beauty & Cosmetics', 'Rising Star 2023, Beauty Influencer', 'English, French', 'Available', 'premium');

-- Continue with more diverse profiles (45 more)
INSERT INTO profiles (user_id, display_name, bio, email, phone, country, city, key_skills, current_company, current_position, referral_user_id, points, xp_level, team_size, follower_count, following_count, profile_image_url, specialization, availability_status, networker_type)
SELECT 
  gen_random_uuid(),
  CASE (random() * 20)::int
    WHEN 0 THEN 'Alex Thompson'
    WHEN 1 THEN 'Maria Garcia'
    WHEN 2 THEN 'James Wilson'
    WHEN 3 THEN 'Lisa Wang'
    WHEN 4 THEN 'Robert Brown'
    WHEN 5 THEN 'Jennifer Lee'
    WHEN 6 THEN 'Michael Davis'
    WHEN 7 THEN 'Emily Zhang'
    WHEN 8 THEN 'Daniel Miller'
    WHEN 9 THEN 'Jessica Taylor'
    WHEN 10 THEN 'Christopher Anderson'
    WHEN 11 THEN 'Ashley Martinez'
    WHEN 12 THEN 'Matthew Thomas'
    WHEN 13 THEN 'Samantha White'
    WHEN 14 THEN 'Ryan Jackson'
    WHEN 15 THEN 'Nicole Harris'
    WHEN 16 THEN 'Kevin Clark'
    WHEN 17 THEN 'Rachel Lewis'
    WHEN 18 THEN 'Brandon Young'
    ELSE 'Sophie Turner'
  END,
  CASE (random() * 15)::int
    WHEN 0 THEN 'Passionate about building teams and achieving goals together'
    WHEN 1 THEN 'Experienced network marketer focused on sustainable growth'
    WHEN 2 THEN 'Digital marketing enthusiast with proven track record'
    WHEN 3 THEN 'Health and wellness advocate helping others succeed'
    WHEN 4 THEN 'Technology expert bringing innovation to MLM'
    WHEN 5 THEN 'Beauty industry professional with extensive network'
    WHEN 6 THEN 'Financial services specialist helping families prosper'
    WHEN 7 THEN 'Travel enthusiast sharing opportunities worldwide'
    WHEN 8 THEN 'Nutrition expert promoting healthy lifestyles'
    WHEN 9 THEN 'Education advocate empowering through knowledge'
    WHEN 10 THEN 'Fitness coach inspiring healthy living'
    WHEN 11 THEN 'Environmental advocate promoting green products'
    WHEN 12 THEN 'Fashion enthusiast building style communities'
    WHEN 13 THEN 'Real estate professional expanding networks'
    ELSE 'Entrepreneur passionate about helping others succeed'
  END,
  CASE (random() * 10)::int
    WHEN 0 THEN 'contact@email.com'
    WHEN 1 THEN 'info@example.com'
    WHEN 2 THEN 'hello@domain.com'
    WHEN 3 THEN 'business@company.com'
    WHEN 4 THEN 'connect@network.com'
    WHEN 5 THEN 'team@success.com'
    WHEN 6 THEN 'grow@venture.com'
    WHEN 7 THEN 'leader@group.com'
    WHEN 8 THEN 'expert@field.com'
    ELSE 'pro@industry.com'
  END,
  '+1-555-' || lpad((random() * 9999)::text, 4, '0'),
  CASE (random() * 15)::int
    WHEN 0 THEN 'United States'
    WHEN 1 THEN 'Canada'
    WHEN 2 THEN 'United Kingdom'
    WHEN 3 THEN 'Australia'
    WHEN 4 THEN 'Germany'
    WHEN 5 THEN 'France'
    WHEN 6 THEN 'Spain'
    WHEN 7 THEN 'Italy'
    WHEN 8 THEN 'Netherlands'
    WHEN 9 THEN 'Japan'
    WHEN 10 THEN 'South Korea'
    WHEN 11 THEN 'Singapore'
    WHEN 12 THEN 'Brazil'
    WHEN 13 THEN 'Mexico'
    ELSE 'India'
  END,
  CASE (random() * 20)::int
    WHEN 0 THEN 'New York'
    WHEN 1 THEN 'Los Angeles'
    WHEN 2 THEN 'Chicago'
    WHEN 3 THEN 'Houston'
    WHEN 4 THEN 'Phoenix'
    WHEN 5 THEN 'Toronto'
    WHEN 6 THEN 'Vancouver'
    WHEN 7 THEN 'London'
    WHEN 8 THEN 'Manchester'
    WHEN 9 THEN 'Sydney'
    WHEN 10 THEN 'Melbourne'
    WHEN 11 THEN 'Berlin'
    WHEN 12 THEN 'Munich'
    WHEN 13 THEN 'Paris'
    WHEN 14 THEN 'Madrid'
    WHEN 15 THEN 'Rome'
    WHEN 16 THEN 'Amsterdam'
    WHEN 17 THEN 'Tokyo'
    WHEN 18 THEN 'Seoul'
    ELSE 'Singapore'
  END,
  CASE (random() * 12)::int
    WHEN 0 THEN 'Sales, Marketing, Leadership'
    WHEN 1 THEN 'Team Building, Training, Mentorship'
    WHEN 2 THEN 'Digital Marketing, Social Media, Content Creation'
    WHEN 3 THEN 'Health Products, Wellness Coaching'
    WHEN 4 THEN 'Technology, Innovation, Training'
    WHEN 5 THEN 'Beauty, Fashion, Brand Building'
    WHEN 6 THEN 'Financial Services, Investment, Planning'
    WHEN 7 THEN 'Travel, Hospitality, Adventure'
    WHEN 8 THEN 'Nutrition, Fitness, Lifestyle'
    WHEN 9 THEN 'Education, Personal Development'
    WHEN 10 THEN 'Environment, Sustainability, Green Living'
    ELSE 'Real Estate, Property, Investment'
  END,
  CASE (random() * 8)::int
    WHEN 0 THEN 'Global Success Network'
    WHEN 1 THEN 'Premier Marketing Solutions'
    WHEN 2 THEN 'Elite Business Group'
    WHEN 3 THEN 'Dynamic Growth Partners'
    WHEN 4 THEN 'Infinite Possibilities Inc'
    WHEN 5 THEN 'Success Builders International'
    WHEN 6 THEN 'Prosperity Network'
    ELSE 'Achievement Alliance'
  END,
  CASE (random() * 8)::int
    WHEN 0 THEN 'Senior Director'
    WHEN 1 THEN 'Regional Manager'
    WHEN 2 THEN 'Team Leader'
    WHEN 3 THEN 'Brand Ambassador'
    WHEN 4 THEN 'Sales Coordinator'
    WHEN 5 THEN 'Business Developer'
    WHEN 6 THEN 'Marketing Specialist'
    ELSE 'Growth Consultant'
  END,
  'AA' || lpad((random() * 99999)::text, 5, '0'),
  (random() * 25000)::int,
  (random() * 10 + 1)::int,
  (random() * 300)::int,
  (random() * 5000)::int,
  (random() * 3000)::int,
  CASE (random() * 10)::int
    WHEN 0 THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    WHEN 1 THEN 'https://images.unsplash.com/photo-1494790108755-2616b612b05b?w=150'
    WHEN 2 THEN 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    WHEN 3 THEN 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    WHEN 4 THEN 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
    WHEN 5 THEN 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    WHEN 6 THEN 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    WHEN 7 THEN 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
    WHEN 8 THEN 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150'
    ELSE 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
  END,
  CASE (random() * 8)::int
    WHEN 0 THEN 'Digital Marketing'
    WHEN 1 THEN 'Team Leadership'
    WHEN 2 THEN 'Health & Wellness'
    WHEN 3 THEN 'Technology Solutions'
    WHEN 4 THEN 'Beauty & Fashion'
    WHEN 5 THEN 'Financial Services'
    WHEN 6 THEN 'Travel & Lifestyle'
    ELSE 'Personal Development'
  END,
  'Available',
  CASE WHEN random() < 0.3 THEN 'premium' ELSE 'regular' END
FROM generate_series(1, 45);

-- Insert sample companies (100 companies)
INSERT INTO companies (
  name, description, website, country, city, industry, company_type,
  founded_year, employee_count, logo_url, is_verified, rating, total_reviews,
  ceo_name, products_services, headquarters, linkedin_url, creator_user_id
) VALUES 
-- Verified companies first (30)
('GlobalHealth Pro', 'Leading health and wellness MLM company with innovative nutritional products', 'https://globalhealthpro.com', 'United States', 'Dallas', 'Health & Wellness', 'MLM', 2015, 850, 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100', true, 4.7, 342, 'Dr. Sarah Mitchell', 'Nutritional supplements, wellness coaching, health monitoring devices', 'Dallas, TX', 'https://linkedin.com/company/globalhealthpro', (SELECT user_id FROM profiles LIMIT 1)),
('TechVenture Network', 'Cutting-edge technology solutions and digital marketing MLM', 'https://techventure.net', 'Canada', 'Vancouver', 'Technology', 'MLM', 2018, 650, 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100', true, 4.5, 278, 'Mark Johnson', 'Software solutions, digital marketing tools, blockchain technology', 'Vancouver, BC', 'https://linkedin.com/company/techventure', (SELECT user_id FROM profiles LIMIT 1 OFFSET 1)),
('Beauty Empire International', 'Premium beauty and skincare products through network marketing', 'https://beautyempire.com', 'United Kingdom', 'London', 'Beauty & Cosmetics', 'MLM', 2012, 1200, 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=100', true, 4.8, 456, 'Amanda Sterling', 'Skincare products, cosmetics, beauty tools, training programs', 'London, UK', 'https://linkedin.com/company/beautyempire', (SELECT user_id FROM profiles LIMIT 1 OFFSET 2)),
('Prosperity Financial Group', 'Financial education and investment opportunities MLM', 'https://prosperityfinancial.com', 'Australia', 'Sydney', 'Financial Services', 'MLM', 2016, 420, 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=100', true, 4.6, 189, 'Robert Chen', 'Financial education, investment products, retirement planning', 'Sydney, NSW', 'https://linkedin.com/company/prosperityfinancial', (SELECT user_id FROM profiles LIMIT 1 OFFSET 3)),
('EcoLiving Solutions', 'Sustainable products and environmental consciousness MLM', 'https://ecoliving.com', 'Germany', 'Berlin', 'Environmental', 'MLM', 2019, 380, 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100', true, 4.4, 167, 'Elena Green', 'Eco-friendly products, sustainability education, green technology', 'Berlin, Germany', 'https://linkedin.com/company/ecoliving', (SELECT user_id FROM profiles LIMIT 1 OFFSET 4));

-- Continue with more sample companies
INSERT INTO companies (name, description, website, country, city, industry, company_type, founded_year, employee_count, logo_url, is_verified, rating, total_reviews, creator_user_id)
SELECT 
  CASE (random() * 30)::int
    WHEN 0 THEN 'Dynamic Growth Partners'
    WHEN 1 THEN 'Elite Success Network'
    WHEN 2 THEN 'Infinite Wellness Co'
    WHEN 3 THEN 'Premier Marketing Solutions'
    WHEN 4 THEN 'Victory Business Group'
    WHEN 5 THEN 'Platinum Enterprises'
    WHEN 6 THEN 'Golden Opportunity Inc'
    WHEN 7 THEN 'Excellence Network'
    WHEN 8 THEN 'Innovation Leaders'
    WHEN 9 THEN 'Success Builders International'
    WHEN 10 THEN 'Prosperity Alliance'
    WHEN 11 THEN 'Achievement Partners'
    WHEN 12 THEN 'Global Ventures Ltd'
    WHEN 13 THEN 'Elite Performance Group'
    WHEN 14 THEN 'Success Accelerators'
    WHEN 15 THEN 'Pinnacle Marketing'
    WHEN 16 THEN 'Advantage Network'
    WHEN 17 THEN 'Premier Wellness Solutions'
    WHEN 18 THEN 'Dynamic Business Partners'
    WHEN 19 THEN 'Excellence Marketing Group'
    WHEN 20 THEN 'Victory Wellness Network'
    WHEN 21 THEN 'Golden Success Partners'
    WHEN 22 THEN 'Elite Growth Solutions'
    WHEN 23 THEN 'Platinum Performance Group'
    WHEN 24 THEN 'Innovation Marketing Network'
    WHEN 25 THEN 'Premier Success Alliance'
    WHEN 26 THEN 'Dynamic Excellence Group'
    WHEN 27 THEN 'Global Achievement Partners'
    WHEN 28 THEN 'Victory Performance Solutions'
    ELSE 'Elite Opportunity Network'
  END,
  CASE (random() * 12)::int
    WHEN 0 THEN 'Leading network marketing company focused on personal development and success'
    WHEN 1 THEN 'Innovative health and wellness solutions through direct selling'
    WHEN 2 THEN 'Technology-driven MLM company empowering digital entrepreneurs'
    WHEN 3 THEN 'Premium beauty and lifestyle products with proven track record'
    WHEN 4 THEN 'Financial education and wealth building through network marketing'
    WHEN 5 THEN 'Sustainable and eco-friendly products for conscious consumers'
    WHEN 6 THEN 'Travel and lifestyle opportunities through direct sales'
    WHEN 7 THEN 'Nutrition and fitness solutions for healthy living'
    WHEN 8 THEN 'Home and garden products with innovative marketing approach'
    WHEN 9 THEN 'Educational services and personal development programs'
    WHEN 10 THEN 'Energy and utility solutions through network marketing'
    ELSE 'Fashion and accessories with unique business model'
  END,
  'https://company' || (random() * 1000)::int || '.com',
  CASE (random() * 12)::int
    WHEN 0 THEN 'United States'
    WHEN 1 THEN 'Canada'
    WHEN 2 THEN 'United Kingdom'
    WHEN 3 THEN 'Australia'
    WHEN 4 THEN 'Germany'
    WHEN 5 THEN 'France'
    WHEN 6 THEN 'Spain'
    WHEN 7 THEN 'Italy'
    WHEN 8 THEN 'Netherlands'
    WHEN 9 THEN 'Japan'
    WHEN 10 THEN 'South Korea'
    ELSE 'Singapore'
  END,
  CASE (random() * 15)::int
    WHEN 0 THEN 'New York'
    WHEN 1 THEN 'Los Angeles'
    WHEN 2 THEN 'Chicago'
    WHEN 3 THEN 'Toronto'
    WHEN 4 THEN 'Vancouver'
    WHEN 5 THEN 'London'
    WHEN 6 THEN 'Manchester'
    WHEN 7 THEN 'Sydney'
    WHEN 8 THEN 'Melbourne'
    WHEN 9 THEN 'Berlin'
    WHEN 10 THEN 'Paris'
    WHEN 11 THEN 'Madrid'
    WHEN 12 THEN 'Amsterdam'
    WHEN 13 THEN 'Tokyo'
    ELSE 'Singapore'
  END,
  CASE (random() * 10)::int
    WHEN 0 THEN 'Health & Wellness'
    WHEN 1 THEN 'Technology'
    WHEN 2 THEN 'Beauty & Cosmetics'
    WHEN 3 THEN 'Financial Services'
    WHEN 4 THEN 'Environmental'
    WHEN 5 THEN 'Travel & Lifestyle'
    WHEN 6 THEN 'Nutrition & Fitness'
    WHEN 7 THEN 'Home & Garden'
    WHEN 8 THEN 'Education'
    ELSE 'Fashion & Accessories'
  END,
  'MLM',
  (2010 + (random() * 14)::int),
  (50 + (random() * 1000)::int),
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100',
  CASE WHEN random() < 0.4 THEN true ELSE false END,
  (3.0 + random() * 2.0),
  (random() * 500)::int,
  (SELECT user_id FROM profiles ORDER BY random() LIMIT 1)
FROM generate_series(1, 95);

-- Insert sample tasks (150 tasks)
INSERT INTO tasks (
  title, description, type, payout_points, url, proof_type, is_active, created_by
) VALUES 
('Follow Instagram Account @TechGuru', 'Follow our official Instagram account and help us reach 10K followers', 'social_media', 15, 'https://instagram.com/techguru', 'screenshot', true, (SELECT user_id FROM profiles ORDER BY random() LIMIT 1)),
('Like Facebook Business Page', 'Like and share our Facebook business page to increase visibility', 'social_media', 12, 'https://facebook.com/businesspage', 'screenshot', true, (SELECT user_id FROM profiles ORDER BY random() LIMIT 1)),
('Subscribe to YouTube Channel', 'Subscribe to our YouTube channel and watch latest product demo', 'social_media', 20, 'https://youtube.com/channel/demo', 'screenshot', true, (SELECT user_id FROM profiles ORDER BY random() LIMIT 1)),
('Share TikTok Video', 'Share our viral TikTok video about health tips with your network', 'social_media', 18, 'https://tiktok.com/@healthtips/video', 'screenshot', true, (SELECT user_id FROM profiles ORDER BY random() LIMIT 1)),
('Write Product Review', 'Write a detailed review of our flagship product on your blog or social media', 'content_creation', 50, 'https://ourproduct.com/review', 'url_submission', true, (SELECT user_id FROM profiles ORDER BY random() LIMIT 1)),
('Join LinkedIn Group', 'Join our professional LinkedIn group for network marketers', 'social_media', 10, 'https://linkedin.com/groups/networkmarketers', 'screenshot', true, (SELECT user_id FROM profiles ORDER BY random() LIMIT 1)),
('Download Mobile App', 'Download and rate our mobile app on the App Store or Google Play', 'app_engagement', 25, 'https://app.ourcompany.com/download', 'screenshot', true, (SELECT user_id FROM profiles ORDER BY random() LIMIT 1)),
('Attend Virtual Webinar', 'Attend our weekly success webinar and complete the feedback form', 'webinar_attendance', 75, 'https://webinar.ourcompany.com/success', 'attendance_code', true, (SELECT user_id FROM profiles ORDER BY random() LIMIT 1)),
('Create Social Media Post', 'Create an original post about your MLM journey and tag our company', 'content_creation', 40, 'https://socialmedia.guidelines.com', 'url_submission', true, (SELECT user_id FROM profiles ORDER BY random() LIMIT 1)),
('Complete Training Module', 'Complete Module 3 of our online training course about sales techniques', 'training', 60, 'https://training.ourcompany.com/module3', 'completion_certificate', true, (SELECT user_id FROM profiles ORDER BY random() LIMIT 1));

-- Add more diverse tasks
INSERT INTO tasks (title, description, type, payout_points, url, proof_type, is_active, created_by)
SELECT 
  CASE (random() * 20)::int
    WHEN 0 THEN 'Share Success Story Video'
    WHEN 1 THEN 'Comment on Company Blog Post'
    WHEN 2 THEN 'Invite Friends to Group'
    WHEN 3 THEN 'Rate Company on Review Site'
    WHEN 4 THEN 'Complete Survey About Products'
    WHEN 5 THEN 'Watch Product Demo Video'
    WHEN 6 THEN 'Join Telegram Community'
    WHEN 7 THEN 'Share Motivational Quote'
    WHEN 8 THEN 'Tag Friends in Post'
    WHEN 9 THEN 'Write Testimonial'
    WHEN 10 THEN 'Follow Twitter Account'
    WHEN 11 THEN 'Share Company News'
    WHEN 12 THEN 'Join Discord Server'
    WHEN 13 THEN 'Complete Profile Setup'
    WHEN 14 THEN 'Refer New Member'
    WHEN 15 THEN 'Like Recent Posts'
    WHEN 16 THEN 'Share Training Video'
    WHEN 17 THEN 'Join Weekly Call'
    WHEN 18 THEN 'Post Achievement Badge'
    ELSE 'Create Tutorial Video'
  END,
  CASE (random() * 15)::int
    WHEN 0 THEN 'Help promote our brand by completing this simple social media task'
    WHEN 1 THEN 'Engage with our community and earn points for your participation'
    WHEN 2 THEN 'Share your experience and help others discover our opportunities'
    WHEN 3 THEN 'Support our marketing efforts while earning rewards'
    WHEN 4 THEN 'Join our growing community and contribute to our success'
    WHEN 5 THEN 'Learn about our products while earning valuable points'
    WHEN 6 THEN 'Help spread the word about our amazing community'
    WHEN 7 THEN 'Complete this quick task to boost your earnings'
    WHEN 8 THEN 'Participate in our growth and get rewarded for your efforts'
    WHEN 9 THEN 'Share your success story and inspire others'
    WHEN 10 THEN 'Connect with like-minded entrepreneurs in our network'
    WHEN 11 THEN 'Demonstrate your commitment to our shared goals'
    WHEN 12 THEN 'Help build our online presence through social engagement'
    WHEN 13 THEN 'Contribute to our community while earning points'
    ELSE 'Take part in our mission to help others succeed'
  END,
  CASE (random() * 6)::int
    WHEN 0 THEN 'social_media'
    WHEN 1 THEN 'content_creation'
    WHEN 2 THEN 'training'
    WHEN 3 THEN 'webinar_attendance'
    WHEN 4 THEN 'app_engagement'
    ELSE 'survey'
  END,
  (5 + (random() * 95)::int),
  'https://task' || (random() * 1000)::int || '.example.com',
  CASE (random() * 4)::int
    WHEN 0 THEN 'screenshot'
    WHEN 1 THEN 'url_submission'
    WHEN 2 THEN 'completion_certificate'
    ELSE 'attendance_code'
  END,
  CASE WHEN random() < 0.9 THEN true ELSE false END,
  (SELECT user_id FROM profiles ORDER BY random() LIMIT 1)
FROM generate_series(1, 140);

-- Insert sample classified ads (80 ads)
INSERT INTO classified_ads (
  title, description, image_url, user_id, status, paid, posted_at, expires_at
) VALUES 
('Join Our Health & Wellness Revolution!', 'Looking for motivated individuals to join our growing health and wellness network. No experience required - we provide full training and support. Earn while you learn about premium nutritional products.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', (SELECT user_id FROM profiles ORDER BY random() LIMIT 1), 'active', true, now() - interval '2 days', now() + interval '28 days'),
('Exclusive Beauty Products - Be Your Own Boss', 'Revolutionary skincare line with proven results. Join our team of successful entrepreneurs and build your own beauty empire. High-quality products, amazing compensation plan.', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', (SELECT user_id FROM profiles ORDER BY random() LIMIT 1), 'active', true, now() - interval '1 day', now() + interval '29 days'),
('Financial Freedom Through Digital Marketing', 'Learn cutting-edge digital marketing strategies while building your financial future. Work from anywhere, set your own schedule, unlimited earning potential.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', (SELECT user_id FROM profiles ORDER BY random() LIMIT 1), 'active', true, now() - interval '4 hours', now() + interval '26 days'),
('Eco-Friendly Products Changing Lives', 'Be part of the green revolution! Promote sustainable products that make a difference. Perfect for environmentally conscious entrepreneurs.', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400', (SELECT user_id FROM profiles ORDER BY random() LIMIT 1), 'active', true, now() - interval '6 hours', now() + interval '25 days'),
('Travel The World While Earning Income', 'Join our travel club and discover how to earn money while exploring amazing destinations. Perfect for travel enthusiasts and adventure seekers.', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400', (SELECT user_id FROM profiles ORDER BY random() LIMIT 1), 'active', true, now() - interval '12 hours', now() + interval '27 days');

-- Add more classified ads
INSERT INTO classified_ads (title, description, image_url, user_id, status, paid, posted_at, expires_at)
SELECT 
  CASE (random() * 25)::int
    WHEN 0 THEN 'Start Your MLM Journey Today!'
    WHEN 1 THEN 'Premium Products, Premium Opportunity'
    WHEN 2 THEN 'Work From Home Success Story'
    WHEN 3 THEN 'Join Our Winning Team'
    WHEN 4 THEN 'Passive Income Opportunity'
    WHEN 5 THEN 'Life-Changing Business Model'
    WHEN 6 THEN 'Proven Success System'
    WHEN 7 THEN 'Unlimited Earning Potential'
    WHEN 8 THEN 'Be Your Own CEO'
    WHEN 9 THEN 'Revolutionary Products Available'
    WHEN 10 THEN 'Financial Independence Awaits'
    WHEN 11 THEN 'Turn Your Passion Into Profit'
    WHEN 12 THEN 'Elite Team Now Recruiting'
    WHEN 13 THEN 'Breakthrough Technology Products'
    WHEN 14 THEN 'Wellness Revolution Opportunity'
    WHEN 15 THEN 'Digital Age Business Model'
    WHEN 16 THEN 'Luxury Lifestyle Within Reach'
    WHEN 17 THEN 'Global Business Opportunity'
    WHEN 18 THEN 'Network of Success'
    WHEN 19 THEN 'Innovation Meets Opportunity'
    WHEN 20 THEN 'Dream Income Possible'
    WHEN 21 THEN 'Exclusive Partnership Available'
    WHEN 22 THEN 'Market Leader Seeking Partners'
    WHEN 23 THEN 'Time Freedom Opportunity'
    ELSE 'Success Stories Start Here'
  END,
  CASE (random() * 20)::int
    WHEN 0 THEN 'Amazing opportunity to build residual income with proven products and compensation plan'
    WHEN 1 THEN 'Join thousands of successful entrepreneurs who have transformed their lives'
    WHEN 2 THEN 'Ground floor opportunity with industry-leading products and training'
    WHEN 3 THEN 'Work with award-winning team and achieve financial freedom'
    WHEN 4 THEN 'Perfect timing to join our rapidly expanding global network'
    WHEN 5 THEN 'Revolutionary products that sell themselves - perfect for new entrepreneurs'
    WHEN 6 THEN 'Comprehensive training system ensures your success from day one'
    WHEN 7 THEN 'Flexible schedule allows you to work around your current commitments'
    WHEN 8 THEN 'Proven system that works for anyone willing to follow simple steps'
    WHEN 9 THEN 'Join our community of achievers and unlock your potential'
    WHEN 10 THEN 'High-demand products with exceptional profit margins'
    WHEN 11 THEN 'No experience necessary - full training and mentorship provided'
    WHEN 12 THEN 'Multiple income streams available through our diverse product line'
    WHEN 13 THEN 'International expansion creating unprecedented opportunities'
    WHEN 14 THEN 'Award-winning compensation plan with fast-start bonuses'
    WHEN 15 THEN 'Cutting-edge products backed by science and testimonials'
    WHEN 16 THEN 'Building teams of successful entrepreneurs across the globe'
    WHEN 17 THEN 'Technology platform makes building your business simple'
    WHEN 18 THEN 'Company leadership with decades of MLM experience'
    ELSE 'Life-changing opportunity for motivated individuals ready to succeed'
  END,
  CASE (random() * 10)::int
    WHEN 0 THEN 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
    WHEN 1 THEN 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'
    WHEN 2 THEN 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'
    WHEN 3 THEN 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400'
    WHEN 4 THEN 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'
    WHEN 5 THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
    WHEN 6 THEN 'https://images.unsplash.com/photo-1494790108755-2616b612b05b?w=400'
    WHEN 7 THEN 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
    WHEN 8 THEN 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
    ELSE 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'
  END,
  (SELECT user_id FROM profiles ORDER BY random() LIMIT 1),
  'active',
  true,
  now() - interval (random() * 30 || ' days'),
  now() + interval (random() * 60 + 15 || ' days')
FROM generate_series(1, 75);

-- Insert sample news articles (50 articles)
INSERT INTO news (
  headline, category, content, author, date, image_url, slug
) VALUES 
('MLM Industry Shows Strong Growth in 2024', 'Industry News', 'The Multi-Level Marketing industry continues to demonstrate resilience and growth despite global economic challenges. Recent studies show a 15% increase in participation across all demographics.', 'Financial Times Reporter', '2024-01-15', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600', 'mlm-industry-growth-2024'),
('New Regulations Bring Transparency to Network Marketing', 'Regulation', 'Government agencies worldwide are implementing new guidelines to ensure fair practices in network marketing, providing better protection for distributors and consumers alike.', 'Regulatory News Team', '2024-01-12', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600', 'new-regulations-network-marketing'),
('Technology Revolutionizes MLM Training Methods', 'Technology', 'Virtual reality and AI-powered training platforms are transforming how MLM companies onboard and educate their distributors, leading to higher success rates.', 'Tech Innovation Weekly', '2024-01-10', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600', 'technology-revolutionizes-mlm-training'),
('Sustainability Focus Drives New Product Lines', 'Environment', 'Leading MLM companies are launching eco-friendly product lines in response to growing consumer demand for sustainable alternatives.', 'Green Business Today', '2024-01-08', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600', 'sustainability-focus-new-products'),
('Social Media Marketing Transforms MLM Strategies', 'Marketing', 'Digital natives are reshaping network marketing through innovative social media strategies, creating new pathways to success in the MLM industry.', 'Digital Marketing Insights', '2024-01-05', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600', 'social-media-transforms-mlm');

-- Add more news articles
INSERT INTO news (headline, category, content, author, date, image_url, slug)
SELECT 
  CASE (random() * 20)::int
    WHEN 0 THEN 'Global MLM Convention Announces Record Attendance'
    WHEN 1 THEN 'Health and Wellness Sector Leads MLM Growth'
    WHEN 2 THEN 'New Tax Benefits for MLM Business Owners'
    WHEN 3 THEN 'International Expansion Opportunities Emerge'
    WHEN 4 THEN 'Celebrity Endorsements Boost MLM Credibility'
    WHEN 5 THEN 'Mobile Apps Transform MLM Business Management'
    WHEN 6 THEN 'Compensation Plan Innovations Drive Retention'
    WHEN 7 THEN 'Educational Partnerships Enhance Training'
    WHEN 8 THEN 'Blockchain Technology Enters MLM Space'
    WHEN 9 THEN 'Women Entrepreneurs Lead MLM Success'
    WHEN 10 THEN 'Rural Communities Embrace MLM Opportunities'
    WHEN 11 THEN 'Millennial Preferences Shape Product Development'
    WHEN 12 THEN 'Corporate Social Responsibility in MLM'
    WHEN 13 THEN 'Artificial Intelligence Optimizes Team Building'
    WHEN 14 THEN 'Global Economic Trends Favor MLM Model'
    WHEN 15 THEN 'Scientific Research Validates Health Products'
    WHEN 16 THEN 'Cultural Sensitivity in International Markets'
    WHEN 17 THEN 'Innovation Awards Recognize Industry Leaders'
    WHEN 18 THEN 'Regulatory Compliance Best Practices'
    ELSE 'Future Trends Reshape MLM Landscape'
  END,
  CASE (random() * 8)::int
    WHEN 0 THEN 'Industry News'
    WHEN 1 THEN 'Technology'
    WHEN 2 THEN 'Marketing'
    WHEN 3 THEN 'Regulation'
    WHEN 4 THEN 'Training'
    WHEN 5 THEN 'Success Stories'
    WHEN 6 THEN 'Product Innovation'
    ELSE 'Global Markets'
  END,
  'Comprehensive coverage of the latest developments in the network marketing industry, providing valuable insights for distributors, companies, and industry stakeholders.',
  CASE (random() * 10)::int
    WHEN 0 THEN 'Industry Expert'
    WHEN 1 THEN 'Business Analyst'
    WHEN 2 THEN 'Market Researcher'
    WHEN 3 THEN 'Financial Reporter'
    WHEN 4 THEN 'Technology Writer'
    WHEN 5 THEN 'Marketing Specialist'
    WHEN 6 THEN 'Regulatory Analyst'
    WHEN 7 THEN 'Success Coach'
    WHEN 8 THEN 'Product Reviewer'
    ELSE 'Global Correspondent'
  END,
  (current_date - interval (random() * 90 || ' days')),
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600',
  'news-article-' || (random() * 10000)::int
FROM generate_series(1, 45);

-- Insert sample events and discovery calls (40 events)
INSERT INTO events (
  title, type, date, start_time, end_time, location_type, address, city, country, webinar_url, is_paid
) VALUES 
('Monthly Success Webinar', 'Webinar', '2024-02-15', '2024-02-15 19:00:00+00', '2024-02-15 20:30:00+00', 'virtual', null, null, null, 'https://zoom.us/webinar/success-feb', false),
('Network Marketing Leadership Summit', 'Conference', '2024-03-20', '2024-03-20 09:00:00+00', '2024-03-20 17:00:00+00', 'physical', '123 Convention Center Dr', 'Las Vegas', 'United States', null, true),
('Product Launch Event', 'Product Launch', '2024-02-28', '2024-02-28 14:00:00+00', '2024-02-28 16:00:00+00', 'hybrid', '456 Business Plaza', 'Toronto', 'Canada', 'https://teams.microsoft.com/launch-event', false),
('International Team Building Workshop', 'Workshop', '2024-04-10', '2024-04-10 10:00:00+00', '2024-04-10 15:00:00+00', 'physical', '789 Training Center', 'London', 'United Kingdom', null, true),
('Digital Marketing Masterclass', 'Training', '2024-03-05', '2024-03-05 18:00:00+00', '2024-03-05 21:00:00+00', 'virtual', null, null, null, 'https://webex.com/masterclass-digital', false);

INSERT INTO discovery_calls (title, host, date, spots, url)
VALUES 
('Discover Your MLM Potential', 'Sarah Mitchell', '2024-02-20', '50 spots available', 'https://calendly.com/sarah-mitchell/discovery'),
('Financial Freedom Through Network Marketing', 'Marcus Johnson', '2024-02-22', '30 spots available', 'https://calendly.com/marcus-johnson/freedom'),
('Building Your Dream Team', 'Elena Rodriguez', '2024-02-25', '25 spots available', 'https://calendly.com/elena-rodriguez/team-building'),
('Technology in Modern MLM', 'David Kim', '2024-02-27', '40 spots available', 'https://calendly.com/david-kim/tech-mlm'),
('Beauty Industry Opportunities', 'Amanda Foster', '2024-03-01', '35 spots available', 'https://calendly.com/amanda-foster/beauty-opportunity');

-- Insert sample community topics (30 topics)
INSERT INTO community_topics (
  title, author, replies, trending, url
) VALUES 
('Best Strategies for Team Building in 2024', 'NetworkPro Sarah', 45, true, '/community/team-building-strategies-2024'),
('How to Handle Objections Like a Pro', 'SuccessCoach Mike', 67, true, '/community/handling-objections-pro'),
('Social Media Marketing for MLM Success', 'DigitalMaven Lisa', 89, true, '/community/social-media-mlm-success'),
('Overcoming Rejection and Staying Motivated', 'MotivationGuru Alex', 123, false, '/community/overcoming-rejection-motivation'),
('Product Knowledge: The Foundation of Success', 'ProductExpert Kim', 34, false, '/community/product-knowledge-foundation'),
('Building Relationships vs. Selling Products', 'RelationshipBuilder Tom', 56, false, '/community/relationships-vs-selling'),
('Time Management for Busy MLM Entrepreneurs', 'ProductivityPro Emma', 78, true, '/community/time-management-entrepreneurs'),
('Creating Compelling Content for Your Audience', 'ContentCreator Maya', 91, false, '/community/compelling-content-creation'),
('Understanding Compensation Plans', 'CompPlanExpert Joe', 42, false, '/community/understanding-compensation-plans'),
('International Expansion Strategies', 'GlobalGrowth Anna', 35, false, '/community/international-expansion-strategies');

-- Add more community topics
INSERT INTO community_topics (title, author, replies, trending, url)
SELECT 
  CASE (random() * 20)::int
    WHEN 0 THEN 'Effective Prospecting Techniques'
    WHEN 1 THEN 'Leadership Development Tips'
    WHEN 2 THEN 'Personal Branding for MLM'
    WHEN 3 THEN 'Setting and Achieving Goals'
    WHEN 4 THEN 'Building Online Presence'
    WHEN 5 THEN 'Customer Retention Strategies'
    WHEN 6 THEN 'Training New Team Members'
    WHEN 7 THEN 'Handling Competition'
    WHEN 8 THEN 'Work-Life Balance'
    WHEN 9 THEN 'Technology Tools for MLM'
    WHEN 10 THEN 'Building Trust with Prospects'
    WHEN 11 THEN 'Event Planning and Execution'
    WHEN 12 THEN 'Income Diversification'
    WHEN 13 THEN 'Legal Compliance Tips'
    WHEN 14 THEN 'Seasonal Marketing Strategies'
    WHEN 15 THEN 'Team Communication Best Practices'
    WHEN 16 THEN 'Personal Development Journey'
    WHEN 17 THEN 'Market Research Techniques'
    WHEN 18 THEN 'Crisis Management in MLM'
    ELSE 'Future of Network Marketing'
  END,
  CASE (random() * 15)::int
    WHEN 0 THEN 'MLMExpert John'
    WHEN 1 THEN 'SuccessStory Maria'
    WHEN 2 THEN 'TeamBuilder Chris'
    WHEN 3 THEN 'GrowthHacker Sam'
    WHEN 4 THEN 'LeadershipCoach Pat'
    WHEN 5 THEN 'DigitalNomad Alex'
    WHEN 6 THEN 'WealthBuilder Kim'
    WHEN 7 THEN 'NetworkNinja Taylor'
    WHEN 8 THEN 'BusinessMentor Jordan'
    WHEN 9 THEN 'SuccessSeeker Casey'
    WHEN 10 THEN 'EntrepreneurLife Morgan'
    WHEN 11 THEN 'MLMStrategy Riley'
    WHEN 12 THEN 'TeamSuccess Quinn'
    WHEN 13 THEN 'NetworkGrowth Avery'
    ELSE 'MLMWisdom Drew'
  END,
  (random() * 150)::int,
  CASE WHEN random() < 0.3 THEN true ELSE false END,
  '/community/topic-' || (random() * 10000)::int
FROM generate_series(1, 20);

-- Insert sample points ledger entries for users (200 entries)
INSERT INTO points_ledger (user_id, amount, type, event_code, note, created_at)
SELECT 
  (SELECT user_id FROM profiles ORDER BY random() LIMIT 1),
  CASE (random() * 10)::int
    WHEN 0 THEN 15 -- Social media task
    WHEN 1 THEN 25 -- App download
    WHEN 2 THEN 50 -- Content creation
    WHEN 3 THEN 75 -- Webinar attendance
    WHEN 4 THEN 100 -- Training completion
    WHEN 5 THEN 200 -- Referral bonus
    WHEN 6 THEN 500 -- Package purchase bonus
    WHEN 7 THEN 1000 -- Monthly achievement
    WHEN 8 THEN 300 -- Team building bonus
    ELSE 40 -- General task completion
  END,
  'reward',
  CASE (random() * 8)::int
    WHEN 0 THEN 'task_completion'
    WHEN 1 THEN 'social_media_task'
    WHEN 2 THEN 'referral_bonus'
    WHEN 3 THEN 'training_completion'
    WHEN 4 THEN 'webinar_attendance'
    WHEN 5 THEN 'content_creation'
    WHEN 6 THEN 'monthly_bonus'
    ELSE 'achievement_unlock'
  END,
  CASE (random() * 15)::int
    WHEN 0 THEN 'Completed Instagram follow task'
    WHEN 1 THEN 'Successfully referred new member'
    WHEN 2 THEN 'Attended weekly training webinar'
    WHEN 3 THEN 'Created engaging social media content'
    WHEN 4 THEN 'Downloaded and rated mobile app'
    WHEN 5 THEN 'Completed product knowledge quiz'
    WHEN 6 THEN 'Shared success story video'
    WHEN 7 THEN 'Joined community discussion'
    WHEN 8 THEN 'Monthly activity bonus'
    WHEN 9 THEN 'Team building achievement'
    WHEN 10 THEN 'Leadership milestone reached'
    WHEN 11 THEN 'Training module completed'
    WHEN 12 THEN 'Customer review submitted'
    WHEN 13 THEN 'Event attendance bonus'
    ELSE 'Daily engagement reward'
  END,
  now() - interval (random() * 90 || ' days')
FROM generate_series(1, 200);

-- Insert some debit entries for withdrawals
INSERT INTO points_ledger (user_id, amount, type, event_code, note, created_at)
SELECT 
  (SELECT user_id FROM profiles ORDER BY random() LIMIT 1),
  -(random() * 5000 + 1000)::int,
  'debit',
  'withdrawal_request',
  'Points withdrawal to bank account',
  now() - interval (random() * 60 || ' days')
FROM generate_series(1, 30);

-- Insert sample user task completions (300 completions)
INSERT INTO user_task_completions (user_id, task_id, completed_at, status)
SELECT 
  (SELECT user_id FROM profiles ORDER BY random() LIMIT 1),
  (SELECT id FROM tasks ORDER BY random() LIMIT 1),
  now() - interval (random() * 30 || ' days'),
  CASE WHEN random() < 0.9 THEN 'completed' ELSE 'pending' END
FROM generate_series(1, 300);

-- Insert sample user ad views (400 views)
INSERT INTO user_ad_views (user_id, ad_id, viewed_at, status)
SELECT 
  (SELECT user_id FROM profiles ORDER BY random() LIMIT 1),
  (SELECT id FROM classified_ads ORDER BY random() LIMIT 1),
  now() - interval (random() * 15 || ' days'),
  'viewed'
FROM generate_series(1, 400);

-- Insert sample reviews for companies (200 reviews)
INSERT INTO reviews (company_id, user_id, rating, review, created_at)
SELECT 
  (SELECT id FROM companies ORDER BY random() LIMIT 1),
  (SELECT user_id FROM profiles ORDER BY random() LIMIT 1),
  (3 + random() * 2)::int, -- Ratings between 3-5
  CASE (random() * 20)::int
    WHEN 0 THEN 'Excellent company with great products and support. Highly recommend!'
    WHEN 1 THEN 'Amazing opportunity with professional team and training.'
    WHEN 2 THEN 'Great compensation plan and wonderful community atmosphere.'
    WHEN 3 THEN 'Products are high quality and the business model is sustainable.'
    WHEN 4 THEN 'Outstanding leadership and mentorship throughout my journey.'
    WHEN 5 THEN 'Innovative products that customers love. Easy to sell!'
    WHEN 6 THEN 'Transparent company with ethical business practices.'
    WHEN 7 THEN 'Comprehensive training system that sets you up for success.'
    WHEN 8 THEN 'Supportive community that helps each other succeed.'
    WHEN 9 THEN 'Fair compensation and timely payments every month.'
    WHEN 10 THEN 'Professional approach with focus on long-term success.'
    WHEN 11 THEN 'Quality products backed by science and research.'
    WHEN 12 THEN 'Great company culture that values integrity and success.'
    WHEN 13 THEN 'Excellent customer service and distributor support.'
    WHEN 14 THEN 'Proven system that works when you follow the training.'
    WHEN 15 THEN 'International expansion opportunities are amazing.'
    WHEN 16 THEN 'Technology platform makes business building simple.'
    WHEN 17 THEN 'Regular events and training keep you motivated.'
    WHEN 18 THEN 'Leadership is accessible and genuinely cares about success.'
    ELSE 'Life-changing opportunity with unlimited potential.'
  END,
  now() - interval (random() * 365 || ' days')
FROM generate_series(1, 200);

-- Insert sample user referrals (150 referrals) 
INSERT INTO user_referrals (user_id, referrer_id, grand_referrer_id, referred_at)
SELECT 
  (SELECT user_id FROM profiles ORDER BY random() LIMIT 1),
  (SELECT user_id FROM profiles ORDER BY random() LIMIT 1),
  CASE WHEN random() < 0.7 THEN (SELECT user_id FROM profiles ORDER BY random() LIMIT 1) ELSE NULL END,
  now() - interval (random() * 180 || ' days')
FROM generate_series(1, 150);

-- Insert sample profile followers (250 follow relationships)
INSERT INTO profile_followers (follower_id, following_id, created_at)
SELECT DISTINCT
  p1.user_id,
  p2.user_id,
  now() - interval (random() * 90 || ' days')
FROM profiles p1
CROSS JOIN profiles p2
WHERE p1.user_id != p2.user_id
ORDER BY random()
LIMIT 250;

-- Insert sample comments (100 comments)
INSERT INTO comments (user_id, target_id, target_type, content, created_at)
SELECT 
  (SELECT user_id FROM profiles ORDER BY random() LIMIT 1),
  (SELECT id FROM companies ORDER BY random() LIMIT 1),
  'company',
  CASE (random() * 15)::int
    WHEN 0 THEN 'Great company with excellent leadership and support!'
    WHEN 1 THEN 'Amazing products that really deliver results.'
    WHEN 2 THEN 'Professional organization with transparent practices.'
    WHEN 3 THEN 'Supportive community that helps everyone succeed.'
    WHEN 4 THEN 'Innovative approach to network marketing.'
    WHEN 5 THEN 'Quality training and mentorship programs.'
    WHEN 6 THEN 'Fair compensation plan with great bonuses.'
    WHEN 7 THEN 'International opportunities are impressive.'
    WHEN 8 THEN 'Technology platform is user-friendly and effective.'
    WHEN 9 THEN 'Regular events keep the team motivated and informed.'
    WHEN 10 THEN 'Ethical business practices build trust and confidence.'
    WHEN 11 THEN 'Customer service exceeds expectations consistently.'
    WHEN 12 THEN 'Proven system that works for dedicated individuals.'
    WHEN 13 THEN 'Strong company culture focused on success and integrity.'
    ELSE 'Life-changing opportunity for anyone willing to work hard.'
  END,
  now() - interval (random() * 60 || ' days')
FROM generate_series(1, 100);

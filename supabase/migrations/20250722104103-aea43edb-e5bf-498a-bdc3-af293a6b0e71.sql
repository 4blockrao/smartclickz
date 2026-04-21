
-- Create packages table for investment packages
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  daily_percentage NUMERIC NOT NULL,
  campaign_goal_multiplier INTEGER NOT NULL DEFAULT 2,
  referral_boost_percentage NUMERIC NOT NULL DEFAULT 0,
  max_campaigns INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  features TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_packages table to track user investments
CREATE TABLE public.user_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  package_id UUID NOT NULL REFERENCES public.packages(id),
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active',
  target_amount NUMERIC NOT NULL,
  total_earned NUMERIC NOT NULL DEFAULT 0,
  daily_earnings NUMERIC NOT NULL DEFAULT 0,
  days_active INTEGER NOT NULL DEFAULT 0,
  remaining_days INTEGER,
  last_payout_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign_tasks table for individual tasks within campaigns
CREATE TABLE public.campaign_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id),
  user_id UUID REFERENCES auth.users(id),
  task_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  reward_amount NUMERIC NOT NULL,
  proof_url TEXT,
  assigned_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default packages
INSERT INTO public.packages (name, price, daily_percentage, campaign_goal_multiplier, referral_boost_percentage, description, features) VALUES
('Starter', 50, 0.3, 2, 0.1, 'Perfect for beginners starting their social media journey', ARRAY['Basic campaign access', 'Email support', 'Mobile app access']),
('Bronze', 100, 0.4, 2, 0.15, 'Great for growing your social presence steadily', ARRAY['Priority task access', 'Advanced analytics', 'Live chat support']),
('Silver', 250, 0.5, 2, 0.2, 'Ideal for serious social media enthusiasts', ARRAY['Premium campaigns', 'Custom targeting', 'Priority support']),
('Gold', 500, 0.6, 2, 0.25, 'For ambitious marketers and influencers', ARRAY['Exclusive campaigns', 'Personal account manager', 'Advanced tools']),
('Platinum', 1000, 0.7, 2, 0.3, 'Professional-grade social media acceleration', ARRAY['VIP campaign access', 'Custom strategies', '24/7 dedicated support']),
('Diamond', 2500, 0.8, 2, 0.35, 'Elite package for social media professionals', ARRAY['Unlimited campaigns', 'White-label options', 'API access']),
('Elite', 5000, 0.9, 2, 0.4, 'The ultimate social media powerhouse', ARRAY['Enterprise features', 'Custom integrations', 'Personal consultant']);

-- Enable RLS on new tables
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_tasks ENABLE ROW LEVEL SECURITY;

-- RLS policies for packages
CREATE POLICY "Anyone can view active packages" ON public.packages FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage packages" ON public.packages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for user_packages
CREATE POLICY "Users can view their own packages" ON public.user_packages FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own packages" ON public.user_packages FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own packages" ON public.user_packages FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all user packages" ON public.user_packages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for campaign_tasks
CREATE POLICY "Users can view available tasks" ON public.campaign_tasks FOR SELECT USING (status = 'available' OR user_id = auth.uid());
CREATE POLICY "Users can take and submit their tasks" ON public.campaign_tasks FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all tasks" ON public.campaign_tasks FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

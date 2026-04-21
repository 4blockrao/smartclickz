-- Create enum types for the platform
CREATE TYPE campaign_type AS ENUM ('follower_growth', 'engagement_boost', 'content_amplification', 'surveys', 'app_installs', 'social_media_follow', 'social_media_like', 'social_media_share', 'social_media_comment');

CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');

CREATE TYPE task_status AS ENUM ('available', 'assigned', 'submitted', 'approved', 'rejected', 'expired');

CREATE TYPE social_platform AS ENUM ('instagram', 'facebook', 'linkedin', 'twitter', 'youtube', 'tiktok', 'telegram');

CREATE TYPE proof_type AS ENUM ('screenshot', 'api_validation', 'manual_review', 'link_submission');

CREATE TYPE transaction_type AS ENUM ('task_reward', 'campaign_payment', 'withdrawal', 'refund', 'commission', 'bonus');

-- Create clients table for businesses/promoters
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_website TEXT,
  company_description TEXT,
  business_email TEXT NOT NULL,
  business_phone TEXT,
  country TEXT,
  city TEXT,
  industry TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  wallet_balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_spent DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  campaign_type campaign_type NOT NULL,
  target_platform social_platform NOT NULL,
  target_url TEXT,
  target_countries TEXT[],
  target_cities TEXT[],
  target_age_min INTEGER,
  target_age_max INTEGER,
  target_interests TEXT[],
  reward_per_task DECIMAL(10,2) NOT NULL,
  total_budget DECIMAL(10,2) NOT NULL,
  spent_budget DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  max_tasks INTEGER NOT NULL,
  completed_tasks INTEGER NOT NULL DEFAULT 0,
  proof_type proof_type NOT NULL DEFAULT 'screenshot',
  proof_requirements TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status campaign_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign_tasks table (specific task instances)
CREATE TABLE public.campaign_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  proof_url TEXT,
  proof_data JSONB,
  admin_note TEXT,
  status task_status NOT NULL DEFAULT 'available',
  reward_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create social_accounts table for user verification
CREATE TABLE public.social_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform social_platform NOT NULL,
  username TEXT NOT NULL,
  profile_url TEXT NOT NULL,
  follower_count INTEGER,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  verified_at TIMESTAMP WITH TIME ZONE,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- Create transactions table for all financial activities
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  task_id UUID REFERENCES public.campaign_tasks(id) ON DELETE SET NULL,
  type transaction_type NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  description TEXT,
  reference_id TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_logs table for audit trails
CREATE TABLE public.admin_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_stats table for gamification
CREATE TABLE public.user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_tasks_completed INTEGER NOT NULL DEFAULT 0,
  total_earnings DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  success_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  badges TEXT[],
  last_task_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Update the existing app_role enum to include client role
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'client';

-- Enable RLS on all new tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for clients table
CREATE POLICY "Clients can view their own data" ON public.clients
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Clients can update their own data" ON public.clients
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can create client profiles" ON public.clients
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all clients" ON public.clients
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for campaigns table
CREATE POLICY "Clients can view their own campaigns" ON public.campaigns
  FOR SELECT USING (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );

CREATE POLICY "Clients can manage their own campaigns" ON public.campaigns
  FOR ALL USING (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view active campaigns" ON public.campaigns
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage all campaigns" ON public.campaigns
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for campaign_tasks table
CREATE POLICY "Users can view tasks assigned to them" ON public.campaign_tasks
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view available tasks" ON public.campaign_tasks
  FOR SELECT USING (status = 'available' AND user_id IS NULL);

CREATE POLICY "Users can update their assigned tasks" ON public.campaign_tasks
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Clients can view tasks for their campaigns" ON public.campaign_tasks
  FOR SELECT USING (
    campaign_id IN (
      SELECT id FROM public.campaigns 
      WHERE client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Admins can manage all tasks" ON public.campaign_tasks
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for social_accounts table
CREATE POLICY "Users can manage their own social accounts" ON public.social_accounts
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all social accounts" ON public.social_accounts
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for transactions table
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Clients can view their own transactions" ON public.transactions
  FOR SELECT USING (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can view all transactions" ON public.transactions
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for admin_logs table
CREATE POLICY "Admins can view all logs" ON public.admin_logs
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create logs" ON public.admin_logs
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for user_stats table
CREATE POLICY "Users can view their own stats" ON public.user_stats
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Public can view leaderboard stats" ON public.user_stats
  FOR SELECT USING (true);

CREATE POLICY "System can update user stats" ON public.user_stats
  FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_campaigns_client_id ON public.campaigns(client_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaign_tasks_campaign_id ON public.campaign_tasks(campaign_id);
CREATE INDEX idx_campaign_tasks_user_id ON public.campaign_tasks(user_id);
CREATE INDEX idx_campaign_tasks_status ON public.campaign_tasks(status);
CREATE INDEX idx_social_accounts_user_id ON public.social_accounts(user_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_client_id ON public.transactions(client_id);
CREATE INDEX idx_user_stats_user_id ON public.user_stats(user_id);

-- Create functions for campaign task management
CREATE OR REPLACE FUNCTION public.assign_task_to_user(task_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.campaign_tasks
  SET 
    user_id = assign_task_to_user.user_id,
    assigned_at = now(),
    status = 'assigned',
    updated_at = now()
  WHERE 
    id = assign_task_to_user.task_id 
    AND status = 'available'
    AND campaign_tasks.user_id IS NULL;
  
  RETURN FOUND;
END;
$$;

-- Create function to update user stats when task is completed
CREATE OR REPLACE FUNCTION public.update_user_stats_on_task_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'submitted' THEN
    INSERT INTO public.user_stats (user_id, total_tasks_completed, total_earnings, last_task_completed_at)
    VALUES (NEW.user_id, 1, NEW.reward_amount, now())
    ON CONFLICT (user_id) 
    DO UPDATE SET
      total_tasks_completed = user_stats.total_tasks_completed + 1,
      total_earnings = user_stats.total_earnings + NEW.reward_amount,
      last_task_completed_at = now(),
      updated_at = now();
    
    -- Create transaction record
    INSERT INTO public.transactions (
      user_id, task_id, type, amount, description
    ) VALUES (
      NEW.user_id, NEW.id, 'task_reward', NEW.reward_amount, 
      'Task completion reward'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for user stats update
CREATE TRIGGER update_user_stats_trigger
  AFTER UPDATE ON public.campaign_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_stats_on_task_completion();

-- Update profiles table to include wallet balance
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS withdrawal_method TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS withdrawal_details JSONB;
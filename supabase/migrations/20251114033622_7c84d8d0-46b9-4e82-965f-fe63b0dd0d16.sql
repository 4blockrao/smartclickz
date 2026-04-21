-- CRITICAL SECURITY FIXES - EXISTING TABLES ONLY

-- ============================================
-- PART 1: ENABLE RLS ON EXISTING TABLES
-- ============================================

-- Enable RLS on profiles table (CRITICAL - contains PII)
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on other critical existing tables
ALTER TABLE IF EXISTS public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 2: CREATE SECURE RLS POLICIES
-- ============================================

-- ACTIVITY LOG POLICIES
CREATE POLICY "users_view_own_activity" ON public.activity_log
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "admins_view_all_activity" ON public.activity_log
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "system_insert_activity" ON public.activity_log
  FOR INSERT
  WITH CHECK (true);

-- USER STATS POLICIES
CREATE POLICY "users_view_own_stats" ON public.user_stats
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "admins_view_all_stats" ON public.user_stats
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "system_manage_stats" ON public.user_stats
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- WITHDRAWAL REQUESTS POLICIES
CREATE POLICY "users_view_own_withdrawals" ON public.withdrawal_requests
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_create_own_withdrawals" ON public.withdrawal_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admins_view_all_withdrawals" ON public.withdrawal_requests
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_update_withdrawals" ON public.withdrawal_requests
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- SETTINGS POLICIES (Admin only - CRITICAL)
CREATE POLICY "admins_view_settings" ON public.settings
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_manage_settings" ON public.settings
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- PART 3: SECURE DATABASE FUNCTIONS
-- ============================================

-- Update all functions to include SET search_path for security

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.assign_task_to_user(task_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.generate_aa_referral_user_id()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  candidate TEXT;
  i INT := 0;
BEGIN
  LOOP
    EXIT WHEN i >= 10;
    candidate := 'AA' || public.rand_5_digits();
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_user_id = candidate) THEN
      RETURN candidate;
    END IF;
    i := i + 1;
  END LOOP;
  RAISE EXCEPTION 'Failed to generate unique AA referral_user_id after 10 attempts';
END;
$$;

CREATE OR REPLACE FUNCTION public.rand_5_digits()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  n INTEGER;
BEGIN
  n := floor(random() * 100000)::INTEGER;
  RETURN lpad(n::text, 5, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.set_aa_referral_user_id()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.referral_user_id IS NULL OR NEW.referral_user_id = '' THEN
    NEW.referral_user_id := public.generate_aa_referral_user_id();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_profile_follower_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.task_completion_points_audit()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  payout_points integer;
BEGIN
  IF (TG_OP = 'UPDATE' AND NEW.status = 'rejected' AND OLD.status = 'completed') THEN
    SELECT t.payout_points INTO payout_points FROM tasks t WHERE t.id = NEW.task_id;
    IF payout_points IS NOT NULL AND payout_points > 0 THEN
      INSERT INTO points_ledger (user_id, amount, event_code, type, created_at, note)
      VALUES (NEW.user_id, payout_points, 'task_reversal_' || NEW.task_id, 'debit', now(), 'Task completion rejected: ' || NEW.task_id);
    END IF;
    INSERT INTO task_event_logs (user_id, task_id, task_type, event_type, event_by, event_note)
      VALUES (NEW.user_id, NEW.task_id, 'community', 'rejected', auth.uid(), 'Admin rejected previously completed task');
  ELSIF (TG_OP = 'INSERT' AND NEW.status = 'completed') THEN
    SELECT t.payout_points INTO payout_points FROM tasks t WHERE t.id = NEW.task_id;
    IF payout_points IS NOT NULL AND payout_points > 0 THEN
      INSERT INTO points_ledger
      (user_id, amount, event_code, type, created_at, note)
      VALUES
      (NEW.user_id, payout_points, 'task_' || NEW.task_id, 'reward', now(), 'Completed task: ' || NEW.task_id);
    END IF;
    INSERT INTO task_event_logs (user_id, task_id, task_type, event_type, event_by, event_note)
      VALUES (NEW.user_id, NEW.task_id, 'community', 'approved', NULL, 'User completed task');
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.onboarding_completion_points_audit()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  points_amount integer;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    SELECT points INTO points_amount FROM onboarding_tasks WHERE id = NEW.onboarding_task_id;
    IF points_amount IS NOT NULL AND points_amount > 0 THEN
      INSERT INTO points_ledger
      (user_id, amount, event_code, type, created_at, note)
      VALUES
      (NEW.user_id, points_amount, 'onboarding_' || NEW.onboarding_task_id, 'reward', now(), 'Completed onboarding: ' || NEW.onboarding_task_id);
    END IF;
    INSERT INTO task_event_logs (user_id, task_id, task_type, event_type, event_by, event_note)
      VALUES (NEW.user_id, NEW.onboarding_task_id, 'onboarding', 'approved', NULL, 'User completed onboarding');
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.task_completion_add_points()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  payout_points int;
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.status = 'completed') THEN
    SELECT t.payout_points INTO payout_points FROM tasks t WHERE t.id = NEW.task_id;
    IF payout_points IS NOT NULL AND payout_points > 0 THEN
      INSERT INTO points_ledger
        (user_id, amount, event_code, type, created_at, note)
      VALUES
        (NEW.user_id, payout_points, 'task_' || NEW.task_id, 'reward', now(),
          'Completed task: ' || NEW.task_id);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_user_stats_on_task_completion()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
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
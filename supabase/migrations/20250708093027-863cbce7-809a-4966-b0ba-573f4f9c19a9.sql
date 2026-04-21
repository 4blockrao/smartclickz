
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'moderator', 'user');

-- Create enum for MFA methods
CREATE TYPE public.mfa_method AS ENUM ('totp', 'sms', 'email');

-- Create enum for device types
CREATE TYPE public.device_type AS ENUM ('desktop', 'mobile', 'tablet', 'unknown');

-- Create enum for login status
CREATE TYPE public.login_status AS ENUM ('success', 'failed', 'blocked', 'suspicious');

-- Enhanced profiles table with security fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login_ip INET;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS backup_codes TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"security_alerts": true, "login_notifications": true, "marketing": false}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';

-- Create user roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'user',
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, role)
);

-- Create MFA settings table
CREATE TABLE IF NOT EXISTS public.user_mfa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  method mfa_method NOT NULL,
  secret_key TEXT, -- For TOTP
  phone_number TEXT, -- For SMS
  is_verified BOOLEAN DEFAULT false,
  backup_codes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, method)
);

-- Create login history table
CREATE TABLE IF NOT EXISTS public.login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address INET NOT NULL,
  user_agent TEXT,
  device_type device_type DEFAULT 'unknown',
  location JSONB, -- Store country, city, etc.
  status login_status NOT NULL,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT,
  is_suspicious BOOLEAN DEFAULT false,
  failure_reason TEXT
);

-- Create active sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address INET NOT NULL,
  user_agent TEXT,
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Create security events table
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'password_change', 'email_change', 'mfa_enabled', etc.
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acknowledged_at TIMESTAMP WITH TIME ZONE
);

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET
);

-- Create user preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, key)
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mfa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin' AND ur.is_active = true
  ));

-- RLS Policies for user_mfa
CREATE POLICY "Users can manage their own MFA" ON public.user_mfa
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for login_history
CREATE POLICY "Users can view their own login history" ON public.login_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert login history" ON public.login_history
  FOR INSERT WITH CHECK (true);

-- RLS Policies for user_sessions
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON public.user_sessions
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "System can manage sessions" ON public.user_sessions
  FOR ALL WITH CHECK (true);

-- RLS Policies for security_events
CREATE POLICY "Users can view their own security events" ON public.security_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create security events" ON public.security_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can acknowledge their events" ON public.security_events
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for password_reset_tokens
CREATE POLICY "System can manage reset tokens" ON public.password_reset_tokens
  FOR ALL WITH CHECK (true);

-- RLS Policies for user_preferences
CREATE POLICY "Users can manage their own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON public.login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_attempted_at ON public.login_history(attempted_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON public.user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON public.password_reset_tokens(expires_at);

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION public.user_has_role(user_id UUID, role_name user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = $1 
    AND user_roles.role = $2 
    AND user_roles.is_active = true
    AND (user_roles.expires_at IS NULL OR user_roles.expires_at > NOW())
  );
$$;

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_event_data JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.security_events (user_id, event_type, event_data, ip_address, user_agent)
  VALUES (p_user_id, p_event_type, p_event_data, p_ip_address, p_user_agent)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS INTEGER
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.user_sessions 
  WHERE expires_at < NOW() OR last_activity < NOW() - INTERVAL '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Function to cleanup expired reset tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_reset_tokens()
RETURNS INTEGER
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.password_reset_tokens 
  WHERE expires_at < NOW() OR used_at IS NOT NULL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Trigger to automatically assign default role to new users
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user role assignment
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Function to handle login attempts
CREATE OR REPLACE FUNCTION public.record_login_attempt(
  p_user_id UUID,
  p_ip_address INET,
  p_user_agent TEXT,
  p_status login_status,
  p_device_type device_type DEFAULT 'unknown',
  p_location JSONB DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL,
  p_failure_reason TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
DECLARE
  history_id UUID;
  failed_attempts INTEGER;
BEGIN
  -- Insert login history
  INSERT INTO public.login_history (
    user_id, ip_address, user_agent, device_type, location, 
    status, session_id, failure_reason
  )
  VALUES (
    p_user_id, p_ip_address, p_user_agent, p_device_type, p_location,
    p_status, p_session_id, p_failure_reason
  )
  RETURNING id INTO history_id;
  
  -- Update profile based on login status
  IF p_status = 'success' THEN
    UPDATE public.profiles 
    SET 
      failed_login_attempts = 0,
      account_locked_until = NULL,
      last_login_ip = p_ip_address,
      last_login_at = NOW()
    WHERE user_id = p_user_id;
  ELSIF p_status = 'failed' THEN
    UPDATE public.profiles 
    SET failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1
    WHERE user_id = p_user_id
    RETURNING failed_login_attempts INTO failed_attempts;
    
    -- Lock account after 5 failed attempts
    IF failed_attempts >= 5 THEN
      UPDATE public.profiles 
      SET account_locked_until = NOW() + INTERVAL '30 minutes'
      WHERE user_id = p_user_id;
      
      -- Log security event
      PERFORM public.log_security_event(
        p_user_id,
        'account_locked',
        jsonb_build_object('reason', 'too_many_failed_attempts', 'attempts', failed_attempts),
        p_ip_address,
        p_user_agent
      );
    END IF;
  END IF;
  
  RETURN history_id;
END;
$$;

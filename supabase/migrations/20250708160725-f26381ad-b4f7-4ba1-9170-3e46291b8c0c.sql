
-- Create user_profile_reviews table for user profile reviews
CREATE TABLE public.user_profile_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_user_id uuid NOT NULL,
  reviewed_user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user_profile_comments table for user profile comments
CREATE TABLE public.user_profile_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  commenter_user_id uuid NOT NULL,
  commented_user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create comment_replies table for replies to comments (both company and user profile comments)
CREATE TABLE public.comment_replies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_comment_id uuid NOT NULL,
  comment_type text NOT NULL CHECK (comment_type IN ('company', 'user_profile')),
  replier_user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.user_profile_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profile_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_replies ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profile_reviews
CREATE POLICY "Public can view user profile reviews" 
  ON public.user_profile_reviews 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create reviews for others" 
  ON public.user_profile_reviews 
  FOR INSERT 
  WITH CHECK (auth.uid() = reviewer_user_id AND reviewer_user_id != reviewed_user_id);

CREATE POLICY "Users can update their own reviews" 
  ON public.user_profile_reviews 
  FOR UPDATE 
  USING (auth.uid() = reviewer_user_id);

CREATE POLICY "Users can delete their own reviews" 
  ON public.user_profile_reviews 
  FOR DELETE 
  USING (auth.uid() = reviewer_user_id);

-- RLS policies for user_profile_comments
CREATE POLICY "Public can view user profile comments" 
  ON public.user_profile_comments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create comments on profiles" 
  ON public.user_profile_comments 
  FOR INSERT 
  WITH CHECK (auth.uid() = commenter_user_id);

CREATE POLICY "Users can update their own comments" 
  ON public.user_profile_comments 
  FOR UPDATE 
  USING (auth.uid() = commenter_user_id);

CREATE POLICY "Users can delete their own comments" 
  ON public.user_profile_comments 
  FOR DELETE 
  USING (auth.uid() = commenter_user_id);

-- RLS policies for comment_replies
CREATE POLICY "Public can view comment replies" 
  ON public.comment_replies 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create replies to comments" 
  ON public.comment_replies 
  FOR INSERT 
  WITH CHECK (auth.uid() = replier_user_id);

CREATE POLICY "Users can update their own replies" 
  ON public.comment_replies 
  FOR UPDATE 
  USING (auth.uid() = replier_user_id);

CREATE POLICY "Users can delete their own replies" 
  ON public.comment_replies 
  FOR DELETE 
  USING (auth.uid() = replier_user_id);

-- Add company_comments table for company profile comments
CREATE TABLE public.company_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL,
  commenter_user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on company_comments
ALTER TABLE public.company_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for company_comments
CREATE POLICY "Public can view company comments" 
  ON public.company_comments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create comments on companies" 
  ON public.company_comments 
  FOR INSERT 
  WITH CHECK (auth.uid() = commenter_user_id);

CREATE POLICY "Users can update their own company comments" 
  ON public.company_comments 
  FOR UPDATE 
  USING (auth.uid() = commenter_user_id);

CREATE POLICY "Users can delete their own company comments" 
  ON public.company_comments 
  FOR DELETE 
  USING (auth.uid() = commenter_user_id);

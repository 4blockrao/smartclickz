
import { z } from "zod";

// Main Profile Form Schema
export const profileFormSchema = z.object({
  full_name: z.string(),
  username: z.string().optional(),
  profile_image_url: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
  current_role: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  key_skills: z.string().optional(),
  date_of_birth: z.date().optional().nullable(),
  badge: z.string().optional(),
  referral_code: z.string().optional(),
  points: z.number().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export type UserProfile = {
  id: string;
  user_id: string;
  display_name: string;
  profile_image_url?: string | null;
  city?: string | null;
  country?: string | null;
  bio?: string | null;
  key_skills?: string | null;
  points?: number;
  // Profile details
  full_name?: string;
  username?: string;
  current_role?: string;
  company?: string;
  industry?: string;
  badge?: string;
  referral_code?: string;
  date_of_birth?: string | null;
};

// ----- EXPERIENCE SCHEMA -----
export const profileExperienceFormSchema = z.object({
  company_name: z.string().min(1, "Company is required."),
  title: z.string().min(1, "Title is required."),
  location: z.string().optional(),
  employment_type: z.string().optional(),
  start_date: z.string().min(1, "Start date required"),
  end_date: z.string().optional().nullable(),
  description: z.string().optional(),
});

export type ProfileExperienceFormValues = z.infer<typeof profileExperienceFormSchema>;

export type ProfileExperience = {
  id: string;
  profile_id: string;
  company_name: string;
  title: string;
  location?: string | null;
  employment_type?: string | null;
  start_date: string;
  end_date?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
};

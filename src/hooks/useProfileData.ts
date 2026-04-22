import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, ProfileFormValues } from "@/schemas/profileSchema";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Types for details table (mirroring DB)
type ProfileDetails = {
  id: string;
  profile_id: string;
  full_name: string | null;
  username: string | null;
  current_role: string | null;
  company: string | null;
  industry: string | null;
  badge: string | null;
  referral_code: string | null;
  // Removed: linkedin, website, collab_interests, looking_for, availability, social_links, how_found
};

// Merge profile and details.
// Only assign keys that exist on UserProfile and only from where they actually exist.
function mergeProfileData(
  profile: any,
  details: Partial<ProfileDetails> | null
): UserProfile | null {
  if (!profile) return null;
  return {
    id: profile.id,
    user_id: profile.user_id,
    display_name: profile.display_name ?? "",
    // details
    full_name: details?.full_name ?? "",
    username: details?.username ?? "",
    current_role: details?.current_role ?? "",
    company: details?.company ?? "",
    industry: details?.industry ?? "",
    badge: details?.badge ?? "",
    referral_code: details?.referral_code ?? "",
    // profiles table
    profile_image_url: profile.profile_image_url ?? null,
    city: profile.city ?? null,
    country: profile.country ?? null,
    bio: profile.bio ?? null,
    key_skills: profile.key_skills ?? null,
    points: profile.points ?? 0,
    date_of_birth: profile.date_of_birth ? profile.date_of_birth : null, // new field
  };
}

export const useProfileData = (userId: string | undefined) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: dataBundle,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery<UserProfile | null>({
    queryKey: ["userProfileEdit", userId],
    queryFn: async () => {
      if (!userId) return null;
      // Fetch profile from profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, user_id, display_name, profile_image_url, city, country, bio, key_skills, points, date_of_birth")
        .eq("user_id", userId)
        .maybeSingle();
      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }
      if (!profile) return null;

      // Fetch details from profile_details table
      const { data: details, error: detailsError } = await (supabase as any)
        .from("profile_details")
        .select(`
          id, profile_id, full_name, username, "current_role", company, industry, badge, referral_code
        `)
        .eq("profile_id", profile.id)
        .maybeSingle();
      if (detailsError && detailsError.code !== "PGRST116") {
        throw detailsError;
      }

      const mappedDetails = details
        ? { ...details, current_role: details["current_role"] }
        : {};

      return mergeProfileData(profile, mappedDetails);
    },
    enabled: !!userId,
  });

  // Mutation: Update profile
  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      if (!userId) throw new Error("User not authenticated");
      if (!dataBundle) throw new Error("Profile not found to update.");

      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      if (fetchError || !profile) throw fetchError || new Error("Profile not found");

      // Only assign allowed keys for both update objects.
      const updateProfileObj: any = {
        display_name: values.full_name || "", // CHANGED: Use full_name for display_name,
        profile_image_url: values.profile_image_url === "" ? null : values.profile_image_url ?? null,
        city: values.city ?? null,
        country: values.country ?? null,
        bio: values.bio ?? null,
        key_skills: values.key_skills ?? null,
        points: values.points ?? 0,
        updated_at: new Date().toISOString(),
        date_of_birth: values.date_of_birth ? values.date_of_birth.toISOString().slice(0,10) : null,
      };
      const { error: profErr } = await supabase
        .from("profiles")
        .update(updateProfileObj)
        .eq("user_id", userId);

      if (profErr) throw profErr;

      const detailsObj: any = {
        profile_id: profile.id,
        full_name: values.full_name,
        username: values.username,
        current_role: values.current_role,
        company: values.company,
        industry: values.industry,
        badge: values.badge,
        referral_code: values.referral_code,
      };
      // Upsert by unique profile_id
      const { error: detailsErr } = await (supabase as any)
        .from("profile_details")
        .upsert(detailsObj, { onConflict: "profile_id" });
      if (detailsErr) throw detailsErr;

      return null;
    },
    onSuccess: () => {
      toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
      queryClient.invalidateQueries({ queryKey: ["userProfileEdit", userId] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Update Failed", description: (error as Error).message });
    },
  });

  // Mutation: Create new profile
  const createProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      if (!userId) throw new Error("User not authenticated");
      const insertProfileObj: any = {
        user_id: userId,
        display_name: values.full_name || "", // CHANGED: Use full_name for display_name
        profile_image_url: values.profile_image_url === "" ? null : values.profile_image_url ?? null,
        city: values.city ?? null,
        country: values.country ?? null,
        bio: values.bio ?? null,
        key_skills: values.key_skills ?? null,
        points: values.points ?? 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        date_of_birth: values.date_of_birth ? values.date_of_birth.toISOString().slice(0,10) : null,
      };
      const { data: newProf, error: profErr } = await supabase
        .from("profiles")
        .insert(insertProfileObj)
        .select("id")
        .maybeSingle();
      if (profErr) throw profErr;
      if (!newProf) throw new Error("Failed to create profile.");

      const detailsObj: any = {
        profile_id: newProf.id,
        full_name: values.full_name,
        username: values.username,
        current_role: values.current_role,
        company: values.company,
        industry: values.industry,
        badge: values.badge,
        referral_code: values.referral_code,
      };
      const { error: detailsErr } = await (supabase as any)
        .from("profile_details")
        .insert(detailsObj);
      if (detailsErr) throw detailsErr;
      return null;
    },
    onSuccess: () => {
      toast({ title: "Profile Created", description: "Your profile has been created." });
      queryClient.invalidateQueries({ queryKey: ["userProfileEdit", userId] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      navigate("/dashboard#profile-created");
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Create Failed", description: (error as Error).message });
    },
  });

  return {
    profileData: dataBundle,
    profileLoading,
    profileError,
    updateProfile: updateProfileMutation.mutate,
    createProfile: createProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending || createProfileMutation.isPending,
  };
};

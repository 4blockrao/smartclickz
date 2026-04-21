
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ReferralData {
  referralCode: string;
  direct: number;
  level2: number;
  level3: number;
  totalReferrals: number;
}

export const useReferrals = (userId?: string) => {
  const { user } = useAuth();
  const actualUserId = userId || user?.id;
  
  const [referralData, setReferralData] = useState<ReferralData>({
    referralCode: "",
    direct: 0,
    level2: 0,
    level3: 0,
    totalReferrals: 0
  });

  // Fetch user profile with referral_user_id
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["user-profile", actualUserId],
    queryFn: async () => {
      if (!actualUserId) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("referral_user_id, team_level1, team_level2, team_level3")
        .eq("user_id", actualUserId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      return data;
    },
    enabled: !!actualUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Fetch direct referrals with profile information
  const { data: myReferrals = [] } = useQuery({
    queryKey: ["my-referrals", actualUserId],
    queryFn: async () => {
      if (!actualUserId) return [];
      
      const { data, error } = await supabase
        .from("user_referrals")
        .select("user_id, referred_at")
        .eq("referrer_id", actualUserId)
        .order("referred_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching referrals:", error);
        return [];
      }
      
      // Fetch profile information for each referral
      const referralIds = data?.map(r => r.user_id) || [];
      if (referralIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, display_name, referral_user_id")
          .in("user_id", referralIds);
        
        // Merge referral data with profile data
        return data?.map(referral => {
          const profile = profiles?.find(p => p.user_id === referral.user_id);
          return {
            ...referral,
            display_name: profile?.display_name,
            referral_user_id: profile?.referral_user_id
          };
        }) || [];
      }
      
      return data || [];
    },
    enabled: !!actualUserId,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch user's own referral info (who referred them)
  const { data: myReferralInfo } = useQuery({
    queryKey: ["my-referral-info", actualUserId],
    queryFn: async () => {
      if (!actualUserId) return null;
      
      const { data, error } = await supabase
        .from("user_referrals")
        .select("referrer_id, referred_at")
        .eq("user_id", actualUserId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching referral info:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!actualUserId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (profile) {
      const direct = profile.team_level1 || 0;
      const level2 = profile.team_level2 || 0;
      const level3 = profile.team_level3 || 0;
      
      setReferralData({
        referralCode: profile.referral_user_id || "Loading...",
        direct,
        level2,
        level3,
        totalReferrals: direct + level2 + level3
      });
    } else if (!isLoading && actualUserId) {
      // Fallback if profile doesn't exist yet
      setReferralData({
        referralCode: `USR${actualUserId.slice(0, 6).toUpperCase()}`,
        direct: 0,
        level2: 0,
        level3: 0,
        totalReferrals: 0
      });
    }
  }, [profile, isLoading, actualUserId]);

  // Helper functions for backward compatibility
  const getReferralLink = () => {
    if (!referralData.referralCode || referralData.referralCode === "Loading...") {
      return `${window.location.origin}/auth?ref=loading`;
    }
    return `${window.location.origin}/auth?ref=${referralData.referralCode}`;
  };

  const myReferralCode = referralData.referralCode;
  const inviteCodeUsed = myReferralInfo?.referrer_id ? "Used" : null;
  const referredBy = myReferralInfo?.referrer_id || null;

  return {
    // New interface
    referralData,
    isLoading: isLoading && !referralData.referralCode,
    error,
    
    // Backward compatibility
    myReferralCode,
    getReferralLink,
    myReferrals,
    inviteCodeUsed,
    referredBy,
  };
};

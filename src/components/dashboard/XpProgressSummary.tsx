
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function XpProgressSummary() {
  const { user } = useAuth();
  const { data: profile } = useQuery({
    queryKey: ["dashboard-progress-summary", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("xp_level, xp_required, referrals_this_month, team_size, display_name, profile_image_url")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  if (!profile) return null;

  const xpPercent = Math.round(
    ((profile.xp_level || 0) / (profile.xp_required || 1)) * 100
  );
  return (
    <div className="bg-[#2A2A2A] p-4 rounded-xl mb-1 shadow flex flex-col gap-2 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="font-medium text-blue-200">
          Level {profile.xp_level || 1}
        </span>
        <span className="text-xs bg-[#232A4D] text-blue-200 rounded-md px-2 py-0.5">
          {xpPercent}% XP
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-[#232A4D] w-full mb-2">
        <div
          className="absolute left-0 top-0 h-2 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full"
          style={{ width: `${xpPercent}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-300">
        <span>Invite this month: <b>{profile.referrals_this_month || 0}</b></span>
        <span>Team: <b>{profile.team_size || 0}</b></span>
        <span>Profile: <b>87%</b></span>
      </div>
      <div className="text-[15px] text-green-400 pl-0.5">You’re in the Top 8% this week!</div>
    </div>
  );
}

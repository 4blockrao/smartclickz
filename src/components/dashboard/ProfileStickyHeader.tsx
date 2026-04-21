
import React from "react";
import { UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ProfileStickyHeader() {
  const { user } = useAuth();
  const { data: profile } = useQuery({
    queryKey: ["dashboard-profile-header", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("display_name, profile_image_url, rank, points, xp_level, xp_required, streak")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // If you want a shimmer/loading, add here.
  if (!profile) return <div className="h-[92px]"></div>;

  return (
    <header className="fixed top-0 left-0 w-full max-w-[400px] z-20 bg-[#232533] border-b border-[#222] flex flex-row items-center px-3 py-2 shadow-lg">
      <div className="flex items-center gap-3 flex-1">
        <div className="relative">
          {profile.profile_image_url ? (
            <img src={profile.profile_image_url} alt="" className="h-14 w-14 rounded-full border-2 border-[#3F51B5] object-cover" />
          ) : (
            <div className="h-14 w-14 bg-[#2A2A2A] flex items-center justify-center rounded-full border-2 border-[#3F51B5] text-[#3F51B5]">
              <UserCircle size={36} />
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-px">
            <span className="text-lg text-white font-bold">{profile.display_name || "User"}</span>
            {profile.rank && (
              <Badge className="text-blue-200 bg-[#232A4D] border-none rounded-lg px-2 py-0.5 text-xs uppercase">{profile.rank}</Badge>
            )}
          </div>
          <div className="text-xs text-blue-300 font-semibold bg-[#232A4D] rounded-lg px-2 mb-1 inline-block">💎 {profile.points || 0} pts</div>
          <div className="w-[110px] bg-[#1F1F2F] h-2 rounded overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#3F51B5] to-sky-400 h-2 animate-pulse"
              style={{
                width: `${Math.min(
                  100,
                  ((profile.xp_level || 0) / (profile.xp_required || 1)) * 100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center ml-2">
        <span className="text-xs font-medium text-orange-300">🔥 {profile.streak || 0}d</span>
        <Button size="icon" className="bg-[#2A2A2A] mt-2" title="Share QR">
          {/* Replace with actual QR-Share logic */}
          <span role="img" aria-label="QR" className="text-xl">🔗</span>
        </Button>
      </div>
    </header>
  );
}

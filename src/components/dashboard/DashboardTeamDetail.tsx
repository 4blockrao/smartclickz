
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { TeamTierList, ReferralUser } from "./TeamTierList";

export default function DashboardTeamDetail() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [referralTeam, setReferralTeam] = React.useState<
    { level: number; users: ReferralUser[] }[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchTeamTree() {
      setLoading(true);
      if (!user?.id) {
        setReferralTeam([]);
        setLoading(false);
        return;
      }
      // This will collect the team in levels, and merge display data
      const idsAtLevel: string[] = [user.id];
      const result: any[] = [];
      let currentLevelIds = idsAtLevel;
      for (let level = 1; level <= 4; level++) {
        // Get referrals for currentLevelIds — fetch referrers
        const { data, error } = await supabase
          .from("user_referrals")
          .select("user_id, referred_at")
          .in("referrer_id", currentLevelIds.length === 0 ? ['-1'] : currentLevelIds);

        if (error || !data) break;
        const userIds = data.map((r: any) => r.user_id);
        let profiles: any[] = [];
        if (userIds.length > 0) {
          // Also fetch phone number, name, NEW: is_verified, kyc_status, networker_type
          const { data: profs } = await supabase
            .from("profiles")
            .select("user_id, display_name, referral_user_id, phone, networker_type, is_verified, kyc_status")
            .in("user_id", userIds);
          profiles = profs ?? [];
        }

        const usersAtThisLevel: ReferralUser[] = data.map((r: any) => {
          const profile = profiles.find((p: any) => p.user_id === r.user_id);
          return {
            user_id: r.user_id,
            referred_at: r.referred_at,
            status: profile ? "activated" : "pending",
            display_name: profile?.display_name,
            referral_user_id: profile?.referral_user_id,
            phone: profile?.phone,
            networker_type: profile?.networker_type,
            is_verified: profile?.is_verified,
            kyc_status: profile?.kyc_status,
          }
        });
        if (usersAtThisLevel.length === 0) break;
        result.push({ level, users: usersAtThisLevel });
        currentLevelIds = usersAtThisLevel.map(u => u.user_id);
      }
      setReferralTeam(result);
      setLoading(false);
    }
    fetchTeamTree();
  }, [user?.id]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Button
        variant="outline"
        className="mb-4 flex items-center gap-2"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </Button>
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-2 text-primary">My Team & Referrals</h2>
        <div className="text-muted-foreground mb-4">
          <b>Grow your network!</b> See who's joined your team, their referral level, and connect with your direct downline.
        </div>
        {loading ? (
          <div className="text-muted-foreground">Loading team...</div>
        ) : (
          <TeamTierList tiers={referralTeam} />
        )}
      </Card>
    </div>
  );
}

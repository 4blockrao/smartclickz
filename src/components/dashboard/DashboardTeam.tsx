import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useReferrals } from "@/hooks/useReferrals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  UserPlus, 
  User, 
  ArrowLeft, 
  Copy, 
  Share2,
  Crown,
  Award,
  TrendingUp,
  Network
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";

export default function DashboardTeam() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fixed: Use the hook without parameters
  const { myReferralCode, getReferralLink, myReferrals } = useReferrals();

  // Fetch team stats and referral user id (AA code)
  const { data: teamStats } = useQuery({
    queryKey: ["my-team-stats", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("team_level1, team_level2, team_level3, referral_user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) return null;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch detailed team tree (levels 1-4)
  const [referralTeam, setReferralTeam] = React.useState<
    { level: number, users: Array<{ user_id: string, referred_at: string, status: "activated" | "pending", display_name?: string, referral_user_id?: string, phone?: string, networker_type?: string, is_verified?: boolean, kyc_status?: string }> }[]
  >([]);

  React.useEffect(() => {
    async function fetchTeam() {
      if (!user?.id) return;
      const idsAtLevel: string[] = [user.id];
      const result: any[] = [];
      let currentLevelIds = idsAtLevel;
      for (let level = 1; level <= 4; level++) {
        const { data, error } = await supabase
          .from("user_referrals")
          .select("user_id, referred_at")
          .in("referrer_id", currentLevelIds.length === 0 ? ['-1'] : currentLevelIds);
        if (error || !data) break;
        const userIds = data.map((r: any) => r.user_id);
        let profiles: Record<string, any> = {};
        if (userIds.length > 0) {
          const { data: profs } = await supabase
            .from("profiles")
            .select("user_id, display_name, referral_user_id, phone, networker_type, is_verified, kyc_status");
          for (const p of profs ?? []) {
            profiles[p.user_id] = p;
          }
        }
        const usersAtThisLevel = data.map((r: any) => {
          const profile = profiles[r.user_id];
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
        currentLevelIds = usersAtThisLevel.map(r => r.user_id);
      }
      setReferralTeam(result);
    }
    fetchTeam();
  }, [user?.id]);

  // Calculate stats
  const totalTeamSize = (teamStats?.team_level1 || 0) + (teamStats?.team_level2 || 0) + (teamStats?.team_level3 || 0);
  const activeMembers = referralTeam.reduce((acc, level) => acc + level.users.filter(u => u.status === "activated").length, 0);
  const pendingMembers = referralTeam.reduce((acc, level) => acc + level.users.filter(u => u.status === "pending").length, 0);

  // Copy referral link handler
  const handleCopy = () => {
    navigator.clipboard.writeText(getReferralLink());
    toast({ title: "Referral link copied to clipboard!" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <DashboardHeader userProfile={null} showBackButton />
      
      <main className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        {/* Header Section */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/dashboard')}
            className="md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              My Team & Network
            </h1>
            <p className="text-muted-foreground">Grow your network and track your team's progress</p>
          </div>
        </div>

        {/* Team Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="elevated" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Total Team</CardTitle>
                <Network className="w-6 h-6" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{totalTeamSize}</div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Network Members
              </Badge>
            </CardContent>
          </Card>

          <Card variant="elevated" className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Active</CardTitle>
                <Award className="w-6 h-6" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{activeMembers}</div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Activated Users
              </Badge>
            </CardContent>
          </Card>

          <Card variant="elevated" className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Direct Referrals</CardTitle>
                <UserPlus className="w-6 h-6" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{myReferrals?.length || 0}</div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                People Invited
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Invite Friends & Grow Your Network
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Your Referral Link
              </label>
              <div className="flex gap-2">
                <Input 
                  value={getReferralLink()} 
                  readOnly 
                  className="flex-1 font-mono text-sm"
                />
                <Button onClick={handleCopy} size="sm">
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
            
            {myReferralCode && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-primary" />
                  <span className="font-medium">Your Referral Code</span>
                </div>
                <div className="font-mono text-lg font-bold text-primary">{myReferralCode}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Level Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Team Level Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{teamStats?.team_level1 ?? 0}</div>
                <div className="text-sm text-blue-600 font-medium">Level 1 (Direct)</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{teamStats?.team_level2 ?? 0}</div>
                <div className="text-sm text-green-600 font-medium">Level 2</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">{teamStats?.team_level3 ?? 0}</div>
                <div className="text-sm text-purple-600 font-medium">Level 3</div>
              </div>
            </div>

            {/* Team Progress */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Network Activation Rate</span>
                  <span>{totalTeamSize > 0 ? Math.round((activeMembers / totalTeamSize) * 100) : 0}%</span>
                </div>
                <Progress value={totalTeamSize > 0 ? (activeMembers / totalTeamSize) * 100 : 0} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Team Tree */}
        {referralTeam.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Team Members by Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {referralTeam.map(levelObj => (
                  <div key={levelObj.level} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">
                        Level {levelObj.level}
                      </h3>
                      <Badge variant="outline">
                        {levelObj.users.length} member{levelObj.users.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {levelObj.users.map(member => (
                        <div key={member.user_id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {member.display_name || `User ${member.user_id.slice(0, 8)}...`}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Joined {new Date(member.referred_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Badge 
                            variant={member.status === "activated" ? "default" : "secondary"}
                            className={member.status === "activated" ? "bg-green-100 text-green-700 border-green-300" : ""}
                          >
                            {member.status === "activated" ? "Active" : "Pending"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Your Referral ID */}
        {teamStats?.referral_user_id && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Your Network ID
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 border rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Your unique network identifier</div>
                <div className="font-mono text-lg font-bold">{teamStats.referral_user_id}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back to Dashboard */}
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")}
            className="min-w-[200px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}

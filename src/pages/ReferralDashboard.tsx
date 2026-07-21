
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useReferrals } from '@/hooks/useReferrals';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedReferralStats from '@/components/referrals/EnhancedReferralStats';
import ReferralPlan from '@/components/referrals/ReferralPlan';
import { TeamTierList } from '@/components/dashboard/TeamTierList';
import { Users, TrendingUp, Crown, Target, DollarSign } from 'lucide-react';

const ReferralDashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { referralData, myReferrals } = useReferrals();

  // Enhanced referral stats
  const { data: enhancedStats } = useQuery({
    queryKey: ['enhanced-referral-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Mock enhanced stats - in real app, this would fetch from multiple tables
      return {
        directReferrals: referralData.direct || 5,
        tier2Referrals: referralData.level2 || 12,
        tier3Referrals: referralData.level3 || 38,
        totalCommissions: 5420,
        thisMonthCommissions: 850,
        balancedVolume: 28500,
        currentRank: 'Gold',
        nextRank: 'Platinum',
        rankProgress: 65,
        monthlyRoyalty: 850,
        referralCode: userProfile?.referral_user_id || 'AA12345',
        referralLink: `${window.location.origin}/auth?ref=${userProfile?.referral_user_id || 'AA12345'}`,
        activeReferrals: referralData.direct || 5,
        pendingReferrals: 3,
        conversionRate: 78,
        averageTeamVolume: 2500
      };
    },
    enabled: !!user
  });

  // Fetch detailed team data for team tier list
  const { data: teamTiers = [] } = useQuery({
    queryKey: ['team-tiers', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Simplified team fetch - in real app would be more complex
      const result = [];
      let currentLevelIds = [user.id];
      
      for (let level = 1; level <= 3; level++) {
        if (currentLevelIds.length === 0) break;
        
        const { data, error } = await supabase
          .from("user_referrals")
          .select("user_id, referred_at")
          .in("referrer_id", currentLevelIds);

        if (error || !data) break;
        
        const userIds = data.map(r => r.user_id);
        let profiles = {};
        
        if (userIds.length > 0) {
          const { data: profs } = await supabase
            .from("profiles")
            .select("user_id, display_name, referral_user_id, phone, networker_type, is_verified, kyc_status")
            .in("user_id", userIds);
          
          for (const p of profs || []) {
            profiles[p.user_id] = p;
          }
        }

        const usersAtThisLevel = data.map(r => {
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
          };
        });

        if (usersAtThisLevel.length === 0) break;
        result.push({ level, users: usersAtThisLevel });
        currentLevelIds = usersAtThisLevel.map(u => u.user_id);
      }
      
      return result;
    },
    enabled: !!user?.id,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="text-center py-12 px-8">
            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
            <p className="text-slate-300 mb-6">
              Please log in to access your referral dashboard
            </p>
            <button 
              onClick={() => window.location.href = '/auth'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Log In
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Referral Dashboard
          </h1>
          <p className="text-xl text-slate-300">
            Build your network, earn commissions, and advance your rank
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto bg-slate-800/50 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-blue-600">
              <Users className="w-4 h-4 mr-2" />
              My Team
            </TabsTrigger>
            <TabsTrigger value="plan" className="data-[state=active]:bg-blue-600">
              <Crown className="w-4 h-4 mr-2" />
              Referral Plan
            </TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-blue-600">
              <DollarSign className="w-4 h-4 mr-2" />
              Earnings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {enhancedStats && (
              <EnhancedReferralStats stats={enhancedStats} />
            )}
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="w-6 h-6 text-blue-400" />
                  Team Structure & Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TeamTierList tiers={teamTiers} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plan" className="space-y-6">
            {enhancedStats && (
              <ReferralPlan
                currentLevel={2} // This would be calculated based on user's achievements
                directReferrals={enhancedStats.directReferrals}
                teamVolume={enhancedStats.balancedVolume}
                monthlyCommissions={enhancedStats.thisMonthCommissions}
              />
            )}
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <DollarSign className="w-6 h-6 text-green-400" />
                  Earnings History & Projections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Detailed Earnings Analytics
                  </h3>
                  <p className="text-slate-300">
                    Advanced earnings tracking and projections coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReferralDashboard;

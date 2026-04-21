
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  TrendingUp, 
  UserPlus, 
  Award,
  Target,
  Crown,
  Star,
  ArrowRight,
  Share2
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const TeamSnapshot = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: teamData, isLoading } = useQuery({
    queryKey: ["team-snapshot", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const [profileRes, referralsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("user_referrals").select("*").eq("referrer_id", user.id).limit(5)
      ]);

      return {
        profile: profileRes.data,
        referrals: referralsRes.data || []
      };
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 animate-pulse">
        <CardContent className="p-6">
          <div className="h-6 bg-white/20 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-white/20 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const profile = teamData?.profile;
  const totalTeam = (profile?.team_level1 || 0) + (profile?.team_level2 || 0) + (profile?.team_level3 || 0);

  const teamStats = [
    {
      label: "Direct Referrals",
      value: profile?.team_level1 || 0,
      color: "from-green-500 to-emerald-500",
      icon: UserPlus
    },
    {
      label: "Level 2 Team",
      value: profile?.team_level2 || 0,
      color: "from-blue-500 to-purple-500",
      icon: Users
    },
    {
      label: "Level 3 Team",
      value: profile?.team_level3 || 0,
      color: "from-purple-500 to-pink-500",
      icon: Crown
    },
    {
      label: "Total Network",
      value: totalTeam,
      color: "from-orange-500 to-red-500",
      icon: Award
    }
  ];

  const monthlyGoal = 50;
  const currentProgress = (totalTeam / monthlyGoal) * 100;

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Team Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {teamStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-slate-300">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Monthly Goal */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Monthly Team Goal</span>
              <Badge className="bg-purple-500 text-white">
                {totalTeam}/{monthlyGoal}
              </Badge>
            </div>
            <Progress value={currentProgress} className="h-2 bg-white/20 mb-2" />
            <p className="text-slate-300 text-sm">
              {currentProgress >= 100 
                ? "🎉 Goal achieved! You're crushing it!" 
                : `${Math.round(currentProgress)}% complete - ${monthlyGoal - totalTeam} more to go!`
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Team Activity */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Recent Team Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teamData?.referrals && teamData.referrals.length > 0 ? (
            <div className="space-y-3">
              {teamData.referrals.map((referral, index) => (
                <motion.div
                  key={referral.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Avatar className="h-10 w-10 border-2 border-purple-500/30">
                    <AvatarFallback className="bg-purple-500 text-white">
                      N{index + 1}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-white font-medium">New team member joined</p>
                    <p className="text-slate-400 text-sm">
                      {new Date(referral.referred_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    +100 pts
                  </Badge>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Build Your Team</h3>
              <p className="text-slate-400 text-sm mb-4">
                Start inviting friends and family to grow your network
              </p>
              <Button 
                onClick={() => navigate("/dashboard/team")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Invite Now
              </Button>
            </div>
          )}

          <Button 
            variant="outline" 
            className="w-full mt-4 border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
            onClick={() => navigate("/dashboard/team")}
          >
            View Full Team <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamSnapshot;

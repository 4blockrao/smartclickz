
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Users, 
  Award, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

const DashboardStatsGrid = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const [profileRes, statsRes, pointsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("user_stats").select("*").eq("user_id", user.id).single(),
        supabase.from("points_ledger").select("amount, created_at").eq("user_id", user.id).gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      const weeklyPoints = pointsRes.data?.reduce((sum, entry) => sum + entry.amount, 0) || 0;
      
      return {
        profile: profileRes.data,
        userStats: statsRes.data,
        weeklyPoints,
        totalPoints: profileRes.data?.points || 0
      };
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="bg-white/10 backdrop-blur-lg border-white/20 animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-white/20 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-white/20 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Earnings",
      value: `$${stats?.userStats?.total_earnings?.toFixed(2) || "0.00"}`,
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      description: "This month"
    },
    {
      title: "Active Points",
      value: stats?.totalPoints?.toLocaleString() || "0",
      change: `+${stats?.weeklyPoints || 0}`,
      changeType: "positive",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      description: "This week"
    },
    {
      title: "Success Rate",
      value: `${stats?.userStats?.success_rate?.toFixed(1) || 0}%`,
      change: "+2.1%",
      changeType: "positive",
      icon: TrendingUp,
      color: "from-blue-500 to-purple-500",
      description: "All time"
    },
    {
      title: "Tasks Completed",
      value: stats?.userStats?.total_tasks_completed?.toString() || "0",
      change: "+5",
      changeType: "positive",
      icon: Target,
      color: "from-purple-500 to-pink-500",
      description: "This week"
    },
    {
      title: "Team Members",
      value: ((stats?.profile?.team_level1 || 0) + (stats?.profile?.team_level2 || 0) + (stats?.profile?.team_level3 || 0)).toString(),
      change: "+3",
      changeType: "positive",
      icon: Users,
      color: "from-pink-500 to-rose-500",
      description: "Total team"
    },
    {
      title: "Current Streak",
      value: `${stats?.userStats?.current_streak || 0} days`,
      change: "Active",
      changeType: "neutral",
      icon: Award,
      color: "from-indigo-500 to-blue-500",
      description: "Keep it up!"
    },
    {
      title: "Level Progress",
      value: `Level ${stats?.userStats?.level || 1}`,
      change: "65%",
      changeType: "positive",
      icon: Activity,
      color: "from-cyan-500 to-teal-500",
      description: "To next level",
      progress: 65
    },
    {
      title: "Monthly Goal",
      value: "78%",
      change: "+15%",
      changeType: "positive",
      icon: Target,
      color: "from-violet-500 to-purple-500",
      description: "On track",
      progress: 78
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} shadow-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {card.changeType === "positive" ? (
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                  ) : card.changeType === "negative" ? (
                    <ArrowDownRight className="w-4 h-4 text-red-400" />
                  ) : null}
                  <span className={`font-medium ${
                    card.changeType === "positive" ? "text-green-400" : 
                    card.changeType === "negative" ? "text-red-400" : "text-slate-400"
                  }`}>
                    {card.change}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-slate-300 text-sm">{card.title}</h3>
                <p className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors">
                  {card.value}
                </p>
                <p className="text-xs text-slate-400">{card.description}</p>
                
                {card.progress && (
                  <div className="pt-2">
                    <Progress value={card.progress} className="h-2 bg-white/20" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStatsGrid;

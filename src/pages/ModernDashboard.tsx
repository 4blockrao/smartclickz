
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Target, 
  Award, 
  Zap, 
  DollarSign,
  Activity,
  Sparkles,
  Star,
  Trophy
} from "lucide-react";
import { motion } from "framer-motion";
import DashboardStatsGrid from "@/components/dashboard/DashboardStatsGrid";
import QuickActionGrid from "@/components/dashboard/QuickActionGrid";
import DashboardEarningSummary from "@/components/dashboard/DashboardEarningSummary";
import DashboardPackagePerformance from "@/components/dashboard/DashboardPackagePerformance";
import { usePointsWallet } from "@/hooks/usePointsWallet";

const ModernDashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { pointsBalance } = usePointsWallet(user?.id);

  // Fetch comprehensive dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["modern-dashboard", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const [profileRes, statsRes, tasksRes, pointsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("user_stats").select("*").eq("user_id", user.id).single(),
        supabase.from("tasks").select("*").eq("is_active", true).limit(5),
        supabase.from("points_ledger").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10)
      ]);

      return {
        profile: profileRes.data,
        stats: statsRes.data,
        activeTasks: tasksRes.data || [],
        recentPoints: pointsRes.data || []
      };
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <motion.div 
          className="text-center space-y-4 w-full max-w-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mx-auto w-16 h-16">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Loading Dashboard</h3>
          <p className="text-slate-400 text-sm">Preparing your workspace...</p>
        </motion.div>
      </div>
    );
  }

  const profile = dashboardData?.profile || userProfile;
  const stats = dashboardData?.stats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative px-4 sm:px-6 py-6 sm:py-8">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  Welcome back, {profile?.display_name?.split(' ')[0] || "Networker"}! 
                </h1>
                <motion.div
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-xl sm:text-2xl"
                >
                  👋
                </motion.div>
              </div>
              <p className="text-slate-300 text-sm sm:text-base mb-4">
                Your network is your net worth. Let's grow it together!
              </p>
              
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 px-3 py-1.5 text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Level {stats?.level || 1}
                </Badge>
                <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 px-3 py-1.5 text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  {pointsBalance || 0} Points
                </Badge>
                <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0 px-3 py-1.5 text-xs">
                  <Trophy className="w-3 h-3 mr-1" />
                  {stats?.current_streak || 0} Day Streak
                </Badge>
              </div>
            </div>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { 
                  label: "Today's Earnings", 
                  value: "$24.50", 
                  icon: DollarSign, 
                  color: "from-green-500 to-emerald-500",
                  change: "+12%"
                },
                { 
                  label: "Active Tasks", 
                  value: dashboardData?.activeTasks?.length || 0, 
                  icon: Target, 
                  color: "from-blue-500 to-purple-500",
                  change: "3 new"
                },
                { 
                  label: "Team Members", 
                  value: (profile?.team_level1 || 0) + (profile?.team_level2 || 0), 
                  icon: Users, 
                  color: "from-purple-500 to-pink-500",
                  change: "+2 this week"
                },
                { 
                  label: "Success Rate", 
                  value: `${stats?.success_rate || 95}%`, 
                  icon: TrendingUp, 
                  color: "from-orange-500 to-red-500",
                  change: "+5%"
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                          <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <span className="text-xs text-green-400">{stat.change}</span>
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-xs text-slate-300 leading-tight">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content - Removed Tabs */}
      <div className="px-4 sm:px-6 pb-8 sm:pb-12 space-y-6">
        {/* Enhanced Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <DashboardStatsGrid />
        </motion.div>
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Actions */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <QuickActionGrid />
            
            {/* Earnings and Package Performance */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <DashboardEarningSummary />
              <DashboardPackagePerformance />
            </div>
          </motion.div>
          
          {/* Right Column - Activity Feed & Recent Activity */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Recent Activity */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData?.recentPoints?.slice(0, 5).map((entry, index) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        entry.type === 'reward' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {entry.type === 'reward' ? <Award className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">
                          {entry.note || entry.event_code}
                        </div>
                        <div className="text-slate-400 text-xs">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className={`font-bold text-sm ${
                      entry.type === 'reward' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {entry.type === 'reward' ? '+' : '-'}{entry.amount}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Tasks */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Quick Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData?.activeTasks?.slice(0, 3).map((task, index) => (
                  <div key={task.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium text-sm">{task.title}</h4>
                      <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                        +{task.payout_points}
                      </Badge>
                    </div>
                    <p className="text-slate-300 text-xs mb-2 line-clamp-2">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-xs capitalize">{task.type}</span>
                      <button className="text-xs text-blue-400 hover:text-blue-300">
                        Start Task →
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;

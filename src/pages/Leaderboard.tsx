
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp,
  Crown,
  Star,
  Filter,
  Calendar,
  Users,
  Target,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

const Leaderboard: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [category, setCategory] = useState("overall");

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ["leaderboard", timeFrame, category],
    queryFn: async () => {
      // Mock data for now - replace with actual Supabase queries
      return {
        topPerformers: [
          {
            rank: 1,
            name: "Sarah Chen",
            avatar: "/api/placeholder/50/50",
            points: 28450,
            tasks: 287,
            earnings: 1420.50,
            badge: "Elite Master",
            streak: 45,
            level: 12
          },
          {
            rank: 2,
            name: "Mike Rodriguez",
            avatar: "/api/placeholder/50/50",
            points: 26890,
            tasks: 268,
            earnings: 1344.50,
            badge: "Pro Champion",
            streak: 38,
            level: 11
          },
          {
            rank: 3,
            name: "Emma Thompson",
            avatar: "/api/placeholder/50/50",
            points: 24750,
            tasks: 245,
            earnings: 1237.50,
            badge: "Expert Leader",
            streak: 32,
            level: 10
          },
          // Add more performers...
          ...Array.from({ length: 47 }, (_, i) => ({
            rank: i + 4,
            name: `User ${i + 4}`,
            avatar: "/api/placeholder/50/50",
            points: 24000 - (i * 200),
            tasks: 240 - (i * 5),
            earnings: 1200 - (i * 25),
            badge: i < 20 ? "Advanced" : "Rising Star",
            streak: 30 - i,
            level: Math.max(1, 10 - Math.floor(i / 5))
          }))
        ]
      };
    },
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return <span className="font-bold text-white text-lg">#{rank}</span>;
    }
  };

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30";
      case 2:
        return "from-gray-400/20 to-gray-600/20 border-gray-400/30";
      case 3:
        return "from-orange-500/20 to-red-500/20 border-orange-500/30";
      default:
        return "from-purple-500/10 to-blue-500/10 border-purple-500/20";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <h3 className="text-xl font-semibold text-white">Loading Leaderboard</h3>
          <p className="text-slate-400">Fetching top performers...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative px-4 sm:px-6 py-8 sm:py-12">
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-10 h-10 text-yellow-400" />
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Global Leaderboard
              </h1>
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Compete with top earners worldwide and climb the ranks
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { label: "Total Competitors", value: "2.5M+", icon: Users },
                { label: "Active This Month", value: "847K", icon: Calendar },
                { label: "Tasks Completed", value: "15.2M", icon: Target },
                { label: "Total Rewards", value: "$2.8M", icon: Zap }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
                >
                  <stat.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-slate-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Filters */}
          <div className="mb-8">
            <Tabs value={timeFrame} onValueChange={setTimeFrame} className="mb-4">
              <TabsList className="grid grid-cols-4 bg-white/10 backdrop-blur-lg border-white/20">
                <TabsTrigger value="daily" className="data-[state=active]:bg-purple-600">Daily</TabsTrigger>
                <TabsTrigger value="weekly" className="data-[state=active]:bg-purple-600">Weekly</TabsTrigger>
                <TabsTrigger value="monthly" className="data-[state=active]:bg-purple-600">Monthly</TabsTrigger>
                <TabsTrigger value="alltime" className="data-[state=active]:bg-purple-600">All Time</TabsTrigger>
              </TabsList>
            </Tabs>

            <Tabs value={category} onValueChange={setCategory}>
              <TabsList className="grid grid-cols-5 bg-white/10 backdrop-blur-lg border-white/20">
                <TabsTrigger value="overall" className="data-[state=active]:bg-purple-600">Overall</TabsTrigger>
                <TabsTrigger value="tasks" className="data-[state=active]:bg-purple-600">Tasks</TabsTrigger>
                <TabsTrigger value="earnings" className="data-[state=active]:bg-purple-600">Earnings</TabsTrigger>
                <TabsTrigger value="streak" className="data-[state=active]:bg-purple-600">Streak</TabsTrigger>
                <TabsTrigger value="referrals" className="data-[state=active]:bg-purple-600">Referrals</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Top 3 Podium */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">🏆 Hall of Fame</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {leaderboardData?.topPerformers.slice(0, 3).map((performer, index) => (
                <motion.div
                  key={performer.rank}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={`relative ${index === 0 ? 'md:order-2 md:-mt-6' : index === 1 ? 'md:order-1' : 'md:order-3'}`}
                >
                  <Card className={`bg-gradient-to-br ${getRankGradient(performer.rank)} backdrop-blur-lg border-2`}>
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center mb-4">
                        {getRankIcon(performer.rank)}
                      </div>
                      
                      <Avatar className="h-20 w-20 mx-auto mb-4 border-4 border-white/30">
                        <AvatarImage src={performer.avatar} />
                        <AvatarFallback className="bg-purple-500 text-white text-lg">
                          {performer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <h3 className="font-bold text-white text-lg mb-2">{performer.name}</h3>
                      <Badge className="bg-purple-500/20 text-purple-300 mb-3">
                        {performer.badge}
                      </Badge>
                      
                      <div className="space-y-2 text-sm">
                        <div className="text-white font-semibold">{performer.points.toLocaleString()} pts</div>
                        <div className="text-slate-300">{performer.tasks} tasks</div>
                        <div className="text-green-400">${performer.earnings.toFixed(2)}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Full Rankings */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Full Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboardData?.topPerformers.map((performer, index) => (
                  <motion.div
                    key={performer.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                      performer.rank <= 3 
                        ? `bg-gradient-to-r ${getRankGradient(performer.rank)} border border-white/20` 
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
                      {performer.rank <= 3 ? getRankIcon(performer.rank) : (
                        <span className="font-bold text-white">#{performer.rank}</span>
                      )}
                    </div>
                    
                    <Avatar className="h-12 w-12 border-2 border-white/30">
                      <AvatarImage src={performer.avatar} />
                      <AvatarFallback className="bg-purple-500 text-white">
                        {performer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{performer.name}</h4>
                        <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                          {performer.badge}
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-300 text-xs">
                          Lv.{performer.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>{performer.points.toLocaleString()} pts</span>
                        <span>{performer.tasks} tasks</span>
                        <span className="text-green-400">${performer.earnings.toFixed(2)}</span>
                        <span>{performer.streak} day streak</span>
                      </div>
                    </div>
                    
                    {performer.rank <= 10 && (
                      <Star className="w-5 h-5 text-yellow-400" />
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

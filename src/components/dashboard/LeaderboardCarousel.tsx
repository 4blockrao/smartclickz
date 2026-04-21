
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp,
  Crown,
  Star,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const LeaderboardCarousel = () => {
  const topPerformers = [
    {
      rank: 1,
      name: "Sarah Chen",
      avatar: "/api/placeholder/40/40",
      points: 15420,
      tasks: 142,
      badge: "Elite"
    },
    {
      rank: 2,
      name: "Mike Rodriguez",
      avatar: "/api/placeholder/40/40",
      points: 14890,
      tasks: 138,
      badge: "Pro"
    },
    {
      rank: 3,
      name: "Emma Thompson",
      avatar: "/api/placeholder/40/40",
      points: 13750,
      tasks: 125,
      badge: "Expert"
    },
    {
      rank: 4,
      name: "David Kim",
      avatar: "/api/placeholder/40/40",
      points: 12980,
      tasks: 118,
      badge: "Advanced"
    },
    {
      rank: 5,
      name: "Lisa Wang",
      avatar: "/api/placeholder/40/40",
      points: 11640,
      tasks: 105,
      badge: "Rising"
    }
  ];

  const yourStats = {
    rank: 23,
    points: 8450,
    tasksCompleted: 76,
    weeklyGrowth: "+12%"
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-400" />;
      default:
        return <span className="font-bold text-white">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-500 to-orange-500";
      case 2:
        return "from-gray-400 to-gray-600";
      case 3:
        return "from-orange-500 to-red-500";
      default:
        return "from-blue-500 to-purple-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Performers */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Top Performers This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPerformers.map((performer, index) => (
              <motion.div
                key={performer.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                  performer.rank <= 3 
                    ? "bg-gradient-to-r from-white/10 to-white/5 border border-white/20" 
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r ${getRankColor(performer.rank)} shadow-lg`}>
                  {getRankIcon(performer.rank)}
                </div>
                
                <Avatar className="h-10 w-10 border-2 border-white/30">
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
                  </div>
                  <p className="text-slate-400 text-sm">
                    {performer.tasks} tasks • {performer.points.toLocaleString()} points
                  </p>
                </div>
                
                {performer.rank <= 3 && (
                  <Star className="w-5 h-5 text-yellow-400" />
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Your Performance */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Your Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-white">#{yourStats.rank}</div>
              <div className="text-slate-400 text-sm">Current Rank</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-2xl font-bold text-white">{yourStats.points.toLocaleString()}</div>
              <div className="text-slate-400 text-sm">Total Points</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-4">
            <div>
              <div className="text-white font-semibold">Weekly Growth</div>
              <div className="text-green-400 text-sm">Keep up the momentum!</div>
            </div>
            <div className="text-2xl font-bold text-green-400">{yourStats.weeklyGrowth}</div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
          >
            View Full Leaderboard <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardCarousel;

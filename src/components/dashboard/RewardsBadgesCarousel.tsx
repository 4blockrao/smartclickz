
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Crown,
  Gift,
  Medal,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const RewardsBadgesCarousel = () => {
  const achievements = [
    {
      title: "First Steps",
      description: "Complete your first task",
      icon: Target,
      color: "from-green-500 to-emerald-500",
      earned: true,
      points: 100
    },
    {
      title: "Social Butterfly",
      description: "Complete 10 social media tasks",
      icon: Star,
      color: "from-blue-500 to-purple-500",
      earned: true,
      points: 500
    },
    {
      title: "Team Builder",
      description: "Refer 5 active members",
      icon: Crown,
      color: "from-purple-500 to-pink-500",
      earned: false,
      points: 1000,
      progress: 60
    },
    {
      title: "Consistency King",
      description: "Maintain 30-day streak",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      earned: false,
      points: 2000,
      progress: 23
    }
  ];

  const dailyRewards = [
    { day: "Day 1", reward: "10 Points", claimed: true },
    { day: "Day 2", reward: "15 Points", claimed: true },
    { day: "Day 3", reward: "25 Points", claimed: true },
    { day: "Day 4", reward: "50 Points", claimed: false, current: true },
    { day: "Day 5", reward: "100 Points", claimed: false },
    { day: "Day 6", reward: "150 Points", claimed: false },
    { day: "Day 7", reward: "500 Points", claimed: false }
  ];

  return (
    <div className="space-y-6">
      {/* Achievements */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  achievement.earned 
                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30" 
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${achievement.color} shadow-lg`}>
                    <achievement.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{achievement.title}</h4>
                    <p className="text-slate-400 text-sm mb-2">{achievement.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge className={`${achievement.earned ? "bg-green-500" : "bg-slate-600"} text-white`}>
                        {achievement.points} pts
                      </Badge>
                      {achievement.earned ? (
                        <Badge className="bg-green-100 text-green-800">
                          <Medal className="w-3 h-3 mr-1" />
                          Earned
                        </Badge>
                      ) : (
                        <span className="text-slate-400 text-sm">
                          {achievement.progress && `${achievement.progress}% complete`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Rewards */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-400" />
            Daily Login Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {dailyRewards.map((reward, index) => (
              <motion.div
                key={reward.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-3 rounded-lg text-center transition-all duration-300 ${
                  reward.claimed 
                    ? "bg-green-500/20 border border-green-500/30" 
                    : reward.current
                    ? "bg-purple-500/20 border border-purple-500/50 ring-2 ring-purple-500/30"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                <div className="text-xs text-slate-400 mb-1">{reward.day}</div>
                <div className="text-sm font-semibold text-white mb-1">{reward.reward}</div>
                {reward.claimed ? (
                  <div className="text-green-400 text-xs">✓ Claimed</div>
                ) : reward.current ? (
                  <Button size="sm" className="text-xs h-6 bg-purple-600 hover:bg-purple-700">
                    Claim
                  </Button>
                ) : (
                  <div className="text-slate-500 text-xs">Locked</div>
                )}
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-slate-400 text-sm mb-2">
              Login daily to unlock bigger rewards!
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
            >
              View All Rewards <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsBadgesCarousel;

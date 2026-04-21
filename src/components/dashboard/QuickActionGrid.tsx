
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Users, 
  MessageSquare, 
  Award, 
  Briefcase, 
  TrendingUp,
  Plus,
  ArrowRight,
  Zap,
  Star,
  Calendar,
  Gift
} from "lucide-react";
import { motion } from "framer-motion";

const QuickActionGrid = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Browse Tasks",
      description: "Discover new earning opportunities",
      icon: Target,
      color: "from-blue-500 to-purple-500",
      action: () => navigate("/dashboard/tasks"),
      badge: "15 Available",
      badgeColor: "bg-blue-500"
    },
    {
      title: "Team Management",
      description: "Manage your growing network",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      action: () => navigate("/dashboard/team"),
      badge: "12 Members",
      badgeColor: "bg-purple-500"
    },
    {
      title: "Opportunities",
      description: "Browse campaign opportunities",
      icon: Briefcase,
      color: "from-orange-500 to-red-500",
      action: () => navigate("/campaigns"),
      badge: "8 Active",
      badgeColor: "bg-orange-500"
    },
    {
      title: "Rewards Center",
      description: "Claim your achievements",
      icon: Award,
      color: "from-yellow-500 to-orange-500",
      action: () => navigate("/dashboard/points"),
      badge: "2 Pending",
      badgeColor: "bg-yellow-500"
    },
    {
      title: "Performance",
      description: "Track your success metrics",
      icon: TrendingUp,
      color: "from-indigo-500 to-blue-500",
      action: () => navigate("/dashboard"),
      badge: "85% Rate",
      badgeColor: "bg-indigo-500"
    }
  ];

  const recentActivity = [
    { action: "Completed task", detail: "Social Media Follow", points: "+50", time: "2 hours ago" },
    { action: "Team bonus", detail: "New referral joined", points: "+100", time: "5 hours ago" },
    { action: "Achievement unlocked", detail: "First Week Complete", points: "+250", time: "1 day ago" },
    { action: "Task approved", detail: "Product Review", points: "+75", time: "2 days ago" }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                  onClick={action.action}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} shadow-lg`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <Badge className={`${action.badgeColor} text-white text-xs px-2 py-1`}>
                        {action.badge}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-white mb-1 group-hover:text-purple-200 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-slate-400 text-sm mb-3">{action.description}</p>
                    <div className="flex items-center text-purple-400 text-sm group-hover:text-purple-300 transition-colors">
                      <span>Get started</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-slate-400 text-sm">{activity.detail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">{activity.points}</p>
                  <p className="text-slate-500 text-xs">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4 border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
          >
            View All Activity
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActionGrid;

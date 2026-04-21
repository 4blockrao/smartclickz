
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Target,
  Calendar,
  TrendingUp,
  Award,
  Plus,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const DashboardActivitySection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: activityData, isLoading } = useQuery({
    queryKey: ["dashboard-activity", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const [tasksRes, submissionsRes, pointsRes] = await Promise.all([
        supabase.from("tasks").select("*").eq("is_active", true).limit(6),
        supabase.from("task_submissions").select("*, tasks(title)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("points_ledger").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5)
      ]);

      return {
        availableTasks: tasksRes.data || [],
        submissions: submissionsRes.data || [],
        recentPoints: pointsRes.data || []
      };
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="bg-white/10 backdrop-blur-lg border-white/20 animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-white/20 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-16 bg-white/20 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Available Tasks */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            Available Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activityData?.availableTasks && activityData.availableTasks.length > 0 ? (
            <div className="space-y-4">
              {activityData.availableTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 group cursor-pointer"
                  onClick={() => navigate(`/dashboard/tasks`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white group-hover:text-purple-200 transition-colors">
                      {task.title}
                    </h4>
                    <Badge className="bg-green-500 text-white">
                      +{task.payout_points} pts
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {task.type} • {task.proof_type}
                    </span>
                    <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
              
              <Button 
                onClick={() => navigate("/dashboard/tasks")}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                View All Tasks
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No Tasks Available</h3>
              <p className="text-slate-400 text-sm mb-4">
                Check back later for new earning opportunities
              </p>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
              >
                Refresh
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Task Submissions */}
            {activityData?.submissions && activityData.submissions.length > 0 && (
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  Task Submissions
                </h4>
                <div className="space-y-3">
                  {activityData.submissions.slice(0, 3).map((submission, index) => (
                    <motion.div
                      key={submission.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1 rounded-full ${getStatusColor(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {(submission as any).tasks?.title || "Task Submission"}
                          </p>
                          <p className="text-slate-400 text-xs">
                            {new Date(submission.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        className={`${getStatusColor(submission.status)} text-white text-xs`}
                      >
                        {submission.status}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Points */}
            {activityData?.recentPoints && activityData.recentPoints.length > 0 && (
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  Points History
                </h4>
                <div className="space-y-3">
                  {activityData.recentPoints.slice(0, 3).map((point, index) => (
                    <motion.div
                      key={point.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                    >
                      <div>
                        <p className="text-white font-medium text-sm">
                          {point.note || point.event_code}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {new Date(point.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`font-semibold ${
                        point.amount > 0 ? "text-green-400" : "text-red-400"
                      }`}>
                        {point.amount > 0 ? "+" : ""}{point.amount}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {(!activityData?.submissions?.length && !activityData?.recentPoints?.length) && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">No Recent Activity</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Start completing tasks to see your activity here
                </p>
                <Button 
                  onClick={() => navigate("/dashboard/tasks")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardActivitySection;

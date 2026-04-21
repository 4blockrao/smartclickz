
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { 
  Target, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Trophy,
  AlertCircle,
  BarChart3,
  Gift,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DashboardHeader from "./DashboardHeader";

export default function DashboardTasks() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch all tasks
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ["dashboard-tasks-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, payout_points")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch user's completed tasks
  const { data: completedTaskCompletions, isLoading: isLoadingCompletions } = useQuery({
    queryKey: ["dashboard-completed-tasks", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_task_completions")
        .select("task_id")
        .eq("user_id", user.id);
      if (error) throw error;
      return data?.map(x => x.task_id) || [];
    },
    enabled: !!user,
  });

  // Partition tasks
  const completedTaskIds = new Set(completedTaskCompletions || []);
  const openTasks = (tasks || []).filter(t => !completedTaskIds.has(t.id));
  const completedTasks = (tasks || []).filter(t => completedTaskIds.has(t.id));

  // Progress Calculations
  const openCount = openTasks.length;
  const completedCount = completedTasks.length;
  const totalTasks = (tasks || []).length;
  const totalPointsPossible = (tasks || []).reduce((acc, t) => acc + (t.payout_points || 0), 0);
  const pointsEarned = completedTasks.reduce((acc, t) => acc + (t.payout_points || 0), 0);
  const completionPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  if (isLoadingTasks || (user && isLoadingCompletions)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <DashboardHeader userProfile={null} showBackButton />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading your tasks...</p>
          </div>
        </div>
      </div>
    );
  }

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
              <Target className="w-8 h-8 text-orange-500" />
              My Tasks
            </h1>
            <p className="text-muted-foreground">Complete tasks to earn points and grow your network</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="elevated" className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Completed</CardTitle>
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{completedCount}</div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Tasks Done
              </Badge>
            </CardContent>
          </Card>

          <Card variant="elevated" className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Open Tasks</CardTitle>
                <Clock className="w-6 h-6" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{openCount}</div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Available
              </Badge>
            </CardContent>
          </Card>

          <Card variant="elevated" className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Points Earned</CardTitle>
                <Trophy className="w-6 h-6" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{pointsEarned}</div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                of {totalPointsPossible} total
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Progress Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Task Completion Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(completionPercentage)}%</span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600">{completedCount}</div>
                <div className="text-sm text-muted-foreground">Tasks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{openCount}</div>
                <div className="text-sm text-muted-foreground">Tasks Remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Open Tasks Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Available Tasks
              </CardTitle>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {openCount} open
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {openTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold mb-2">All tasks completed!</h3>
                <p>Great job! You've finished all available tasks.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {openTasks.map((task) => (
                  <Card key={task.id} variant="interactive" className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                            <Target className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{task.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Trophy className="w-4 h-4" />
                              <span>+{task.payout_points} points</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" asChild>
                          <Link to={`/tasks/${task.id}`}>
                            Start <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Tasks Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Completed Tasks
              </CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {completedCount} done
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {completedTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold mb-2">No tasks completed yet</h3>
                <p>Start with the available tasks above to earn your first points!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <Card key={task.id} className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-green-800">{task.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <Trophy className="w-4 h-4" />
                              <span>+{task.payout_points} points earned</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="default" className="bg-green-600">
                          Completed
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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

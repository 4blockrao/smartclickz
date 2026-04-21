
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target, CheckCircle2, Clock } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  payout_points: number;
  type: string;
  is_active: boolean;
}

interface TaskCompletion {
  task_id: string;
  status: string;
  completed_at: string;
}

export default function DashboardTasks() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: tasks = [], isLoading: loadingTasks } = useQuery({
    queryKey: ["dashboard-tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Task[];
    },
  });

  const { data: completions = [] } = useQuery({
    queryKey: ["user-task-completions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_task_completions")
        .select("task_id, status, completed_at")
        .eq("user_id", user.id);
      if (error) throw error;
      return data as TaskCompletion[];
    },
    enabled: !!user,
  });

  const completedTaskIds = new Set(completions.map(c => c.task_id));

  if (loadingTasks) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
          <p className="text-muted-foreground">Complete tasks to earn points and grow your network</p>
        </div>
      </div>

      <div className="grid gap-6">
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No tasks available</h3>
              <p className="text-muted-foreground">Check back later for new tasks!</p>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => {
            const isCompleted = completedTaskIds.has(task.id);
            return (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 flex items-center gap-2">
                        {task.title}
                        {isCompleted ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            Open
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-muted-foreground mb-3">{task.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-bold text-primary">+{task.payout_points} points</span>
                        <Badge variant="secondary" className="capitalize">
                          {task.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    >
                      View Details
                    </Button>
                    {!isCompleted && (
                      <Button 
                        size="sm"
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      >
                        Start Task
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

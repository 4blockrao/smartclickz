
import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string;
  payout_points: number;
}

interface UserTaskCompletion {
  task_id: string;
  user_id: string;
}

export default function Tasks() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());

  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ["all-tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, description, payout_points")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Task[];
    },
  });

  const { data: userCompletions, isLoading: isLoadingCompletions } = useQuery({
    queryKey: ["user-task-completions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_task_completions")
        .select("task_id")
        .eq("user_id", user.id);
      if (error) {
        console.error("Error fetching user task completions:", error);
        throw error;
      }
      return data as Pick<UserTaskCompletion, 'task_id'>[];
    },
    enabled: !!user,
  });
  
  // Update completedTaskIds when userCompletions data changes
  useEffect(() => {
    if (userCompletions) {
      const ids = new Set(userCompletions.map(c => c.task_id));
      setCompletedTaskIds(ids);
    }
  }, [userCompletions]);

  const markTaskAsDoneMutation = useMutation({
    mutationFn: async (taskId: string) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from("user_task_completions")
        .insert({ task_id: taskId, user_id: user.id, status: "completed" });
      if (error) throw error;
      return taskId;
    },
    onSuccess: (taskId) => {
      toast.success("Task marked as done!");
      queryClient.invalidateQueries({ queryKey: ["user-task-completions", user?.id] });
      // Optimistically update local state
      setCompletedTaskIds(prev => new Set([...prev, taskId]));
    },
    onError: (error: Error) => {
      toast.error(`Failed to mark task as done: ${error.message}`);
    },
  });

  const handleMarkTaskAsDone = (taskId: string) => {
    if (!user) {
      toast.error("Please log in to mark tasks as done.");
      navigate("/auth");
      return;
    }
    markTaskAsDoneMutation.mutate(taskId);
  };

  const handleViewTaskDetails = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  const isLoading = isLoadingTasks || (!!user && isLoadingCompletions);

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 min-h-screen">
      <h1 className="section-title text-center mb-8">All Tasks</h1>
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading tasks...</div>
      ) : tasks && tasks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No tasks available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {tasks?.map((task) => {
            const isCompleted = completedTaskIds.has(task.id);
            return (
              <Card
                key={task.id}
                className="p-5 flex flex-col space-y-2 border border-[#9b87f5]/25 bg-white hover:shadow-xl transition-shadow"
              >
                <div className="flex-grow">
                  <h2 className="font-semibold text-[#1A1F2C] text-lg">{task.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-3">{task.description}</p>
                  <span className="font-bold text-[#9b87f5] text-xs mt-1 block">
                    +{task.payout_points} points
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-auto pt-2 border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10 hover:text-[#7E69AB]"
                  onClick={() => handleViewTaskDetails(task.id)}
                >
                  View Details
                </Button>
                <Button
                  variant={isCompleted ? "default" : "secondary"}
                  size="sm"
                  className={`mt-2 w-full ${isCompleted ? 'bg-green-500 hover:bg-green-600' : 'bg-[#9b87f5] hover:bg-[#7E69AB]'} text-white`}
                  onClick={() => !isCompleted && handleMarkTaskAsDone(task.id)}
                  disabled={isCompleted || markTaskAsDoneMutation.isPending}
                >
                  {markTaskAsDoneMutation.isPending && markTaskAsDoneMutation.variables === task.id 
                    ? "Processing..." 
                    : isCompleted 
                    ? "Task Done" 
                    : "Mark as Done"}
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

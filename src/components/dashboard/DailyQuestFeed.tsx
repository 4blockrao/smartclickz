
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function DailyQuestFeed() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Load tasks: Show only uncompleted for brevity, but you could change to both
  const { data: tasks = [] } = useQuery({
    queryKey: ["dashboard-daily-tasks", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("tasks")
        .select("id, title, payout_points")
        .eq("is_active", true)
        .order("created_at");
      // get completions
      const { data: completed } = await supabase
        .from("user_task_completions")
        .select("task_id")
        .eq("user_id", user.id);
      const completedIds = new Set((completed || []).map(x => x.task_id));
      return (data || []).map((task) => ({
        ...task,
        completed: completedIds.has(task.id),
      }));
    },
    enabled: !!user,
  });

  const { mutate: completeTask } = useMutation({
    mutationFn: async (taskId: string) => {
      // Mark as completed
      await supabase.from("user_task_completions").insert([{ user_id: user.id, task_id: taskId }]);
    },
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-daily-tasks", user?.id] });
      toast({ title: "Task Completed", description: "+100 pts added!" });
    },
  });

  if (!user) return null;

  return (
    <div className="bg-[#2A2A2A] rounded-xl shadow p-4">
      <div className="text-white mb-2 font-bold text-lg flex items-center gap-1">🎯 Daily Quests</div>
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-slate-400 text-sm">You're all caught up!</div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between px-1 py-2 rounded-lg bg-[#222]">
              <div className="flex-1">
                <div className="font-medium text-white">{task.title}</div>
                <div className="text-xs text-sky-300">🪙 {task.payout_points || 0} pts</div>
              </div>
              <Button
                size="sm"
                className={`ml-3 transition-all ${task.completed ? 'bg-green-700' : 'bg-sky-700'}`}
                disabled={task.completed}
                onClick={() => completeTask(task.id)}
              >
                {task.completed ? "✅ Done" : "Mark Done"}
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

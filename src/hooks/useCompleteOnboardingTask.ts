
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Params {
  userId: string;
  taskId: string;
  points: number;
  taskName: string;
}

export function useCompleteOnboardingTask(userId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ userId, taskId, points, taskName }: Params) => {
      if (!userId) throw new Error("No user ID");
      // 1. Insert into user_onboarding_task_completions
      const { error: completionError } = await supabase
        .from("user_onboarding_task_completions")
        .insert([
          {
            user_id: userId,
            onboarding_task_id: taskId,
            completed_at: new Date().toISOString(),
          }
        ]);
      if (completionError && !String(completionError.message).includes("duplicate")) {
        throw completionError;
      }
      // 2. Insert into points_ledger
      const { error: pointsError } = await supabase
        .from("points_ledger")
        .insert([
          {
            user_id: userId,
            amount: points,
            event_code: `onboarding_${taskName || taskId}`,
            type: "reward",
            created_at: new Date().toISOString(),
            note: `Completed onboarding task: ${taskName || taskId}`
          }
        ]);
      if (pointsError) throw pointsError;
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Task Completed!",
        description: "You earned onboarding points.",
      });
      // Invalidate relevant onboarding and points queries for fresh UI
      queryClient.invalidateQueries({ queryKey: ["onboarding-task-completions"] });
      queryClient.invalidateQueries({ queryKey: ["points-ledger"] });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: typeof err?.message === "string" ? err.message : "Could not complete the task. Try again!",
        variant: "destructive"
      });
    }
  });

  return mutation;
}

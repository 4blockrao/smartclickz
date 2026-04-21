
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/integrations/supabase/types";

// Onboarding task row and user completion row types
type OnboardingTask = Database["public"]["Tables"]["onboarding_tasks"]["Row"];
type TaskCompletion = Database["public"]["Tables"]["user_onboarding_task_completions"]["Row"];

export function useOnboardingTasks(userId?: string) {
  // Load all active onboarding tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["onboarding-tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("onboarding_tasks")
        .select("*")
        .eq("is_active", true)
        .order("created_at");
      if (error) throw error;
      return data as OnboardingTask[];
    }
  });

  // Load user's completed tasks
  const { data: completions = [] } = useQuery({
    queryKey: ["onboarding-task-completions", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("user_onboarding_task_completions")
        .select("onboarding_task_id, completed_at")
        .eq("user_id", userId);
      if (error) throw error;
      return data as Pick<TaskCompletion, "onboarding_task_id" | "completed_at">[];
    },
    enabled: !!userId,
  });

  // Map of completed onboarding_task_id for fast lookup
  const completedIds = new Set(
    completions.map(tc => tc.onboarding_task_id)
  );

  return {
    tasks,
    completions,
    isLoading,
    completedIds,
  };
}

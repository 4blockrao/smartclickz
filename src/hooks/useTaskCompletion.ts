
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CompleteTaskParams {
  taskId: string;
  userId: string;
  proofUrl?: string;
  proofType: string;
  taskType: string;
  pointsReward: number;
}

export function useTaskCompletion() {
  const queryClient = useQueryClient();

  const completeTask = useMutation({
    mutationFn: async ({ taskId, userId, proofUrl, proofType, taskType, pointsReward }: CompleteTaskParams) => {
      // Generate unique task number for traceability
      const taskNumber = `TSK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // 1. Create task submission
      const { data: submission, error: submissionError } = await supabase
        .from("task_submissions")
        .insert([
          {
            task_id: taskId,
            user_id: userId,
            screenshot_url: proofUrl || "",
            status: "pending"
          }
        ])
        .select()
        .single();

      if (submissionError) throw submissionError;

      // 2. Create task completion record
      const { error: completionError } = await supabase
        .from("user_task_completions")
        .insert([
          {
            user_id: userId,
            task_id: taskId,
            status: "completed"
          }
        ]);

      if (completionError) throw completionError;

      // 3. Award points with unique tracking
      const { error: pointsError } = await supabase
        .from("points_ledger")
        .insert([
          {
            user_id: userId,
            amount: pointsReward,
            type: "reward",
            event_code: `task_${taskType}_${taskNumber}`,
            note: `Task completed: ${taskNumber}`,
            event_metadata: {
              task_id: taskId,
              task_number: taskNumber,
              proof_type: proofType,
              submission_id: submission.id
            }
          }
        ]);

      if (pointsError) throw pointsError;

      // 4. Log task event
      const { error: logError } = await supabase
        .from("task_event_logs")
        .insert([
          {
            user_id: userId,
            task_id: taskId,
            task_type: taskType,
            event_type: "completed",
            event_note: `Task ${taskNumber} completed successfully`
          }
        ]);

      if (logError) throw logError;

      return { taskNumber, submissionId: submission.id };
    },
    onSuccess: (data) => {
      toast({
        title: "Task Completed!",
        description: `Task ${data.taskNumber} completed. Points credited to your wallet.`,
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["points-ledger"] });
      queryClient.invalidateQueries({ queryKey: ["user-task-completions"] });
      queryClient.invalidateQueries({ queryKey: ["task-submissions"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
      console.error("Task completion error:", error);
    },
  });

  return { completeTask: completeTask.mutate, isCompleting: completeTask.isPending };
}

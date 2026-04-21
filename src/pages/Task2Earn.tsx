
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Award, Upload } from "lucide-react";

type Task = {
  id: string;
  title: string;
  description: string;
  payout_points: number;
  url?: string;
  is_active: boolean;
};

export default function Task2Earn() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);

  // Track the specific submission status for each task (success, error)
  const [submissionStatus, setSubmissionStatus] = useState<{
    [taskId: string]: string | null;
  }>({});

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("is_active", true);

    if (error) {
      toast({ title: "Error loading tasks", description: error.message, variant: "destructive" });
    } else if (data) {
      setTasks(data);
    }
  }

  async function handleSubmit(taskId: string) {
    if (!screenshot || !user) return;

    setSubmittingId(taskId);
    setSubmissionStatus((prev) => ({ ...prev, [taskId]: null }));

    // 1. Upload screenshot to Supabase Storage
    const fileExt = screenshot.name.split(".").pop();
    const fileName = `${user.id}_${taskId}_${Date.now()}.${fileExt}`;
    const { data: fileData, error: fileError } = await supabase.storage
      .from("task-proofs")
      .upload(fileName, screenshot);

    if (fileError) {
      setSubmittingId(null);
      setSubmissionStatus((prev) => ({ ...prev, [taskId]: "Upload failed" }));
      toast({ title: "Upload failed", description: fileError.message, variant: "destructive" });
      return;
    }

    // 2. Insert submission
    const screenshotUrl = fileData?.path
      ? supabase.storage.from("task-proofs").getPublicUrl(fileData.path).data.publicUrl
      : "";

    const { error: submitError } = await supabase.from("task_submissions").insert({
      task_id: taskId,
      user_id: user.id,
      screenshot_url: screenshotUrl,
      status: "pending",
    });

    if (submitError) {
      setSubmittingId(null);
      setSubmissionStatus((prev) => ({ ...prev, [taskId]: "Submission failed" }));
      toast({ title: "Submission failed", description: submitError.message, variant: "destructive" });
    } else {
      setSubmittingId(null);
      setScreenshot(null);
      setSubmissionStatus((prev) => ({ ...prev, [taskId]: "Submitted!" }));
      toast({ title: "Submitted for review", description: "Your proof was submitted successfully. Admin will review.", variant: "default" });
    }
  }

  if (!tasks.length) {
    return <div className="max-w-xl mx-auto mt-12 text-center text-lg">No earning tasks are available at the moment.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center flex justify-center items-center gap-3">
        <Award className="text-primary" /> Task2Earn: Complete Tasks for Points
      </h1>
      <div className="space-y-6">
        {tasks.map((task) => (
          <Card key={task.id} className="p-0">
            <CardContent className="flex flex-col gap-4 py-5">
              <div>
                <h2 className="font-semibold text-xl">{task.title}</h2>
                <p className="text-sm text-muted-foreground">{task.description}</p>
                {task.url && (
                  <a
                    className="text-primary underline text-sm mt-1 inline-block"
                    href={task.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Task Link
                  </a>
                )}
                <div className="mt-2 text-green-700 font-bold text-lg">Reward: +{task.payout_points} pts</div>
              </div>
              {user ? (
                <form
                  className="flex flex-col gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(task.id);
                  }}
                >
                  <label className="block text-sm font-medium">
                    Upload Screenshot as Proof:
                    <Input
                      accept="image/*"
                      type="file"
                      className="mt-2"
                      onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
                      required
                    />
                  </label>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={submittingId === task.id || !screenshot}
                    className="w-fit flex gap-2 items-center"
                  >
                    <Upload className="w-4 h-4" /> Submit Proof
                  </Button>
                  <div>
                    {submissionStatus[task.id] && (
                      <span className="text-sm text-green-600">{submissionStatus[task.id]}</span>
                    )}
                  </div>
                </form>
              ) : (
                <div className="text-center text-muted-foreground text-sm">Please log in to submit tasks.</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Award, Upload, Clock } from "lucide-react";

type Task = {
  id: string;
  title: string;
  description: string;
  payout_points: number;
  url?: string | null;
};

type Submission = {
  id: string;
  task_id: string;
  status: string | null;
  created_at: string | null;
  tasks?: { title: string } | null;
};

export default function Task2Earn() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);

  useEffect(() => {
    fetchTasks();
    if (user) fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function fetchTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Error loading tasks", description: error.message, variant: "destructive" });
    else setTasks(data || []);
  }

  async function fetchSubmissions() {
    if (!user) return;
    const { data } = await supabase
      .from("task_submissions")
      .select("id, task_id, status, created_at, tasks(title)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setSubmissions((data as any) || []);
  }

  const submittedTaskIds = new Set(submissions.map((s) => s.task_id));

  async function handleSubmit(taskId: string) {
    if (!screenshot || !user) return;
    setSubmittingId(taskId);

    const fileExt = screenshot.name.split(".").pop();
    const fileName = `${user.id}_${taskId}_${Date.now()}.${fileExt}`;
    const { data: fileData, error: fileError } = await supabase.storage.from("task-proofs").upload(fileName, screenshot);
    if (fileError) {
      setSubmittingId(null);
      toast({ title: "Upload failed", description: fileError.message, variant: "destructive" });
      return;
    }

    const screenshotUrl = fileData?.path
      ? supabase.storage.from("task-proofs").getPublicUrl(fileData.path).data.publicUrl
      : "";

    const { error: submitError } = await supabase.from("task_submissions").insert({
      task_id: taskId,
      user_id: user.id,
      screenshot_url: screenshotUrl,
      status: "pending",
    });

    setSubmittingId(null);
    if (submitError) {
      toast({ title: "Submission failed", description: submitError.message, variant: "destructive" });
    } else {
      setScreenshot(null);
      toast({ title: "Submitted for review", description: "Your proof was submitted. An admin will review it." });
      fetchSubmissions();
    }
  }

  const statusBadge = (status: string | null) => {
    const s = status || "pending";
    const cls =
      s === "approved" ? "bg-green-500/20 text-green-600" : s === "rejected" ? "bg-red-500/20 text-red-600" : "bg-yellow-500/20 text-yellow-700";
    return <Badge className={`${cls} capitalize`}>{s}</Badge>;
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center flex justify-center items-center gap-3">
        <Award className="text-primary" /> Tasks
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        Complete tasks, submit proof, and earn points once approved.
      </p>

      <h2 className="font-semibold text-lg mb-3">Available Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-muted-foreground mb-10">No tasks available right now. Check back soon.</p>
      ) : (
        <div className="space-y-6 mb-10">
          {tasks.map((task) => {
            const already = submittedTaskIds.has(task.id);
            return (
              <Card key={task.id}>
                <CardContent className="flex flex-col gap-4 py-5">
                  <div>
                    <h3 className="font-semibold text-xl">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    {task.url && (
                      <a className="text-primary underline text-sm mt-1 inline-block" href={task.url} target="_blank" rel="noopener noreferrer">
                        Open task link
                      </a>
                    )}
                    <div className="mt-2 text-green-700 font-bold text-lg">Reward: +{task.payout_points} pts</div>
                  </div>
                  {!user ? (
                    <div className="text-center text-muted-foreground text-sm">Please log in to submit tasks.</div>
                  ) : already ? (
                    <div className="text-sm text-muted-foreground">You've already submitted proof for this task.</div>
                  ) : (
                    <form
                      className="flex flex-col gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(task.id);
                      }}
                    >
                      <label className="block text-sm font-medium">
                        Upload screenshot as proof:
                        <Input
                          accept="image/*"
                          type="file"
                          className="mt-2"
                          onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
                          required
                        />
                      </label>
                      <Button type="submit" size="sm" disabled={submittingId === task.id || !screenshot} className="w-fit flex gap-2 items-center">
                        <Upload className="w-4 h-4" /> {submittingId === task.id ? "Submitting..." : "Submit Proof"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {user && submissions.length > 0 && (
        <>
          <h2 className="font-semibold text-lg mb-3">My Submissions</h2>
          <div className="space-y-3">
            {submissions.map((s) => (
              <Card key={s.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <div className="font-medium">{s.tasks?.title || "Task"}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}
                    </div>
                  </div>
                  {statusBadge(s.status)}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

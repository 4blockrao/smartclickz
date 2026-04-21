import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, AlertTriangle, CheckCircle, Upload, ExternalLink, Clock, Users, DollarSign, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface TaskDetailData {
  id: string;
  title: string;
  description: string;
  payout_points: number;
  type: string;
  proof_type: string;
  url: string | null;
  created_at: string;
}

interface UserTaskCompletion {
  task_id: string;
  user_id: string;
}

export default function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);

  const { data: task, isLoading: isLoadingTask, error: taskError } = useQuery({
    queryKey: ["task-detail", taskId],
    queryFn: async () => {
      if (!taskId) return null;
      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, description, payout_points, type, proof_type, url, created_at")
        .eq("id", taskId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { 
          console.warn(`Task with ID ${taskId} not found.`);
          return null;
        }
        throw error;
      }
      return data as TaskDetailData;
    },
    enabled: !!taskId,
  });

  const { data: completionStatus, isLoading: isLoadingCompletionStatus } = useQuery({
    queryKey: ["task-completion-status", taskId, user?.id],
    queryFn: async () => {
      if (!user || !taskId) return false;
      const { data, error } = await supabase
        .from("user_task_completions")
        .select("task_id")
        .eq("user_id", user.id)
        .eq("task_id", taskId)
        .maybeSingle(); // Use maybeSingle to handle no rows gracefully
      
      if (error) {
        console.error("Error fetching task completion status:", error);
        throw error;
      }
      return !!data; // True if a record exists, false otherwise
    },
    enabled: !!user && !!taskId,
  });

  // Update completion state when completionStatus changes
  useEffect(() => {
    if (completionStatus !== undefined) {
      setIsTaskCompleted(completionStatus);
    }
  }, [completionStatus]);
  
  // Mark task as done (insert status: 'completed')
  const markTaskAsDoneMutation = useMutation({
    mutationFn: async (currentTaskId: string) => {
      if (!user) throw new Error("User not authenticated");
      if (!currentTaskId) throw new Error("Task ID is missing");

      const { error, data } = await supabase
        .from("user_task_completions")
        .insert({ task_id: currentTaskId, user_id: user.id, status: "completed" });

      if (error) {
        // Enhanced error logging for debugging!
        console.error("Supabase insert error (user_task_completions):", error);
        if (error.details) {
          console.error("Supabase error details:", error.details);
        }
        if (error.hint) {
          console.error("Supabase error hint:", error.hint);
        }
        if (error.code) {
          console.error("Supabase error code:", error.code);
        }
        // Try to show the PostgREST response for a 400
        if (error instanceof Error && (error as any).response) {
          (error as any).response.json().then((body: any) => {
            console.error("Supabase response body:", body);
          });
        }

        // Handle unique/duplicate violation gracefully
        if (error.code === '23505' || (error.message && error.message.includes("duplicate key"))) {
          toast.info("Task already marked as completed.");
          return currentTaskId;
        }
        throw error;
      }
      return currentTaskId;
    },
    onSuccess: (currentTaskId) => {
      toast.success("Task marked as complete!");
      setIsTaskCompleted(true);
      queryClient.invalidateQueries({ queryKey: ["user-task-completions", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["task-completion-status", currentTaskId, user?.id] });
      queryClient.invalidateQueries({ queryKey: ["points-ledger", user?.id] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to mark task as complete: ${error.message}`);
    },
  });

  const handleCompleteTask = () => {
    if (!user) {
      toast.error("Please log in to complete tasks.");
      navigate("/auth");
      return;
    }
    if (!taskId) {
        toast.error("Task ID is missing.");
        return;
    }
    if (isTaskCompleted) {
      toast.info("This task has already been completed.");
      return;
    }
    console.log("Attempting to complete task:", taskId);
    // Directly call the mutation. (No alert)
    markTaskAsDoneMutation.mutate(taskId);
  };

  const isLoading = isLoadingTask || (!!user && isLoadingCompletionStatus);

  if (isLoading) {
    return <div className="container mx-auto max-w-2xl py-12 px-4 text-center min-h-screen">Loading task details...</div>;
  }

  if (taskError || !task) {
    return (
      <div className="container mx-auto max-w-2xl py-12 px-4 text-center min-h-screen">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Task Not Found</h2>
        <p className="text-muted-foreground mb-6">
          {taskError ? `An error occurred: ${taskError.message}` : "The task you are looking for does not exist or could not be loaded."}
        </p>
        <Button onClick={() => navigate("/tasks")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
        </Button>
      </div>
    );
  }

  const [proofText, setProofText] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Task Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border/50 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="w-fit">
                      {task.type.replace(/_/g, " ").toUpperCase()}
                    </Badge>
                    <CardTitle className="text-2xl font-bold text-foreground">{task.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Published on {new Date(task.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">+{task.payout_points}</div>
                    <div className="text-sm text-muted-foreground">Points</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Task Description
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </div>

                {task.url && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <ExternalLink className="h-5 w-5 text-primary" />
                      Task Link
                    </h3>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open(task.url!, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Task Link
                    </Button>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Proof Requirements
                  </h3>
                  <Badge variant="outline" className="mb-3">
                    {task.proof_type.replace(/_/g, " ").toUpperCase()}
                  </Badge>
                  
                  {!isTaskCompleted && (
                    <div className="space-y-4 mt-4 p-4 bg-muted/30 rounded-lg">
                      <div>
                        <Label htmlFor="proof-text">Proof Description</Label>
                        <Textarea
                          id="proof-text"
                          placeholder="Describe how you completed this task..."
                          value={proofText}
                          onChange={(e) => setProofText(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      {task.proof_type === 'screenshot' && (
                        <div>
                          <Label htmlFor="proof-file">Upload Screenshot</Label>
                          <Input
                            id="proof-file"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Button 
                  size="lg" 
                  className={`w-full ${isTaskCompleted ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-primary/90'} text-primary-foreground`}
                  onClick={handleCompleteTask}
                  disabled={isTaskCompleted || markTaskAsDoneMutation.isPending || (!proofText.trim() && !isTaskCompleted)}
                >
                  {markTaskAsDoneMutation.isPending ? (
                    "Submitting..."
                  ) : isTaskCompleted ? (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" /> Task Completed
                    </>
                  ) : (
                    "Submit Task & Claim Reward"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Task Stats Sidebar */}
          <div className="space-y-6">
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Reward Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Base Reward</span>
                  <span className="font-semibold">+{task.payout_points} Points</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Bonus Eligible</span>
                  <Badge variant="secondary">Yes</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Difficulty</span>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i < 2 ? 'bg-primary' : 'bg-muted'}`} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Task Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Completed</span>
                    <span>847 / 1000</span>
                  </div>
                  <Progress value={84.7} className="h-2" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Time Remaining</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    2 days
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Account verified</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Social media connected</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Minimum level: 1</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

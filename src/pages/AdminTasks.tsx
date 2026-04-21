import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, CheckCircle, XCircle, Clock, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string;
  type: string;
  payout_points: number;
  proof_type: string;
  url: string | null;
  is_active: boolean;
  created_at: string;
}

interface TaskSubmission {
  id: string;
  task_id: string;
  user_id: string;
  screenshot_url: string;
  status: string;
  created_at: string;
  admin_note: string | null;
  tasks: { title: string };
  profiles: { display_name: string; email: string };
}

export default function AdminTasks() {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<TaskSubmission | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [activeTab, setActiveTab] = useState("tasks");

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    type: "social_media",
    payout_points: "50",
    proof_type: "screenshot",
    url: "",
    is_active: true,
  });

  // Fetch all tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["admin-tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Task[];
    },
  });

  // Fetch pending submissions
  const { data: submissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ["admin-task-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("task_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Fetch related data separately
      const enrichedData = await Promise.all(
        (data || []).map(async (submission) => {
          const { data: task } = await supabase
            .from("tasks")
            .select("title")
            .eq("id", submission.task_id)
            .single();

          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name, email")
            .eq("user_id", submission.user_id)
            .single();

          return {
            ...submission,
            tasks: task || { title: "Unknown Task" },
            profiles: profile || { display_name: "Unknown User", email: "" },
          };
        })
      );

      return enrichedData as TaskSubmission[];
    },
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (task: typeof taskForm) => {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase.from("tasks").insert([
        {
          ...task,
          payout_points: parseInt(task.payout_points),
          created_by: userData.user?.id,
        },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
      toast.success("Task created successfully!");
      setIsCreateDialogOpen(false);
      setTaskForm({
        title: "",
        description: "",
        type: "social_media",
        payout_points: "50",
        proof_type: "screenshot",
        url: "",
        is_active: true,
      });
    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });

  // Toggle task active status
  const toggleTaskMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("tasks")
        .update({ is_active: !is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
      toast.success("Task status updated!");
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
      toast.success("Task deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  // Review submission mutation
  const reviewSubmissionMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      note,
    }: {
      id: string;
      status: "approved" | "rejected";
      note: string;
    }) => {
      const { error } = await supabase
        .from("task_submissions")
        .update({
          status,
          admin_note: note,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;

      // If approved, create points ledger entry and task completion
      if (status === "approved") {
        const submission = submissions.find((s) => s.id === id);
        if (submission) {
          // Add points
          await supabase.from("points_ledger").insert([
            {
              user_id: submission.user_id,
              amount: 50, // You should fetch the task's payout_points
              type: "reward",
              event_code: "task_completed",
              note: `Task completed: ${submission.tasks.title}`,
            },
          ]);

          // Record completion
          await supabase.from("user_task_completions").insert([
            {
              user_id: submission.user_id,
              task_id: submission.task_id,
              status: "completed",
            },
          ]);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-task-submissions"] });
      toast.success("Submission reviewed successfully!");
      setSelectedSubmission(null);
      setAdminNote("");
    },
    onError: () => {
      toast.error("Failed to review submission");
    },
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    createTaskMutation.mutate(taskForm);
  };

  const handleReviewSubmission = (status: "approved" | "rejected") => {
    if (!selectedSubmission) return;
    reviewSubmissionMutation.mutate({
      id: selectedSubmission.id,
      status,
      note: adminNote,
    });
  };

  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const activeTasksCount = tasks.filter((t) => t.is_active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Tasks Management</h2>
          <p className="text-muted-foreground">Create and manage community earning tasks</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Add a new task for users to complete and earn points</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Follow us on Instagram"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Describe what users need to do..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Task Type</Label>
                  <Select
                    value={taskForm.type}
                    onValueChange={(value) => setTaskForm({ ...taskForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="survey">Survey</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="content">Content Creation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="payout">Points Reward</Label>
                  <Input
                    id="payout"
                    type="number"
                    min="1"
                    value={taskForm.payout_points}
                    onChange={(e) => setTaskForm({ ...taskForm, payout_points: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="url">Task URL (Optional)</Label>
                <Input
                  id="url"
                  type="url"
                  value={taskForm.url}
                  onChange={(e) => setTaskForm({ ...taskForm, url: e.target.value })}
                  placeholder="https://instagram.com/yourpage"
                />
              </div>

              <div>
                <Label htmlFor="proof_type">Proof Type</Label>
                <Select
                  value={taskForm.proof_type}
                  onValueChange={(value) => setTaskForm({ ...taskForm, proof_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="screenshot">Screenshot</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                    <SelectItem value="code">Code</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={createTaskMutation.isPending}>
                {createTaskMutation.isPending ? "Creating..." : "Create Task"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Tasks</p>
                <p className="text-2xl font-bold">{activeTasksCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tasks">All Tasks</TabsTrigger>
          <TabsTrigger value="submissions">
            Submissions {pendingCount > 0 && <Badge className="ml-2">{pendingCount}</Badge>}
          </TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{task.type}</Badge>
                      </TableCell>
                      <TableCell>{task.payout_points} pts</TableCell>
                      <TableCell>
                        <Badge variant={task.is_active ? "default" : "secondary"}>
                          {task.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(task.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTaskMutation.mutate(task)}
                        >
                          {task.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => deleteTaskMutation.mutate(task.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{submission.profiles?.display_name}</p>
                          <p className="text-sm text-muted-foreground">{submission.profiles?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{submission.tasks?.title}</TableCell>
                      <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            submission.status === "approved"
                              ? "default"
                              : submission.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {submission.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {submission.status === "pending" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedSubmission(submission)}
                              >
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Review Submission</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                {/* Screenshot */}
                                <div>
                                  <Label>Proof</Label>
                                  <div className="mt-2 border rounded-lg overflow-hidden">
                                    <img
                                      src={submission.screenshot_url}
                                      alt="Submission proof"
                                      className="w-full"
                                    />
                                  </div>
                                </div>

                                {/* Admin Note */}
                                <div>
                                  <Label htmlFor="admin-note">Admin Note (Optional)</Label>
                                  <Textarea
                                    id="admin-note"
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="Add a note about this review..."
                                  />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                  <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    onClick={() => handleReviewSubmission("approved")}
                                    disabled={reviewSubmissionMutation.isPending}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={() => handleReviewSubmission("rejected")}
                                    disabled={reviewSubmissionMutation.isPending}
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

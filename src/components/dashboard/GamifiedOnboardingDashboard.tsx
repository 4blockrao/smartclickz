
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOnboardingTasks } from "@/hooks/useOnboardingTasks";
import { useCompleteOnboardingTask } from "@/hooks/useCompleteOnboardingTask";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Star, Award, Target, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function GamifiedOnboardingDashboard() {
  const { user } = useAuth();
  const { tasks = [], isLoading } = useOnboardingTasks(user?.id);
  const { mutate: completeTask, isPending } = useCompleteOnboardingTask(user?.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => 
    task.type === 'onboarding'
  );
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

  const handleCompleteTask = (task: any) => {
    if (!user) return;
    
    completeTask(
      { 
        taskId: task.id, 
        userId: user.id,
        points: task.points || 0,
        taskName: task.name || ''
      },
      {
        onSuccess: () => {
          toast({
            title: "Task Completed!",
            description: "Congratulations! You've earned points for completing this task.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to complete task. Please try again.",
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen text-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Welcome to SmartClicks
        </h1>
        <p className="text-xl text-slate-300">Complete your onboarding to unlock all features</p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="w-6 h-6 text-blue-400" />
            Onboarding Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">Progress</span>
                <span className="text-blue-400 font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3 bg-slate-700" />
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">{completedTasks.length} completed</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-300">{totalTasks - completedTasks.length} remaining</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => {
          const isCompleted = task.type === 'onboarding';
          
          return (
            <Card key={task.id} className={`bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-200 ${isCompleted ? 'ring-2 ring-green-500/30' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-white">
                    {task.name}
                  </CardTitle>
                  {isCompleted && (
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300 text-sm">{task.description}</p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    <Zap className="w-3 h-3 mr-1" />
                    {task.points} points
                  </Badge>
                  
                  {!isCompleted ? (
                    <Button
                      onClick={() => handleCompleteTask(task)}
                      disabled={isPending}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isPending ? "Completing..." : "Complete"}
                    </Button>
                  ) : (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <Award className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completion Celebration */}
      {progress === 100 && (
        <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30">
          <CardContent className="text-center py-8">
            <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Congratulations!</h2>
            <p className="text-slate-300 mb-4">
              You've completed all onboarding tasks. You're now ready to start earning!
            </p>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Start Earning Now
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

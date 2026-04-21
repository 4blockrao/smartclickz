
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Rocket,
  Target,
  Users,
  Award,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const OnboardingSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const onboardingTasks = [
    {
      id: 1,
      title: "Complete Profile",
      description: "Add your details and profile picture",
      completed: true,
      points: 100,
      icon: Users
    },
    {
      id: 2,
      title: "First Task",
      description: "Complete your first earning task",
      completed: true,
      points: 150,
      icon: Target
    },
    {
      id: 3,
      title: "Join Community",
      description: "Connect with other networkers",
      completed: false,
      points: 200,
      icon: Users
    },
    {
      id: 4,
      title: "Refer a Friend",
      description: "Invite someone to join SmartClicks",
      completed: false,
      points: 500,
      icon: Award
    }
  ];

  const completedTasks = onboardingTasks.filter(task => task.completed).length;
  const totalTasks = onboardingTasks.length;
  const progress = (completedTasks / totalTasks) * 100;

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Rocket className="w-5 h-5 text-purple-400" />
          Getting Started
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold">Onboarding Progress</span>
            <Badge className="bg-purple-500 text-white">
              {completedTasks}/{totalTasks} Complete
            </Badge>
          </div>
          <Progress value={progress} className="h-2 bg-white/20 mb-2" />
          <p className="text-slate-300 text-sm">
            {progress === 100 
              ? "🎉 Congratulations! You're all set up!" 
              : `${Math.round(progress)}% complete - Keep going!`
            }
          </p>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {onboardingTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                task.completed 
                  ? "bg-green-500/20 border border-green-500/30" 
                  : "bg-white/5 hover:bg-white/10 border border-white/10"
              }`}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                task.completed ? "bg-green-500" : "bg-white/20"
              }`}>
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400" />
                )}
              </div>
              
              <div className="flex-1">
                <h4 className={`font-medium ${task.completed ? "text-green-300" : "text-white"}`}>
                  {task.title}
                </h4>
                <p className="text-slate-400 text-sm">{task.description}</p>
              </div>
              
              <div className="text-right">
                <Badge className={`${task.completed ? "bg-green-500" : "bg-purple-500"} text-white text-xs`}>
                  +{task.points}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        {progress < 100 && (
          <Button 
            onClick={() => navigate("/dashboard/onboarding")}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Continue Setup
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}

        {progress === 100 && (
          <div className="text-center p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
            <Award className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">Setup Complete!</h3>
            <p className="text-green-300 text-sm mb-3">
              You've earned {onboardingTasks.reduce((sum, task) => sum + task.points, 0)} bonus points!
            </p>
            <Button 
              onClick={() => navigate("/dashboard/tasks")}
              variant="outline"
              className="border-green-500/50 text-green-300 hover:bg-green-500/20"
            >
              Start Earning Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OnboardingSection;

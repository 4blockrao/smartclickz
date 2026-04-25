
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { 
  Wallet, 
  Target, 
  Users, 
  MessageSquare, 
  Star, 
  Award, 
  TrendingUp,
  Plus,
  Clock,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export default function MobileDashboardScreen() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  // Task completion data (mock)
  const completedTasks = 3;
  const totalTasks = 5;
  const percentComplete = (completedTasks / totalTasks) * 100;
  
  // Level progress data (mock)
  const currentLevel = userProfile?.xp_level || 1;
  const xpToNextLevel = 75;

  return (
    <div className="space-y-6 p-4">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary/20">
              <AvatarImage src={userProfile?.profile_image_url} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {userProfile?.display_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">Welcome back, {userProfile?.display_name?.split(' ')[0] || "User"}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">Level {currentLevel}</Badge>
                <span className="text-sm text-muted-foreground">{userProfile?.points || 0} points</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Level {currentLevel}</span>
              <span className="text-sm text-muted-foreground">{xpToNextLevel}% to Level {currentLevel + 1}</span>
            </div>
            <Progress value={xpToNextLevel} className="h-2" />
            <p className="text-xs text-muted-foreground">Complete tasks to earn XP and level up</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center h-24">
            <Wallet className="h-6 w-6 mb-2 text-green-500" />
            <p className="text-lg font-semibold">${userProfile?.wallet_balance?.toFixed(2) || "0.00"}</p>
            <p className="text-xs text-muted-foreground">Balance</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center h-24">
            <TrendingUp className="h-6 w-6 mb-2 text-blue-500" />
            <p className="text-lg font-semibold">162</p>
            <p className="text-xs text-muted-foreground">Network Rank</p>
          </CardContent>
        </Card>
      </div>

      {/* Task Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Daily Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{completedTasks} of {totalTasks} completed</span>
              <Badge variant="outline" className="font-normal">
                {percentComplete}%
              </Badge>
            </div>
            <Progress value={percentComplete} className="h-2" />
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full mt-2"
              onClick={() => navigate("/dashboard/tasks")}
            >
              View Tasks
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="flex-col h-20 space-y-1"
            onClick={() => navigate("/dashboard/team")}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs">Team</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex-col h-20 space-y-1"
            onClick={() => navigate("/campaigns")}
          >
            <Target className="h-5 h-5" />
            <span className="text-xs">Campaigns</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex-col h-20 space-y-1"
            onClick={() => navigate("/wallet")}
          >
            <Wallet className="h-5 w-5" />
            <span className="text-xs">Wallet</span>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Completed a task</p>
                  <p className="text-xs text-muted-foreground">Earned 10 points • 2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3"
          >
            View All Activity
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

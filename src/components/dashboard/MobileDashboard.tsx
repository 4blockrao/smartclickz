
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Target, 
  Trophy, 
  TrendingUp, 
  MessageSquare, 
  Calendar,
  ArrowRight,
  Star,
  Briefcase,
  MapPin
} from "lucide-react";

interface MobileDashboardProps {
  userProfile: any;
  profileDetails: any;
  teamStats: any;
  classifieds: any;
  communityTasks: any;
  pointsBalance: number;
}

export default function MobileDashboard({
  userProfile,
  profileDetails,
  teamStats,
  classifieds,
  communityTasks,
  pointsBalance
}: MobileDashboardProps) {
  const displayName = userProfile?.display_name || "Networker";
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarImage src={userProfile?.profile_image_url} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-lg text-foreground">
                Welcome back, {displayName.split(' ')[0]}
              </h1>
              <p className="text-sm text-muted-foreground">
                {profileDetails?.current_role || "Professional Networker"}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-success-50 text-success-700 border-success-200">
            {userProfile?.points || 0} pts
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full mb-2 mx-auto">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">
                {(teamStats?.team_level1 || 0) + (teamStats?.team_level2 || 0) + (teamStats?.team_level3 || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Team Size</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success-50 to-success-100 border-success-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-success-100 rounded-full mb-2 mx-auto">
                <Target className="w-4 h-4 text-success-600" />
              </div>
              <div className="text-2xl font-bold text-success-700">
                {communityTasks?.completed || 0}
              </div>
              <p className="text-xs text-muted-foreground">Tasks Done</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Opportunities */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Active Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-warning-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">New Classifieds</p>
                  <p className="text-xs text-muted-foreground">{classifieds?.remaining || 0} available</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-primary">
                View <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Open Tasks</p>
                  <p className="text-xs text-muted-foreground">{communityTasks?.open || 0} pending</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-primary">
                Start <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Completeness */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Profile Strength
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completeness</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {userProfile?.city && userProfile?.country 
                  ? `${userProfile.city}, ${userProfile.country}`
                  : "Add location to boost visibility"
                }
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              Complete Profile
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs">Messages</span>
            </Button>
            <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">Events</span>
            </Button>
            <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-2">
              <Users className="w-4 h-4" />
              <span className="text-xs">Find People</span>
            </Button>
            <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="text-xs">Companies</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Building, 
  MapPin, 
  Calendar,
  Star,
  Shield,
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp
} from "lucide-react";

interface ProfileCardProps {
  userProfile: any;
  profileDetails: any;
  onNavigate: (path: string) => void;
}

function ProfileInfoCard({ userProfile, profileDetails, onNavigate }: ProfileCardProps) {
  const completionPercentage = 85; // This would be calculated based on profile completeness
  
  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            {userProfile?.is_verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-bold">
              {userProfile?.display_name || "Professional Networker"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {profileDetails?.current_role || "Growing Network"}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {userProfile?.city && userProfile?.country 
                  ? `${userProfile.city}, ${userProfile.country}`
                  : "Location not set"
                }
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Profile Strength</span>
              <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Complete your profile to boost networking opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold text-primary">{userProfile?.points || 0}</div>
              <div className="text-xs text-muted-foreground">Network Points</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold text-success-600">
                {userProfile?.is_verified ? <CheckCircle2 className="w-5 h-5 mx-auto" /> : <Clock className="w-5 h-5 mx-auto" />}
              </div>
              <div className="text-xs text-muted-foreground">
                {userProfile?.is_verified ? "Verified" : "Pending"}
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => onNavigate('/dashboard/profile')} 
          className="w-full mt-4"
          variant="outline"
        >
          Manage Profile <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

interface TeamCardProps {
  teamStats: any;
  onNavigate: (path: string) => void;
}

function TeamInfoCard({ teamStats, onNavigate }: TeamCardProps) {
  const totalTeam = (teamStats?.team_level1 || 0) + (teamStats?.team_level2 || 0) + (teamStats?.team_level3 || 0);
  
  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-blue-600" />
          </div>
          Network Team
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{totalTeam}</div>
            <p className="text-sm text-muted-foreground">Total Team Members</p>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-700">{teamStats?.team_level1 || 0}</div>
              <div className="text-xs text-blue-600">Level 1</div>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-700">{teamStats?.team_level2 || 0}</div>
              <div className="text-xs text-blue-600">Level 2</div>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-700">{teamStats?.team_level3 || 0}</div>
              <div className="text-xs text-blue-600">Level 3</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-success-50 rounded-lg">
            <TrendingUp className="w-4 h-4 text-success-600" />
            <span className="text-sm text-success-800">Team growing this month</span>
          </div>
        </div>
        
        <Button 
          onClick={() => onNavigate('/dashboard/team')} 
          className="w-full mt-4"
          variant="outline"
        >
          View Team Details <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

interface DashboardInfoCardsProps {
  userProfile: any;
  profileDetails: any;
  teamStats: any;
  onNavigate: (path: string) => void;
}

export default function DashboardInfoCards({ 
  userProfile, 
  profileDetails, 
  teamStats, 
  onNavigate 
}: DashboardInfoCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ProfileInfoCard 
        userProfile={userProfile} 
        profileDetails={profileDetails} 
        onNavigate={onNavigate} 
      />
      <TeamInfoCard 
        teamStats={teamStats} 
        onNavigate={onNavigate} 
      />
    </div>
  );
}

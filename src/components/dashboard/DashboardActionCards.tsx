
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Users, 
  MessageSquare, 
  Briefcase,
  Calendar,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2
} from "lucide-react";

interface ActionCardProps {
  title: string;
  description: string;
  count: number;
  type: 'tasks' | 'team' | 'campaigns';
  urgent?: boolean;
  onAction: () => void;
}

export function ActionCard({ title, description, count, type, urgent, onAction }: ActionCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'tasks':
        return <Target className="w-5 h-5" />;
      case 'team':
        return <Users className="w-5 h-5" />;
      case 'campaigns':
        return <Briefcase className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getTheme = () => {
    switch (type) {
      case 'tasks':
        return 'from-primary/5 to-primary/10 border-primary/20 text-primary';
      case 'team':
        return 'from-success-50 to-success-100 border-success-200 text-success-700';
      case 'campaigns':
        return 'from-accent-50 to-accent-100 border-accent-200 text-accent-700';
      default:
        return 'from-muted/50 to-muted border-border text-foreground';
    }
  };

  return (
    <Card className={`cursor-pointer transition-all duration-200 hover:shadow-md bg-gradient-to-br ${getTheme().split(' ').slice(0, 2).join(' ')} ${getTheme().split(' ')[2]}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
          </div>
          {urgent && (
            <Badge variant="destructive" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Urgent
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold">{count}</span>
            <span className="text-sm text-muted-foreground">
              available
            </span>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onAction}
            className="text-current hover:bg-current/10"
          >
            View All <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardActionCardsProps {
  data: {
    openTasks: number;
    teamMembers: number;
    activeCampaigns: number;
  };
  onNavigate: (path: string) => void;
}

export default function DashboardActionCards({ data, onNavigate }: DashboardActionCardsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ActionCard
          title="Active Tasks"
          description="Complete tasks to earn points and grow your network"
          count={data.openTasks}
          type="tasks"
          urgent={data.openTasks > 5}
          onAction={() => onNavigate('/dashboard/tasks')}
        />
        <ActionCard
          title="Team Growth"
          description="Manage and expand your professional network"
          count={data.teamMembers}
          type="team"
          onAction={() => onNavigate('/dashboard/team')}
        />
        <ActionCard
          title="Campaigns"
          description="Browse and complete campaign tasks"
          count={data.activeCampaigns}
          type="campaigns"
          onAction={() => onNavigate('/campaigns')}
        />
      </div>
    </div>
  );
}

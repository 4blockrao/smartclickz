
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  gradient?: string;
}

export function StatCard({ title, value, change, changeType = 'neutral', icon, gradient }: StatCardProps) {
  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-3 h-3" />;
      case 'decrease':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-success-600 bg-success-50 border-success-200';
      case 'decrease':
        return 'text-danger-600 bg-danger-50 border-danger-200';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <Card className={`overflow-hidden ${gradient || 'bg-gradient-to-br from-background to-muted/30'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
            {icon}
          </div>
          {change !== undefined && (
            <Badge variant="outline" className={`text-xs ${getChangeColor()}`}>
              {getChangeIcon()}
              <span className="ml-1">{Math.abs(change)}%</span>
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  stats: {
    totalPoints: number;
    teamSize: number;
    tasksCompleted: number;
    classifiedsViewed: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        title="Total Points"
        value={stats.totalPoints.toLocaleString()}
        change={12}
        changeType="increase"
        icon={<TrendingUp className="w-4 h-4 text-primary" />}
        gradient="bg-gradient-to-br from-primary/5 to-primary/10"
      />
      <StatCard
        title="Team Members"
        value={stats.teamSize}
        change={5}
        changeType="increase"
        icon={<TrendingUp className="w-4 h-4 text-success-600" />}
        gradient="bg-gradient-to-br from-success-50 to-success-100"
      />
      <StatCard
        title="Tasks Done"
        value={stats.tasksCompleted}
        icon={<TrendingUp className="w-4 h-4 text-warning-600" />}
        gradient="bg-gradient-to-br from-warning-50 to-warning-100"
      />
      <StatCard
        title="Ads Viewed"
        value={stats.classifiedsViewed}
        icon={<TrendingUp className="w-4 h-4 text-accent-600" />}
        gradient="bg-gradient-to-br from-accent-50 to-accent-100"
      />
    </div>
  );
}

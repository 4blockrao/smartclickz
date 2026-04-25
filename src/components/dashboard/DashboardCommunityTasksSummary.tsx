
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Square, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Props {
  openCount: number;
  completedCount: number;
  pointsEarned: number;
}

export const DashboardCommunityTasksSummary: React.FC<Props> = ({
  openCount,
  completedCount,
  pointsEarned,
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg flex items-center gap-2">
        Community Tasks
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex justify-between mb-4">
        <div className="flex flex-col items-center">
          <Square className="w-5 h-5 text-yellow-400" />
          <div className="font-bold text-lg">{openCount}</div>
          <div className="text-xs text-muted-foreground">Open</div>
        </div>
        <div className="flex flex-col items-center">
          <Check className="w-5 h-5 text-green-500" />
          <div className="font-bold text-lg">{completedCount}</div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-indigo-700 text-lg">{pointsEarned}</span>
          <span className="text-xs text-muted-foreground">Points</span>
        </div>
      </div>
      <Button asChild variant="outline" className="w-full">
        <Link to="/dashboard/tasks">View all tasks</Link>
      </Button>
    </CardContent>
  </Card>
);

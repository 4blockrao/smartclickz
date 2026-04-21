
import React from "react";
import { Square, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const DashboardTasksSummary = ({
  openCount,
  completedCount,
}) => (
  <div className="flex flex-col items-center justify-between w-full bg-white shadow-lg rounded-xl p-5 border border-blue-100 min-h-[200px]">
    <div className="font-bold text-lg text-blue-700 flex items-center gap-2 mb-2">Tasks Summary</div>
    <div className="w-full flex justify-between gap-3 mb-3">
      <div className="flex flex-col items-center flex-1">
        <Square className="w-5 h-5 text-yellow-400" />
        <div className="font-bold text-base">{openCount}</div>
        <div className="text-xs text-muted-foreground">Open/New</div>
      </div>
      <div className="flex flex-col items-center flex-1">
        <Check className="w-5 h-5 text-green-500" />
        <div className="font-bold text-base">{completedCount}</div>
        <div className="text-xs text-muted-foreground">Completed</div>
      </div>
    </div>
    <Button asChild variant="outline" size="sm" className="mt-auto w-full font-semibold shadow-sm">
      <Link to="/dashboard/tasks">More</Link>
    </Button>
  </div>
);


import React from "react";
import { Card } from "@/components/ui/card";
import { Check, ListCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardTasksCard() {
  // Placeholder
  return (
    <Card className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl flex flex-col items-center">
      <ListCheck className="w-8 h-8 text-blue-600 mb-2" />
      <div className="font-bold text-lg">My Tasks</div>
      <div className="flex gap-2 mt-2">
        <span className="text-green-700 font-bold text-xl">7</span>
        <span className="text-xs text-muted-foreground">completed</span>
      </div>
      <Button variant="secondary" size="sm" className="mt-4" asChild>
        <a href="/dashboard/tasks">View Tasks</a>
      </Button>
    </Card>
  );
}

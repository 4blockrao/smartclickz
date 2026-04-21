
import React from "react";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default function DashboardAchievementsCard() {
  // Placeholder
  return (
    <Card className="p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-xl flex flex-col items-center">
      <Trophy className="w-8 h-8 text-yellow-600 mb-2" />
      <div className="font-bold text-lg">Achievements</div>
      <div className="text-xl mt-2">🏅 2</div>
      <div className="text-xs text-muted-foreground">2 major achievements unlocked!</div>
    </Card>
  );
}

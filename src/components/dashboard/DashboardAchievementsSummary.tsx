
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export const DashboardAchievementsSummary = ({
  achievements
}) => (
  <Card className="rounded-2xl border border-yellow-100 shadow-lg bg-yellow-50/90 animate-fade-in">
    <CardHeader className="pb-2 flex flex-row items-center gap-3">
      <Trophy className="w-7 h-7 text-amber-400 mr-2 drop-shadow" />
      <CardTitle className="text-lg font-extrabold text-amber-700 flex gap-2 items-center">
        Achievements
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-3 pb-3">
        <div>
          <span className="font-bold text-xl text-green-800">{achievements.earnings}</span>
          <div className="text-xs text-muted-foreground">Earnings</div>
        </div>
        <div>
          <span className="font-bold text-xl text-violet-700">{achievements.tasks}</span>
          <div className="text-xs text-muted-foreground">Tasks</div>
        </div>
        <div>
          <span className="font-bold text-xl text-indigo-800">{achievements.referrals}</span>
          <div className="text-xs text-muted-foreground">Referrals</div>
        </div>
        <div>
          <span className="font-bold text-xl text-yellow-600">{achievements.streak ?? "-"}</span>
          <div className="text-xs text-muted-foreground">Streak</div>
        </div>
      </div>
      {achievements.badgeUrl && (
        <div className="mt-2 flex justify-center">
          <img src={achievements.badgeUrl} alt="Badge" className="w-16 h-16 drop-shadow" />
        </div>
      )}
    </CardContent>
  </Card>
);

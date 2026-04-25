
import React from "react";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardTeamCard({ direct = 0, level2 = 0, level3 = 0, referralUserId = "" }) {
  // Fallback for referralUserId
  return (
    <Card className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 shadow-xl flex flex-col items-center">
      <Users className="w-8 h-8 text-primary mb-2" />
      <div className="font-bold text-lg">Your Team</div>
      <div className="text-xl mt-2">{direct}</div>
      <div className="text-xs text-muted-foreground">Team members in 3 levels</div>
      <div className="mt-1 text-xs text-muted-foreground">
        Referral User ID: <span className="font-mono">{referralUserId || "—"}</span>
      </div>
      <Button variant="secondary" size="sm" className="mt-4" asChild>
        <a href="/dashboard/team">View Team</a>
      </Button>
    </Card>
  );
}

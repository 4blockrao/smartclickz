
import React from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";


export const DashboardTeamSummary = ({
  direct,
  level2,
  level3,
  referral_link,
  user_id,
  referral_user_id
}) => (
  <div className="flex flex-col items-center justify-between w-full bg-white shadow-lg rounded-xl p-5 border border-purple-100 min-h-[200px]">
    <Users className="w-9 h-9 text-primary mb-2" />
    <div className="font-bold text-lg mb-2">My Team</div>
    <div className="w-full flex flex-row gap-2 justify-center text-center mb-2">
      <div>
        <div className="font-bold text-base text-primary">{direct}</div>
        <div className="text-xs text-muted-foreground">Direct</div>
      </div>
      <div>
        <div className="font-bold text-base text-primary">{level2}</div>
        <div className="text-xs text-muted-foreground">Level 2</div>
      </div>
      <div>
        <div className="font-bold text-base text-primary">{level3}</div>
        <div className="text-xs text-muted-foreground">Level 3</div>
      </div>
    </div>
    <div className="text-xs mb-1 text-muted-foreground">
      Referral ID: <span className="font-mono">{referral_user_id ?? "—"}</span>
    </div>
    <Button asChild variant="outline" size="sm" className="mt-2 w-full font-semibold shadow-sm">
      <Link to="/dashboard/team">More</Link>
    </Button>
  </div>
);

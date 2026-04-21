
import React from "react";
import { Users } from "lucide-react";

interface TeamStats {
  direct?: number;
  level2?: number;
  level3?: number;
}

export const ProfileTeamStats: React.FC<{ team: TeamStats }> = ({ team }) => {
  // Temporary fallback numbers
  const { direct = 0, level2 = 0, level3 = 0 } = team || {};

  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center gap-2 border mb-4 max-w-xs mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-6 h-6 text-accent" />
        <span className="font-semibold text-lg">My Team</span>
      </div>
      <div className="flex flex-row gap-6 text-center">
        <div>
          <div className="font-bold text-primary text-2xl">{direct}</div>
          <div className="text-xs text-muted-foreground">Direct</div>
        </div>
        <div>
          <div className="font-bold text-primary text-2xl">{level2}</div>
          <div className="text-xs text-muted-foreground">Level 2</div>
        </div>
        <div>
          <div className="font-bold text-primary text-2xl">{level3}</div>
          <div className="text-xs text-muted-foreground">Level 3</div>
        </div>
      </div>
    </div>
  );
};

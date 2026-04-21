
import React from "react";
import { Trophy } from "lucide-react";

// Updated: Use backend rank if available, else compute live as fallback
function computeUserRank({ points = 0, tasks = 0, teamSize = 0, badges = 0 }): { label: string; color: string } {
  const score = points + tasks * 5 + teamSize * 3 + badges * 7;
  if (score > 1200) return { label: "Legendary Networker", color: "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500" };
  if (score > 850)  return { label: "Elite Networker", color: "bg-gradient-to-r from-yellow-300 via-fuchsia-400 to-indigo-400" };
  if (score > 600)  return { label: "Pro Networker", color: "bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300" };
  if (score > 350)  return { label: "Rising Star", color: "bg-gradient-to-r from-amber-200 to-orange-200" };
  return { label: "Aspiring Networker", color: "bg-gradient-to-r from-gray-200 to-gray-300" };
}

export const ProfileRankingDisplay: React.FC<{ userMetrics: any }> = ({ userMetrics }) => {
  // Use provided rank label if present, else compute
  let label = userMetrics?.rank;
  let color = undefined;
  if (!label) {
    const fallback = computeUserRank(userMetrics || {});
    label = fallback.label;
    color = fallback.color;
  }
  // Else use a color based on the label
  if (!color) {
    switch (label) {
      case "Legendary Networker": color = "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500"; break;
      case "Elite Networker": color = "bg-gradient-to-r from-yellow-300 via-fuchsia-400 to-indigo-400"; break;
      case "Pro Networker": color = "bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300"; break;
      case "Rising Star": color = "bg-gradient-to-r from-amber-200 to-orange-200"; break;
      default: color = "bg-gradient-to-r from-gray-200 to-gray-300";
    }
  }

  return (
    <div className={`rounded-xl p-5 mb-4 flex flex-row items-center gap-4 shadow font-bold text-lg text-white ${color}`}>
      <Trophy className="text-white w-8 h-8 drop-shadow-xl" />
      <div>
        <div>{label}</div>
        <div className="text-sm font-normal text-white/80 mt-1">Networker Rank</div>
      </div>
    </div>
  );
};


import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Demo icons for various activity types
const icons: { [key: string]: string } = {
  referral: "👤",
  badge: "🎖",
  streak: "🔥",
};

type ActivityLog = {
  id: string;
  user_id: string;
  event_type: string;
  text: string;
  timestamp: string;
};

export default function MiniActivityFeed() {
  const { data: activities = [] } = useQuery<ActivityLog[]>({
    queryKey: ["dashboard-activity-feed"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_log")
        .select("id, user_id, event_type, text, timestamp")
        .order("timestamp", { ascending: false })
        .limit(10);
      if (error) {
        console.error("Error fetching activity log:", error);
        return [];
      }
      // Fallback: only return items with required fields to avoid runtime errors
      return (data ?? []).filter(
        (a: any) => a && a.id && a.event_type && a.text
      ) as ActivityLog[];
    },
  });

  return (
    <div className="bg-[#2A2A2A] p-4 rounded-xl shadow">
      <div className="text-white mb-2 font-bold text-lg flex items-center gap-1">📢 Recent Activity</div>
      <div className="space-y-2">
        {activities.length === 0 ? (
          <div className="text-slate-400 text-sm">No activity yet!</div>
        ) : (
          activities.map((a) => (
            <div key={a.id} className="flex items-center gap-2 px-2 py-2 bg-[#232533] rounded-lg">
              <span className="text-xl">{icons[a.event_type] || "✨"}</span>
              <span className="text-white text-sm flex-1">{a.text}</span>
              {/* Example for future: Like/Cheer/Comment/Share buttons */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

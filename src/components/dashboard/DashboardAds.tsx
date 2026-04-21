
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Folder } from "lucide-react";

interface ViewedAdInfo {
  id: string;
  viewed_at: string;
  classified_ad: {
    id: string;
    title: string;
  } | null;
}

export default function DashboardAds() {
  const { user } = useAuth();

  const { data: viewedAds, isLoading } = useQuery({
    queryKey: ["dashboard-viewed-ads", user?.id],
    queryFn: async (): Promise<ViewedAdInfo[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_ad_views")
        .select(`
          id,
          viewed_at, 
          classified_ad:classified_ads (
            id,
            title
          )
        `)
        .eq("user_id", user.id)
        .order("viewed_at", { ascending: false });
      if (error) {
        throw error;
      }
      return (data?.filter(item => item.classified_ad) as ViewedAdInfo[]) || [];
    },
    enabled: !!user,
  });

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="font-bold text-2xl mb-4 flex gap-2 items-center text-orange-900">
        <Folder className="w-6 h-6" /> My Viewed Classified Ads
      </h2>
      {isLoading ? <p>Loading ads...</p> :
        viewedAds && viewedAds.length > 0 ? (
          <ul className="space-y-2">
            {viewedAds.map((item) => (
              <li key={item.id} className="flex flex-col text-sm p-2 rounded-lg hover:bg-accent/40 transition-colors">
                {item.classified_ad?.id ? (
                  <Link to={`/classifieds/${item.classified_ad.id}`} className="hover:underline text-blue-600 font-semibold">
                    {item.classified_ad?.title || "Unknown Ad"}
                  </Link>
                ) : (
                  item.classified_ad?.title || "Unknown Ad"
                )}
                <span className="text-xs text-muted-foreground">Viewed: {new Date(item.viewed_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        ) : <div className="text-muted-foreground">No ads viewed yet.</div>
      }
    </div>
  );
}

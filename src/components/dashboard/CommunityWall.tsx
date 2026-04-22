
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function CommunityWall() {
  const { data: posts = [] } = useQuery({
    queryKey: ["dashboard-community-wall"],
    queryFn: async () => {
      // join with profiles for avatar/name
      const { data } = await (supabase as any)
        .from("profile_posts")
        .select("id, content, created_at, profile_id, image_url, profiles!inner(display_name, profile_image_url)")
        .order("created_at", { ascending: false })
        .limit(8);
      return data || [];
    },
  });

  return (
    <div className="bg-[#2A2A2A] rounded-xl shadow p-4">
      <div className="text-white mb-2 font-bold text-lg flex items-center gap-1">🌐 Community Wall</div>
      <div className="flex flex-col gap-3">
        {posts.length === 0 ? (
          <div className="text-slate-400 text-sm">No posts yet.</div>
        ) : (
          posts.map((p) => (
            <div key={p.id} className="bg-[#222633] rounded-lg p-3 animate-fade-in">
              <div className="flex gap-2 items-center mb-1">
                <img
                  src={p.profiles?.profile_image_url || "/placeholder.svg"}
                  alt={p.profiles?.display_name}
                  className="w-8 h-8 rounded-full object-cover border border-blue-400"
                />
                <span className="font-semibold text-white text-sm">{p.profiles?.display_name || "User"}</span>
                <span className="text-xs text-gray-400 ml-auto">{p.created_at && new Date(p.created_at).toLocaleDateString()}</span>
              </div>
              <div className="text-white text-sm">{p.content}</div>
              <div className="flex items-center mt-2 gap-3">
                <button className="text-lg text-pink-400">❤️</button>
                <button className="text-lg text-blue-300">💬</button>
                <button className="text-lg text-blue-200">↗</button>
              </div>
            </div>
          ))
        )}
        {/* + Share Update button */}
        <button className="w-full mt-2 py-2 rounded-lg bg-[#233973] text-blue-100 font-semibold">
          + Share Update
        </button>
      </div>
    </div>
  );
}


import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function LiveCommunityPreview() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["community-topics-home"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("community_topics")
        .select("id, title, author, replies, trending, created_at")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="p-4 sm:p-6 rounded-2xl bg-white/95 flex flex-col gap-4 shadow-xl hover:shadow-2xl">
      <span className="font-playfair text-2xl font-bold text-[#b46b39] mb-2">Community</span>
      <div className="flex flex-col gap-3">
        {isLoading
          ? [...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))
          : (data && data.length > 0)
          ? data.map((topic) => (
              <button
                key={topic.id}
                className="flex items-center gap-2 rounded-lg p-2 hover:bg-primary/10 transition group"
                onClick={() => navigate(`/community/${topic.id}`)}
              >
                <div className={`w-2 h-2 rounded-full ${topic.trending ? "bg-ochre" : "bg-secondary"}`} />
                <div className="flex-1 text-left">
                  <div className="font-medium">{topic.title}</div>
                  <div className="text-xs text-muted-foreground">{topic.author} • {topic.replies} replies</div>
                </div>
              </button>
            ))
          : <div className="text-sm text-muted-foreground">No topics yet.</div>
        }
      </div>
      <button className="mt-3 underline text-primary text-sm font-semibold hover:text-secondary transition" onClick={() => navigate("/#community")}>Visit community</button>
    </Card>
  );
}

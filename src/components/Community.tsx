
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Flame } from "lucide-react"; 
import { useIsMobile } from "@/hooks/use-mobile";

export default function Community() {
  const isMobile = useIsMobile();
  const { data, isLoading } = useQuery({
    queryKey: ["community_topics"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("community_topics")
        .select("*")
        .order("trending", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <h2 className="font-playfair text-2xl sm:text-3xl font-bold mb-5 sm:mb-6 text-primary">
        Community Discussions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
            ))
          : data && data.length > 0
          ? data.map(t => (
              <a
                key={t.id}
                href={t.url || "#"}
                className="relative block bg-white rounded-xl border border-slate-200 shadow p-5 hover:shadow-md transition-shadow duration-300 animate-fade-in group h-full"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-2">
                    <h3 className="font-semibold text-lg text-slate-800 group-hover:text-primary transition-colors line-clamp-2">{t.title}</h3>
                    {t.trending && (
                      <span className="inline-flex items-center gap-1 absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                        <Flame className="w-3 h-3" />
                        Trending
                      </span>
                    )}
                  </div>
                  <p className="mt-auto text-xs text-slate-500 flex items-center justify-between">
                    <span>{t.replies} replies</span>
                    <span>by {t.author}</span>
                  </p>
                </div>
              </a>
            ))
          : (
            <div className="col-span-full text-gray-500 py-10 text-center">No community topics yet.</div>
          )}
      </div>
    </div>
  );
}

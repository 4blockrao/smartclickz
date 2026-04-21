
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ClipboardList } from "lucide-react";

export default function TasksBoardPreview() {
  const navigate = useNavigate();
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["home-tasks-preview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, description, payout_points")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="rounded-2xl p-5 bg-white/95 shadow-xl flex flex-col gap-4">
      <span className="font-playfair text-2xl font-bold text-[#1A1F2C] mb-2 flex items-center gap-2">
        <ClipboardList className="h-6 w-6 text-[#9b87f5]" /> Community Tasks
      </span>
      <div className="flex flex-col gap-3">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-12 w-full rounded-lg bg-muted animate-pulse" />
          ))
        ) : (tasks && tasks.length > 0) ? (
          tasks.map((task) => (
            <div key={task.id} className="flex flex-col gap-1 p-2 rounded-lg hover:bg-accent/20 cursor-pointer transition" onClick={() => navigate(`/tasks/${task.id}`)}>
              <div className="flex items-center">
                <div className="font-semibold truncate">{task.title}</div>
                <span className="ml-auto text-xs text-[#9b87f5] font-bold">+{task.payout_points} pts</span>
              </div>
              <div className="text-xs text-muted-foreground line-clamp-1">{task.description}</div>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">No open tasks at the moment.</div>
        )}
      </div>
      <Button variant="outline" className="w-full mt-2 font-bold border-2 border-[#9b87f5]" onClick={() => navigate("/tasks")}>
        More Tasks
      </Button>
    </Card>
  );
}


import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Get the row type for points_ledger from the Database type
type PointsLedgerEntry = Database["public"]["Tables"]["points_ledger"]["Row"];

export function usePointsWallet(userId: string | undefined) {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["points-ledger", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("points_ledger")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as PointsLedgerEntry[]) ?? [];
    },
    enabled: !!userId,
  });

  // Compute balance
  const pointsBalance = data
    ? data.reduce((sum, e) => sum + (e.type === "reward" ? e.amount : -e.amount), 0)
    : 0;

  // Add real-time updates for points_ledger
  useEffect(() => {
    if (!userId) return;
    const channel = supabase.channel(`points-wallet-${userId}`)
      .on(
        "postgres_changes" as any,
        {
          event: "*",
          schema: "public",
          table: "points_ledger",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["points-ledger", userId] });
        }
      );
    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return { ledger: data ?? [], isLoading, error, pointsBalance };
}


import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LedgerRow {
  id: number;
  amount: number;        // signed: +credit / -debit
  category: string;
  balance_after: number;
  note: string | null;
  created_at: string;
}

/**
 * Wallet state backed by the unified ledger.
 * - pointsBalance comes from the authoritative cached balance (profiles.points),
 *   which post_ledger keeps in sync with the ledger.
 * - ledger is the member's own ledger_entries (signed amounts).
 */
export function usePointsWallet(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["wallet", userId],
    enabled: !!userId,
    queryFn: async () => {
      const [profRes, ledgerRes] = await Promise.all([
        supabase.from("profiles").select("points").eq("user_id", userId).maybeSingle(),
        supabase
          .from("ledger_entries")
          .select("id, amount, category, balance_after, note, created_at")
          .eq("account_type", "user")
          .eq("account_id", userId)
          .order("created_at", { ascending: false })
          .limit(300),
      ]);
      return {
        balance: Number(profRes.data?.points || 0),
        ledger: (ledgerRes.data as LedgerRow[]) ?? [],
      };
    },
  });

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`wallet-realtime-${userId}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes" as any,
        { event: "*", schema: "public", table: "ledger_entries", filter: `account_id=eq.${userId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["wallet", userId] });
          queryClient.invalidateQueries({ queryKey: ["comp-earnings", userId] });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId, queryClient]);

  return {
    ledger: data?.ledger ?? [],
    isLoading,
    error,
    pointsBalance: data?.balance ?? 0,
  };
}

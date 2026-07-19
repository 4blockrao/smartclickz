import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Crown, Check } from "lucide-react";

interface UpgradeRow {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  display_name?: string;
  email?: string;
  account_tier?: string;
}

export default function AdminProUpgrades() {
  const qc = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["pro-upgrade-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pro_upgrade_requests" as any)
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true });
      if (error) throw error;

      const rows = (data || []) as any[];
      if (rows.length === 0) return [] as UpgradeRow[];

      const ids = rows.map((r) => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, email, account_tier")
        .in("user_id", ids);
      const map = new Map((profiles || []).map((p: any) => [p.user_id, p]));
      return rows.map((r) => ({ ...r, ...(map.get(r.user_id) || {}) })) as UpgradeRow[];
    },
  });

  const approve = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.rpc("activate_pro" as any, { _user_id: userId, _days: 30 });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Pro membership activated (30 days).");
      qc.invalidateQueries({ queryKey: ["pro-upgrade-requests"] });
    },
    onError: (e: any) => toast.error(e?.message || "Failed to activate Pro."),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <div className="flex items-center gap-3 mb-6">
          <Crown className="h-7 w-7 text-yellow-500" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pro Upgrade Requests</h1>
            <p className="text-muted-foreground">Approve members requesting a Pro upgrade.</p>
          </div>
        </div>

        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground py-8 text-center">Loading…</p>
            ) : requests.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No pending requests.</p>
            ) : (
              <div className="space-y-3">
                {requests.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/40"
                  >
                    <div>
                      <div className="font-medium text-foreground">{r.display_name || "Unnamed user"}</div>
                      <div className="text-sm text-muted-foreground">{r.email || r.user_id}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Requested {new Date(r.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Button onClick={() => approve.mutate(r.user_id)} disabled={approve.isPending}>
                      <Check className="h-4 w-4 mr-2" /> Approve Pro
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

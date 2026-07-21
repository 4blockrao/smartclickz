import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, X, CreditCard, Zap, Crown } from "lucide-react";

interface ReqRow {
  id: string;
  user_id: string;
  tier: string;
  preferred_leg: string;
  status: string;
  created_at: string;
  display_name?: string;
  email?: string;
  account_tier?: string;
}

export default function AdminSubscriptions() {
  const qc = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["subscription-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_requests" as any)
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true });
      if (error) throw error;
      const rows = (data || []) as any[];
      if (rows.length === 0) return [] as ReqRow[];
      const ids = rows.map((r) => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles").select("user_id, display_name, email, account_tier").in("user_id", ids);
      const map = new Map((profiles || []).map((p: any) => [p.user_id, p]));
      return rows.map((r) => ({ ...r, ...(map.get(r.user_id) || {}) })) as ReqRow[];
    },
  });

  const approve = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc("approve_subscription_request" as any, { _id: id });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Subscription activated — member placed in the binary tree.");
      qc.invalidateQueries({ queryKey: ["subscription-requests"] });
    },
    onError: (e: any) => toast.error(e?.message || "Failed to approve."),
  });

  const reject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc("reject_subscription_request" as any, { _id: id, _note: null });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Request rejected.");
      qc.invalidateQueries({ queryKey: ["subscription-requests"] });
    },
    onError: (e: any) => toast.error(e?.message || "Failed to reject."),
  });

  const runClose = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc("run_binary_close" as any);
      if (error) throw error;
    },
    onSuccess: () => toast.success("Weekly binary close executed."),
    onError: (e: any) => toast.error(e?.message || "Failed to run close."),
  });

  const runRoyalty = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc("run_royalty" as any);
      if (error) throw error;
    },
    onSuccess: () => toast.success("Royalty distribution executed."),
    onError: (e: any) => toast.error(e?.message || "Failed to run royalty."),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="h-7 w-7 text-violet-500" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Subscriptions & Comp Plan</h1>
            <p className="text-muted-foreground">Approve package activations and run comp-plan cycles.</p>
          </div>
        </div>

        {/* Manual engine triggers */}
        <Card className="border border-border/50 mb-6">
          <CardHeader><CardTitle>Comp-plan engine</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => runClose.mutate()} disabled={runClose.isPending} variant="outline">
              <Zap className="h-4 w-4 mr-2 text-emerald-500" /> Run weekly binary close
            </Button>
            <Button onClick={() => runRoyalty.mutate()} disabled={runRoyalty.isPending} variant="outline">
              <Crown className="h-4 w-4 mr-2 text-amber-500" /> Run monthly royalty
            </Button>
            <p className="text-xs text-muted-foreground w-full mt-1">
              These also run automatically (Fri 23:00 UTC / 1st of month 01:00 UTC). Use here for a manual run.
            </p>
          </CardContent>
        </Card>

        {/* Pending activation requests */}
        <Card className="border border-border/50">
          <CardHeader><CardTitle>Pending activation requests</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground py-8 text-center">Loading…</p>
            ) : requests.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No pending requests.</p>
            ) : (
              <div className="space-y-3">
                {requests.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-4 rounded-lg border border-border/40">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{r.display_name || "Unnamed user"}</span>
                        <Badge variant="secondary" className="uppercase">{r.tier}</Badge>
                        <Badge variant="outline" className="capitalize">{r.preferred_leg} leg</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{r.email || r.user_id}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Requested {new Date(r.created_at).toLocaleDateString()}
                        {r.account_tier && r.account_tier !== "regular" ? ` · currently ${r.account_tier}` : ""}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => reject.mutate(r.id)} disabled={reject.isPending}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => approve.mutate(r.id)} disabled={approve.isPending}>
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    </div>
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

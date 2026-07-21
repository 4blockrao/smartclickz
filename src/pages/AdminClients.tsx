import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Building, Wallet } from "lucide-react";

interface ClientRow {
  id: string;
  company_name: string;
  business_email: string | null;
  verification_status: string | null;
  wallet_balance: number | null;
  total_spent: number | null;
}

export default function AdminClients() {
  const qc = useQueryClient();
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, company_name, business_email, verification_status, wallet_balance, total_spent")
        .order("company_name", { ascending: true });
      if (error) throw error;
      return (data || []) as ClientRow[];
    },
  });

  const credit = useMutation({
    mutationFn: async ({ clientId, amount }: { clientId: string; amount: number }) => {
      const { error } = await supabase.rpc("grant_credits" as any, {
        _client_id: clientId,
        _credits: amount,
      });
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      toast.success("Wallet credited.");
      setAmounts((a) => ({ ...a, [vars.clientId]: "" }));
      qc.invalidateQueries({ queryKey: ["admin-clients"] });
    },
    onError: (e: any) => toast.error(e?.message || "Failed to credit wallet."),
  });

  const submit = (clientId: string) => {
    const amount = parseFloat(amounts[clientId] || "");
    if (!amount || amount <= 0) {
      toast.error("Enter a positive amount.");
      return;
    }
    credit.mutate({ clientId, amount });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto max-w-5xl py-8 px-4">
        <div className="flex items-center gap-3 mb-6">
          <Building className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Advertisers</h1>
            <p className="text-muted-foreground">Manage advertiser accounts and fund their wallets.</p>
          </div>
        </div>

        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground py-8 text-center">Loading…</p>
            ) : clients.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No advertisers yet.</p>
            ) : (
              <div className="space-y-3">
                {clients.map((c) => (
                  <div
                    key={c.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg border border-border/40"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{c.company_name}</span>
                        <Badge variant="outline" className="capitalize">{c.verification_status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{c.business_email}</div>
                      <div className="text-sm mt-1">
                        <span className="text-muted-foreground">Balance:</span>{" "}
                        <span className="font-semibold text-foreground">{Number(c.wallet_balance) || 0}</span>
                        <span className="text-muted-foreground ml-4">Spent:</span>{" "}
                        <span className="font-semibold text-foreground">{Number(c.total_spent) || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        placeholder="Credits ($1=1000)"
                        value={amounts[c.id] || ""}
                        onChange={(e) => setAmounts((a) => ({ ...a, [c.id]: e.target.value }))}
                        className="w-32"
                      />
                      <Button onClick={() => submit(c.id)} disabled={credit.isPending}>
                        Credit
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

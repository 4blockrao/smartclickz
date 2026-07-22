import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Landmark } from "lucide-react";

const usd = (c: number) => `$${(Number(c || 0) / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
const CATEGORY_LABEL: Record<string, string> = {
  deposit: "Deposit", campaign_reserve: "Campaign reserve", campaign_spend: "Campaign spend",
  task_reward: "Task reward", commission: "Binary match", matching_bonus: "Matching bonus",
  royalty: "Royalty", subscription: "Subscription", withdrawal: "Withdrawal", refund: "Refund",
  adjustment: "Adjustment", opening_balance: "Opening balance",
};

export default function AdminLedger() {
  const [accType, setAccType] = useState("all");
  const [category, setCategory] = useState("all");

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-ledger"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ledger_entries")
        .select("id, account_type, account_id, category, amount, balance_after, note, created_at")
        .order("id", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return data || [];
    },
  });

  const sumBy = (pred: (r: any) => boolean) => rows.filter(pred).reduce((s: number, r: any) => s + Number(r.amount), 0);
  const deposits = sumBy((r) => r.category === "deposit");
  const earnings = sumBy((r) => ["task_reward", "commission", "matching_bonus", "royalty"].includes(r.category));
  const withdrawalsNet = -sumBy((r) => r.category === "withdrawal") - sumBy((r) => r.category === "refund");
  const subscriptions = sumBy((r) => r.category === "subscription");

  const filtered = rows.filter((r: any) =>
    (accType === "all" || r.account_type === accType) &&
    (category === "all" || r.category === category)
  );

  const cards = [
    ["Advertiser deposits", usd(deposits), ArrowDownToLine, "text-emerald-500"],
    ["Member earnings paid", usd(earnings), TrendingUp, "text-sky-500"],
    ["Withdrawals (net)", usd(withdrawalsNet), ArrowUpFromLine, "text-orange-500"],
    ["Subscription revenue", usd(subscriptions), Landmark, "text-violet-500"],
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto max-w-6xl py-8 px-4">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-7 w-7 text-violet-500" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ledger</h1>
            <p className="text-muted-foreground">Every credit movement across members, advertisers, and the platform.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {cards.map(([label, val, Icon, tint]) => (
            <Card key={label as string}>
              <CardContent className="p-4">
                <Icon className={`h-5 w-5 ${tint} mb-2`} />
                <div className="text-xl font-bold text-foreground">{val as string}</div>
                <div className="text-xs text-muted-foreground">{label as string}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
            <CardTitle>Entries</CardTitle>
            <div className="flex gap-2">
              <Select value={accType} onValueChange={setAccType}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Account" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All accounts</SelectItem>
                  <SelectItem value="user">Members</SelectItem>
                  <SelectItem value="client">Advertisers</SelectItem>
                  <SelectItem value="platform">Platform</SelectItem>
                </SelectContent>
              </Select>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-44"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {Object.keys(CATEGORY_LABEL).map((c) => (
                    <SelectItem key={c} value={c}>{CATEGORY_LABEL[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground py-8 text-center">Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No entries.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[720px]">
                  <thead className="text-muted-foreground border-b">
                    <tr>
                      <th className="text-left py-2 font-medium">Date</th>
                      <th className="text-left py-2 font-medium">Account</th>
                      <th className="text-left py-2 font-medium">Category</th>
                      <th className="text-left py-2 font-medium">Note</th>
                      <th className="text-right py-2 font-medium">Amount</th>
                      <th className="text-right py-2 font-medium">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r: any) => (
                      <tr key={r.id} className="border-b border-border/40">
                        <td className="py-2.5 text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</td>
                        <td className="py-2.5">
                          <Badge variant="outline" className="capitalize">{r.account_type}</Badge>
                          <span className="text-muted-foreground ml-2 font-mono text-xs">{r.account_id ? String(r.account_id).slice(0, 8) : "—"}</span>
                        </td>
                        <td className="py-2.5">{CATEGORY_LABEL[r.category] || r.category}</td>
                        <td className="py-2.5 text-muted-foreground max-w-[220px] truncate">{r.note || "—"}</td>
                        <td className={`py-2.5 text-right font-semibold ${Number(r.amount) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                          {Number(r.amount) >= 0 ? "+" : "-"}{usd(Math.abs(Number(r.amount)))}
                        </td>
                        <td className="py-2.5 text-right text-muted-foreground">{usd(r.balance_after)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

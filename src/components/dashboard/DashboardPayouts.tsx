import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Gauge, Zap, Users, Crown, ArrowUpRight, Sparkles,
  TrendingUp, Gift, Target, Wallet,
} from "lucide-react";

// 1000 credits = $1
const usd = (credits: number) => `$${(Number(credits || 0) / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
const cr = (n: number) => Number(n || 0).toLocaleString();
const daysLeft = (iso?: string | null) => {
  if (!iso) return 0;
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));
};

const TYPE_META: Record<string, { label: string; icon: any; tint: string }> = {
  task_reward:    { label: "Task reward",    icon: Target,      tint: "text-sky-400" },
  commission:     { label: "Binary match",   icon: TrendingUp,  tint: "text-emerald-400" },
  matching_bonus: { label: "Matching bonus", icon: Users,       tint: "text-violet-400" },
  royalty:        { label: "Royalty",        icon: Crown,       tint: "text-amber-400" },
  reward:         { label: "Reward",         icon: Gift,        tint: "text-sky-400" },
};

export default function DashboardPayouts() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["comp-earnings", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const [cycleRes, nodeRes, ledgerRes, profileRes] = await Promise.all([
        supabase.from("comp_cap_cycles").select("*").eq("user_id", user!.id)
          .eq("status", "active").order("started_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("binary_nodes").select("left_carry,right_carry,matched_volume_total,left_id,right_id").eq("user_id", user!.id).maybeSingle(),
        supabase.from("ledger_entries").select("amount,category,note,created_at").eq("account_type", "user").eq("account_id", user!.id)
          .order("created_at", { ascending: false }).limit(200),
        supabase.from("profiles").select("account_tier").eq("user_id", user!.id).maybeSingle(),
      ]);

      let tier: any = null;
      const tierName = profileRes.data?.account_tier;
      if (tierName) {
        const { data: t } = await supabase.from("membership_tiers")
          .select("name,display_label,base_task_rate,booster_task_rate,annual_price,is_paid,royalty_eligible")
          .eq("name", tierName).maybeSingle();
        tier = t;
      }
      return { cycle: cycleRes.data, node: nodeRes.data, ledger: ledgerRes.data || [], tier };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-9 w-9 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  const cycle = data?.cycle;
  const node = data?.node;
  const tier = data?.tier;
  const ledger = data?.ledger || [];

  // ----- No active paid subscription: upsell -----
  if (!cycle || !tier?.is_paid) {
    return (
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardContent className="text-center py-14 px-8">
          <div className="mx-auto mb-5 h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Unlock the earning plan</h3>
          <p className="text-slate-300 max-w-md mx-auto mb-6">
            You're on the free tier. Activate a package to double your task rate, earn binary
            commissions and matching bonuses, and open your earning cap.
          </p>
          <Link to="/packages">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white">
              View packages <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // ----- Derived figures -----
  const capUsed = Number(cycle.earned_credits || 0);
  const capTotal = Number(cycle.cap_credits || 0);
  const capPct = capTotal ? Math.min(100, (capUsed / capTotal) * 100) : 0;

  const today = ledger
    .filter((e: any) => Number(e.amount) > 0 && new Date(e.created_at).toDateString() === new Date().toDateString())
    .reduce((s: number, e: any) => s + Number(e.amount), 0);
  const dailyCap = Number(cycle.daily_cap_credits || 0);
  const dailyPct = dailyCap ? Math.min(100, (today / dailyCap) * 100) : 0;

  const boosted = Number(cycle.cap_multiplier) >= Number(cycle.cap_multiplier_boost);
  const salesLeftDays = daysLeft(cycle.direct_sales_deadline);
  const boosterLeftDays = daysLeft(cycle.booster_deadline);

  const left = Number(node?.left_carry || 0);
  const right = Number(node?.right_carry || 0);
  const matchedTotal = Number(node?.matched_volume_total || 0);
  const pendingMatch = Math.min(left, right);
  const estCommission = pendingMatch * 0.1 * 1000; // USD -> credits

  const sums = ledger.reduce((acc: Record<string, number>, e: any) => {
    if (Number(e.amount) > 0) acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Hero: cap + tier */}
      <Card className="bg-gradient-to-br from-emerald-900 to-teal-900 border-emerald-700">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-emerald-200 text-sm flex items-center gap-1.5">
                <Wallet className="h-4 w-4" /> Earned this cycle
              </p>
              <p className="text-4xl font-extrabold text-white mt-1">{usd(capUsed)}</p>
              <p className="text-emerald-300/80 text-xs mt-0.5">{cr(capUsed)} credits</p>
            </div>
            <Badge className="bg-white/15 text-white border-0 uppercase tracking-wide">
              {tier.display_label}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm text-emerald-100 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Gauge className="h-4 w-4" /> Cap {boosted ? "3×" : "2×"} · {usd(capUsed)} / {usd(capTotal)}
            </span>
            <span>{capPct.toFixed(0)}%</span>
          </div>
          <Progress value={capPct} className="h-2 bg-emerald-950" />

          {!boosted && (
            <p className="text-emerald-200/90 text-xs mt-3 flex items-center gap-1.5">
              <ArrowUpRight className="h-3.5 w-3.5" />
              Unlock the 3× cap: {cycle.direct_sales_count}/2 direct sales
              {salesLeftDays > 0 ? ` · ${salesLeftDays} day${salesLeftDays === 1 ? "" : "s"} left` : " · window closed"}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Daily cap + Booster */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Gauge className="h-4 w-4 text-sky-400" /> Today's cap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-slate-300 mb-1.5">
              <span>{usd(today)} / {usd(dailyCap)}</span>
              <span>{dailyPct.toFixed(0)}%</span>
            </div>
            <Progress value={dailyPct} className="h-2 bg-slate-900" />
            <p className="text-slate-500 text-xs mt-2">Resets daily. Covers tasks + commissions together.</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" /> Booster
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cycle.booster_done ? (
              <>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0">Active</Badge>
                <p className="text-slate-300 text-sm mt-2">
                  Task rate doubled: <span className="text-white font-semibold">{tier.booster_task_rate} credits/task</span>.
                </p>
              </>
            ) : (
              <>
                <Badge className="bg-amber-500/20 text-amber-400 border-0">Locked</Badge>
                <p className="text-slate-300 text-sm mt-2">
                  Refer 1 on your left and 1 on your right
                  {boosterLeftDays > 0 ? ` within ${boosterLeftDays} day${boosterLeftDays === 1 ? "" : "s"}` : ""} to
                  double your rate from {tier.base_task_rate} → {tier.booster_task_rate} credits/task.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Binary legs */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-violet-400" /> Binary volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-900/60 p-4 text-center">
              <p className="text-slate-400 text-xs mb-1">Left leg</p>
              <p className="text-xl font-bold text-white">${left.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-slate-900/60 p-4 text-center">
              <p className="text-slate-400 text-xs mb-1">Right leg</p>
              <p className="text-xl font-bold text-white">${right.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-400">Pending match (weaker leg)</span>
            <span className="text-white font-medium">${pendingMatch.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">Est. next weekly commission (10%)</span>
            <span className="text-emerald-400 font-semibold">{usd(estCommission)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">Lifetime matched volume</span>
            <span className="text-white font-medium">${matchedTotal.toLocaleString()}</span>
          </div>
          <p className="text-slate-500 text-xs mt-3">Matches settle weekly (Friday). Unmatched volume carries over.</p>
        </CardContent>
      </Card>

      {/* Income breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["task_reward", "commission", "matching_bonus", "royalty"] as const).map((t) => {
          const meta = TYPE_META[t];
          const Icon = meta.icon;
          return (
            <div key={t} className="rounded-xl bg-slate-800/50 border border-slate-700 p-4">
              <Icon className={`h-4 w-4 ${meta.tint} mb-2`} />
              <p className="text-slate-400 text-xs">{meta.label}</p>
              <p className="text-white font-bold mt-0.5">{usd(sums[t] || 0)}</p>
            </div>
          );
        })}
      </div>

      {/* Ledger */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-base">Earnings history</CardTitle>
        </CardHeader>
        <CardContent>
          {ledger.length === 0 ? (
            <p className="text-slate-500 text-sm py-6 text-center">No earnings yet — complete tasks or build your team to start earning.</p>
          ) : (
            <div className="space-y-2">
              {ledger.slice(0, 40).map((e: any, i: number) => {
                const meta = TYPE_META[e.category] || { label: e.category, icon: Gift, tint: "text-slate-400" };
                const Icon = meta.icon;
                const positive = Number(e.amount) > 0;
                return (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                      <Icon className={`h-4 w-4 ${meta.tint}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white truncate">{e.note || meta.label}</p>
                      <p className="text-xs text-slate-500">
                        {meta.label} · {new Date(e.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-sm font-semibold shrink-0 ${positive ? "text-emerald-400" : "text-rose-400"}`}>
                      {positive ? "+" : ""}{usd(e.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

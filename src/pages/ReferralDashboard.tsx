import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import DashboardPayouts from "@/components/dashboard/DashboardPayouts";
import { TeamTierList } from "@/components/dashboard/TeamTierList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Users, TrendingUp, Crown, DollarSign, Copy, Share2, Network, CheckCircle2,
} from "lucide-react";

const usd = (credits: number) => `$${(Number(credits || 0) / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const ReferralDashboard: React.FC = () => {
  const { user, userProfile } = useAuth();

  const { data } = useQuery({
    queryKey: ["referral-real", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const [profileRes, directRes, binaryRes, ledgerRes, cycleRes, tiersRes] = await Promise.all([
        supabase.from("profiles").select("account_tier, referral_user_id, team_level1, team_level2, team_level3").eq("user_id", user!.id).maybeSingle(),
        supabase.from("user_referrals").select("id", { count: "exact", head: true }).eq("referrer_id", user!.id),
        supabase.from("binary_nodes").select("left_carry, right_carry, matched_volume_total").eq("user_id", user!.id).maybeSingle(),
        supabase.from("points_ledger").select("amount, type, created_at").eq("user_id", user!.id).in("type", ["commission", "matching_bonus", "royalty"]),
        supabase.from("comp_cap_cycles").select("*").eq("user_id", user!.id).eq("status", "active").order("started_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("membership_tiers").select("*").eq("is_paid", true).order("sort_order"),
      ]);

      const ledger = ledgerRes.data || [];
      const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
      const totalCommissions = ledger.reduce((s: number, e: any) => s + Number(e.amount), 0);
      const monthCommissions = ledger.filter((e: any) => new Date(e.created_at) >= monthStart).reduce((s: number, e: any) => s + Number(e.amount), 0);

      return {
        profile: profileRes.data,
        directCount: directRes.count || 0,
        binary: binaryRes.data,
        totalCommissions, monthCommissions,
        cycle: cycleRes.data,
        tiers: tiersRes.data || [],
      };
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="text-center py-12 px-8">
            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
            <p className="text-slate-300 mb-6">Please log in to access your team dashboard</p>
            <button onClick={() => (window.location.href = "/auth")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">Log In</button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const profile = data?.profile;
  const code = profile?.referral_user_id || userProfile?.referral_user_id || "—";
  const link = `${window.location.origin}/auth?ref=${code}`;
  const l1 = profile?.team_level1 || data?.directCount || 0;
  const l2 = profile?.team_level2 || 0;
  const l3 = profile?.team_level3 || 0;
  const left = Number(data?.binary?.left_carry || 0);
  const right = Number(data?.binary?.right_carry || 0);
  const matched = Number(data?.binary?.matched_volume_total || 0);
  const currentTier = profile?.account_tier || "regular";

  const copy = () => { navigator.clipboard.writeText(link); toast({ title: "Link copied!", description: "Your referral link is on the clipboard." }); };
  const share = () => {
    if (navigator.share) navigator.share({ title: "Join SmartClicks", text: "Earn for completing simple tasks.", url: link });
    else copy();
  };

  // team tiers (My Team tab)
  const { data: teamTiers = [] } = useQuery({
    queryKey: ["team-tiers", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const result: any[] = [];
      let ids = [user!.id];
      for (let level = 1; level <= 3; level++) {
        if (ids.length === 0) break;
        const { data: refs } = await supabase.from("user_referrals").select("user_id, referred_at").in("referrer_id", ids);
        if (!refs || refs.length === 0) break;
        const uids = refs.map((r) => r.user_id);
        const { data: profs } = await supabase.from("profiles")
          .select("user_id, display_name, referral_user_id, account_tier").in("user_id", uids);
        const map = new Map((profs || []).map((p: any) => [p.user_id, p]));
        const users = refs.map((r) => ({ user_id: r.user_id, referred_at: r.referred_at, status: map.get(r.user_id) ? "activated" : "pending", ...(map.get(r.user_id) || {}) }));
        result.push({ level, users });
        ids = users.map((u) => u.user_id);
      }
      return result;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Team & Referrals</h1>
          <p className="text-slate-300">Build your binary team, earn commissions, and grow your network.</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto bg-slate-800/50 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600"><TrendingUp className="w-4 h-4 mr-2" />Overview</TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-blue-600"><Users className="w-4 h-4 mr-2" />My Team</TabsTrigger>
            <TabsTrigger value="plan" className="data-[state=active]:bg-blue-600"><Crown className="w-4 h-4 mr-2" />Plan</TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-blue-600"><DollarSign className="w-4 h-4 mr-2" />Earnings</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
                <CardContent className="p-6 flex items-center justify-between">
                  <div><p className="text-blue-200 text-sm">Total team</p><p className="text-3xl font-bold text-white">{l1 + l2 + l3}</p><p className="text-blue-200 text-xs">across 3 levels</p></div>
                  <Users className="w-9 h-9 text-blue-400" />
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-emerald-500/30">
                <CardContent className="p-6 flex items-center justify-between">
                  <div><p className="text-emerald-200 text-sm">Total commissions</p><p className="text-3xl font-bold text-white">{usd(data?.totalCommissions || 0)}</p><p className="text-emerald-200 text-xs">all time</p></div>
                  <DollarSign className="w-9 h-9 text-emerald-400" />
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-violet-500/20 to-violet-600/20 border-violet-500/30">
                <CardContent className="p-6 flex items-center justify-between">
                  <div><p className="text-violet-200 text-sm">This month</p><p className="text-3xl font-bold text-white">{usd(data?.monthCommissions || 0)}</p><p className="text-violet-200 text-xs">commissions</p></div>
                  <TrendingUp className="w-9 h-9 text-violet-400" />
                </CardContent>
              </Card>
            </div>

            {/* Referral link */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="flex items-center gap-2 text-white"><Share2 className="w-5 h-5 text-blue-400" />Your referral link</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <input readOnly value={link} className="flex-1 bg-slate-700 border-slate-600 text-white px-3 py-2 rounded-md text-sm" />
                  <Button onClick={copy} size="sm" variant="outline" className="border-slate-600"><Copy className="w-4 h-4" /></Button>
                  <Button onClick={share} size="sm" className="bg-blue-600 hover:bg-blue-700"><Share2 className="w-4 h-4" /></Button>
                </div>
                <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                  <span className="text-slate-300 text-sm">Referral code</span>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{code}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Binary + levels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader><CardTitle className="flex items-center gap-2 text-white"><Network className="w-5 h-5 text-violet-400" />Binary volume</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-900/60 p-4 text-center"><p className="text-slate-400 text-xs mb-1">Left leg</p><p className="text-xl font-bold text-white">${left.toLocaleString()}</p></div>
                    <div className="rounded-xl bg-slate-900/60 p-4 text-center"><p className="text-slate-400 text-xs mb-1">Right leg</p><p className="text-xl font-bold text-white">${right.toLocaleString()}</p></div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm"><span className="text-slate-400">Lifetime matched</span><span className="text-white font-medium">${matched.toLocaleString()}</span></div>
                  <p className="text-slate-500 text-xs mt-2">Matches settle weekly. See Earnings for commission detail.</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader><CardTitle className="flex items-center gap-2 text-white"><Users className="w-5 h-5 text-blue-400" />Team by level</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[["Level 1 (direct)", l1, "text-blue-400"], ["Level 2", l2, "text-emerald-400"], ["Level 3", l3, "text-violet-400"]].map(([label, n, tint]: any) => (
                    <div key={label} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                      <span className={`font-medium ${tint}`}>{label}</span>
                      <span className="text-xl font-bold text-white">{n}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* MY TEAM */}
          <TabsContent value="team" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="flex items-center gap-2 text-white"><Users className="w-6 h-6 text-blue-400" />Team structure & members</CardTitle></CardHeader>
              <CardContent><TeamTierList tiers={teamTiers} /></CardContent>
            </Card>
          </TabsContent>

          {/* PLAN (real comp plan) */}
          <TabsContent value="plan" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">How you earn</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {[
                  ["Task rewards", "A flat rate per approved task — doubles once your Booster is unlocked."],
                  ["Binary match", "10% of your weaker-leg volume each week; the stronger leg carries over."],
                  ["Matching bonus", "10% of the binary commission your direct referrals earn."],
                  ["Royalty", "Diamond members share a pool funded by real revenue (cap-exempt)."],
                ].map(([t, d]) => (
                  <div key={t} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div><span className="text-white font-medium">{t}</span><p className="text-slate-400">{d}</p></div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader><CardTitle className="text-white">Package tiers</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-700">
                        <th className="text-left py-2 font-medium">Tier</th>
                        <th className="text-right py-2 font-medium">Price/yr</th>
                        <th className="text-right py-2 font-medium">Tasks/day</th>
                        <th className="text-right py-2 font-medium">Rate</th>
                        <th className="text-right py-2 font-medium">Match/pair</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.tiers || []).map((t: any) => (
                        <tr key={t.name} className={`border-b border-slate-800 ${currentTier === t.name ? "bg-violet-500/10" : ""}`}>
                          <td className="py-2.5 text-white font-medium">
                            {t.display_label}
                            {currentTier === t.name && <Badge className="ml-2 bg-violet-500/20 text-violet-300 border-0 text-[10px]">You</Badge>}
                          </td>
                          <td className="py-2.5 text-right text-slate-300">${Number(t.annual_price)}</td>
                          <td className="py-2.5 text-right text-slate-300">{t.daily_task_allowance}</td>
                          <td className="py-2.5 text-right text-slate-300">{t.base_task_rate}→{t.booster_task_rate}</td>
                          <td className="py-2.5 text-right text-slate-300">{Math.round(Number(t.binary_commission_pct) * 100)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-slate-500 text-xs mt-3">All income is capped at 2× your package (3× after 2 direct sales within 10 days), except royalty.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EARNINGS (already real) */}
          <TabsContent value="earnings" className="space-y-6">
            <DashboardPayouts />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReferralDashboard;

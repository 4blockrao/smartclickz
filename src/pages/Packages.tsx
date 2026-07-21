import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle2, Star, Crown, Sparkles, Clock, ArrowLeftRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const featureList = (t: any): string[] => [
  `${t.daily_task_allowance} tasks/day`,
  `${t.base_task_rate} → ${t.booster_task_rate} credits/task (Booster)`,
  `Earn up to ${Number(t.cap_multiplier_base)}× (${Number(t.cap_multiplier_boost)}× with 2 direct sales)`,
  `${Math.round(Number(t.binary_commission_pct) * 100)}% binary match + ${Math.round(Number(t.matching_bonus_pct) * 100)}% matching bonus`,
  t.royalty_eligible ? "Lifetime royalty eligibility" : "Weekly binary payouts",
];

const Packages: React.FC = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [dialogTier, setDialogTier] = useState<any | null>(null);
  const [leg, setLeg] = useState<"left" | "right">("left");
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["packages-tiers", user?.id],
    queryFn: async () => {
      const [tiersRes, profileRes, reqRes] = await Promise.all([
        supabase.from("membership_tiers").select("*").eq("is_paid", true).order("sort_order"),
        supabase.from("profiles").select("account_tier").eq("user_id", user?.id).maybeSingle(),
        supabase.from("subscription_requests").select("tier,status,preferred_leg")
          .eq("user_id", user?.id).eq("status", "pending").maybeSingle(),
      ]);
      return {
        tiers: tiersRes.data || [],
        currentTier: profileRes.data?.account_tier || "regular",
        pending: reqRes.data || null,
      };
    },
    enabled: !!user,
  });

  const submitRequest = async () => {
    if (!dialogTier) return;
    setSubmitting(true);
    const { error } = await supabase.rpc("request_subscription", {
      _tier: dialogTier.name,
      _leg: leg,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Couldn't submit", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Request submitted",
      description: `Your ${dialogTier.display_label} activation is pending review. You'll be placed on your ${leg} leg once approved.`,
    });
    setDialogTier(null);
    qc.invalidateQueries({ queryKey: ["packages-tiers", user?.id] });
  };

  const tiers = data?.tiers || [];
  const current = data?.currentTier || "regular";
  const pending = data?.pending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Membership packages</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Activate a package to raise your daily task allowance, unlock the Booster, and earn
            binary commissions. Earnings depend on your activity and are capped — nothing is guaranteed.
          </p>
          <Link to="/plan" className="inline-block mt-4 text-sm text-violet-400 hover:text-violet-300 underline underline-offset-4">
            Read the full compensation plan →
          </Link>
        </div>

        {pending && (
          <Card className="mb-8 bg-amber-500/10 border-amber-500/30 max-w-3xl mx-auto">
            <CardContent className="py-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-amber-200 text-sm">
                Your <span className="font-semibold uppercase">{pending.tier}</span> activation is
                pending admin approval ({pending.preferred_leg} leg).
              </p>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-9 w-9 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {tiers.map((t: any) => {
              const isCurrent = current === t.name;
              const popular = t.name === "elite";
              return (
                <Card
                  key={t.name}
                  className={cn(
                    "relative bg-slate-800/50 border-slate-700 flex flex-col",
                    popular && "ring-2 ring-violet-500/50"
                  )}
                >
                  {popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-0.5">
                        <Star className="w-3 h-3 mr-1" /> Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-3">
                    <div className="mx-auto mb-2 h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                      {t.royalty_eligible ? <Crown className="h-5 w-5 text-white" /> : <Sparkles className="h-5 w-5 text-white" />}
                    </div>
                    <CardTitle className="text-xl font-bold text-white">{t.display_label}</CardTitle>
                    <div className="text-3xl font-extrabold text-violet-400 mt-1">${Number(t.annual_price)}</div>
                    <div className="text-xs text-slate-400">per year</div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <ul className="space-y-2 flex-1">
                      {featureList(t).map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => { setDialogTier(t); setLeg("left"); }}
                      disabled={isCurrent || !!pending}
                      className={cn(
                        "w-full mt-5 font-semibold text-white",
                        popular ? "bg-violet-600 hover:bg-violet-700" : "bg-slate-700 hover:bg-slate-600"
                      )}
                    >
                      {isCurrent ? "Current plan" : pending ? "Pending…" : current === "regular" ? "Activate" : "Switch / Upgrade"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* How it works */}
        <Card className="bg-slate-800/50 border-slate-700 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl text-white text-center">How it works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                ["1", "Activate a package", "Pick a tier — it sets your daily task allowance and earning cap."],
                ["2", "Complete tasks & build your team", "Earn a flat rate per task; add a left + right referral to unlock the Booster."],
                ["3", "Earn within your cap", "Binary matches settle weekly. Make 2 direct sales to lift your cap from 2× to 3×."],
              ].map(([n, title, body]) => (
                <div key={n} className="text-center">
                  <div className="w-10 h-10 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-violet-400">{n}</span>
                  </div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-slate-400 text-sm">{body}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Placement leg picker */}
      <Dialog open={!!dialogTier} onOpenChange={(o) => !o && setDialogTier(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Activate {dialogTier?.display_label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Choose which leg of your binary team to build under. New members you refer will be
              placed here.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(["left", "right"] as const).map((side) => (
                <button
                  key={side}
                  onClick={() => setLeg(side)}
                  className={cn(
                    "rounded-xl border p-4 text-center transition capitalize",
                    leg === side
                      ? "border-violet-500 bg-violet-500/15 text-white"
                      : "border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800"
                  )}
                >
                  <ArrowLeftRight className="h-4 w-4 mx-auto mb-1 opacity-70" />
                  {side} leg
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Activation is reviewed by an admin. You'll be notified once your ${Number(dialogTier?.annual_price)} {dialogTier?.display_label} plan is live.
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogTier(null)} className="text-slate-300">Cancel</Button>
            <Button onClick={submitRequest} disabled={submitting} className="bg-violet-600 hover:bg-violet-700 text-white">
              {submitting ? "Submitting…" : "Submit request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Packages;

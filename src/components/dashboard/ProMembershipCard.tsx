import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Crown, Check, Zap } from "lucide-react";

interface WeeklyProgress {
  earned: number;
  minimum: number;
  shortfall: number;
}

/**
 * Membership widget: shows the user's tier, and either the Pro weekly-minimum
 * progress (Pro) or an upgrade CTA (Regular). Upgrade files a request that an
 * admin activates (no self-serve free upgrade; real checkout is a follow-up).
 */
export default function ProMembershipCard() {
  const { user } = useAuth();
  const [tier, setTier] = useState<string>("regular");
  const [proTier, setProTier] = useState<any>(null);
  const [progress, setProgress] = useState<WeeklyProgress | null>(null);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!user) return;
      const [{ data: profile }, { data: tiers }, { data: reqs }] = await Promise.all([
        supabase.from("profiles").select("account_tier").eq("user_id", user.id).maybeSingle(),
        supabase.from("membership_tiers" as any).select("*").eq("name", "pro").maybeSingle(),
        supabase.from("pro_upgrade_requests" as any).select("id").eq("user_id", user.id).eq("status", "pending"),
      ]);
      if (!active) return;
      const t = (profile as any)?.account_tier || "regular";
      setTier(t);
      setProTier(tiers);
      setPending(Array.isArray(reqs) && reqs.length > 0);
      if (t === "pro") {
        const { data } = await supabase.rpc("pro_weekly_progress" as any, { _user_id: user.id });
        if (active && Array.isArray(data) && data.length) setProgress(data[0] as WeeklyProgress);
      }
      setLoading(false);
    })();
    return () => { active = false; };
  }, [user?.id]);

  const requestUpgrade = async () => {
    setSubmitting(true);
    const { error } = await supabase.rpc("request_pro_upgrade" as any);
    setSubmitting(false);
    if (error) { toast.error("Could not submit request."); return; }
    setPending(true);
    toast.success("Pro upgrade requested — an admin will activate it shortly.");
  };

  if (!user || loading) return null;

  const isPro = tier === "pro";
  const pct = progress && progress.minimum > 0
    ? Math.min(100, Math.round((progress.earned / progress.minimum) * 100))
    : 0;
  const features: string[] = proTier?.features || [
    "2x points on every activity",
    "Guaranteed weekly points",
    "Priority task matching",
  ];

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Crown className={`w-5 h-5 ${isPro ? "text-yellow-400" : "text-slate-400"}`} />
          Membership
          <Badge className={`ml-2 ${isPro ? "bg-yellow-500/20 text-yellow-300" : "bg-slate-500/20 text-slate-300"}`}>
            {isPro ? "Pro" : "Regular"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPro ? (
          <>
            <p className="text-slate-300 text-sm">You earn 2× points on every activity.</p>
            {progress && progress.minimum > 0 && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">This week's minimum</span>
                  <span className="text-white">{progress.earned} / {progress.minimum} pts</span>
                </div>
                <Progress value={pct} className="h-3" />
                <p className="text-xs text-slate-400 mt-2">
                  {progress.shortfall > 0
                    ? `${progress.shortfall} pts to your guaranteed weekly minimum — we top up any shortfall.`
                    : "Weekly minimum reached. 🎉"}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="text-slate-300 text-sm">Upgrade to Pro and earn more on everything you do.</p>
            <ul className="space-y-2">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-200">
                  <Check className="w-4 h-4 text-green-400" /> {f}
                </li>
              ))}
            </ul>
            {pending ? (
              <Badge className="bg-blue-500/20 text-blue-300">Upgrade requested — pending activation</Badge>
            ) : (
              <Button
                onClick={requestUpgrade}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-semibold"
              >
                <Zap className="w-4 h-4 mr-2" />
                {submitting ? "Requesting…" : `Go Pro${proTier?.monthly_price ? ` — $${proTier.monthly_price}/mo` : ""}`}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

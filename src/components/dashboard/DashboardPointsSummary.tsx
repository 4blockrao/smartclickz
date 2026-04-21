
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Coins, Gift, Award } from "lucide-react";
import { usePointsWallet } from "@/hooks/usePointsWallet";
import { useAuth } from "@/hooks/useAuth";
import { useReferrals } from "@/hooks/useReferrals";
import { CommissionLevelsStatus } from "./CommissionLevelsStatus";

export function DashboardPointsSummary({
  pointsBalance,
}) {
  const { user } = useAuth();
  const { ledger } = usePointsWallet(user?.id);

  // Fixed: Use the hook without parameters and get myReferrals from the return value
  const { myReferrals } = useReferrals();
  const directs = myReferrals?.length || 0;

  // Quick sum by activity
  const sum = (filterFn: (entry: any) => boolean) =>
    ledger.filter(filterFn).reduce((a, b) => a + b.amount, 0);

  const totalCommunity = sum((e) => e.event_code && e.event_code.startsWith("task_"));
  const totalOnboarding = sum((e) => e.event_code && e.event_code.startsWith("onboarding_"));
  const totalReferral = sum((e) => e.event_code && e.event_code.startsWith("referral"));

  return (
    <div className="flex flex-col items-center justify-between w-full bg-white shadow-lg rounded-xl p-5 border border-green-100 min-h-[200px]">
      <div className="text-lg font-bold text-green-800 mb-2 flex items-center gap-2"><Coins className="w-5 h-5" /> Points Wallet</div>
      <div className="text-lg font-mono bg-primary/5 border border-primary/10 px-3 py-1 rounded text-primary mb-2">
        Balance: {pointsBalance}
      </div>
      <div className="flex flex-col gap-1 w-full text-xs">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-green-700" /> Community Tasks: <span className="font-bold ml-auto">{totalCommunity}</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-orange-700" /> Onboarding: <span className="font-bold ml-auto">{totalOnboarding}</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-yellow-800" /> Referral: <span className="font-bold ml-auto">{totalReferral}</span>
        </div>
      </div>
      {/* Show commission unlock info for user */}
      <CommissionLevelsStatus directs={directs} className="w-full mt-2" />
      <Button asChild variant="outline" size="sm" className="w-full font-semibold shadow-sm mt-auto">
        <Link to="/dashboard/points">More</Link>
      </Button>
    </div>
  );
}

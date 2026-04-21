
import React from "react";
import { usePointsWallet } from "@/hooks/usePointsWallet";
import { useAuth } from "@/hooks/useAuth";
import { Coins, BadgeDollarSign, Gift, Award, UserPlus2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

/** Returns a link for the detailed points report for a given category. */
function getDetailLink(type: string) {
  switch (type) {
    case "classifieds":
      return "/dashboard/points?filter=classifieds";
    case "community":
      return "/dashboard/points?filter=community";
    case "onboarding":
      return "/dashboard/points?filter=onboarding";
    case "referral":
      return "/dashboard/points?filter=referral";
    default:
      return "/dashboard/points";
  }
}

export default function DashboardTotalPointsEarnedCard() {
  const { user } = useAuth();
  const { ledger, isLoading } = usePointsWallet(user?.id);

  // Only count rewards (not debits) as "earned"
  const totalEarned = ledger
    .filter((e) => e.type === "reward")
    .reduce((a, b) => a + b.amount, 0);

  // Sums for each category
  const sumFor = (filterFn: (e: any) => boolean) =>
    ledger.filter((e) => e.type === "reward" && filterFn(e)).reduce((a, b) => a + b.amount, 0);

  const earnedClassifieds = sumFor((e) => (e.event_code || "").startsWith("classified"));
  const earnedCommunity = sumFor((e) => (e.event_code || "").startsWith("task_"));
  const earnedOnboarding = sumFor((e) => (e.event_code || "").startsWith("onboarding_"));
  const earnedReferral = sumFor((e) => (e.event_code || "").startsWith("referral"));

  if (isLoading) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center mb-2">
        <div className="text-xl font-semibold text-primary mb-2">Total Points Earned</div>
        <div className="w-full h-6 bg-gray-100 animate-pulse rounded" />
      </Card>
    );
  }

  return (
    <Card className="p-6 flex flex-col items-center justify-center mb-2 shadow border border-primary/10 bg-gradient-to-br from-green-50 via-purple-50 to-white">
      <div className="text-2xl font-bold text-primary flex items-center gap-2 mb-1">
        <Coins className="w-7 h-7 text-indigo-700" /> Total Points Earned
      </div>
      <div className="text-3xl font-mono text-green-700 font-extrabold mb-2">{totalEarned}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-sm w-full mb-2">
        <Link to={getDetailLink("classifieds")} className="flex items-center gap-1 hover:underline">
          <BadgeDollarSign className="w-4 h-4 text-indigo-600" />
          Classifieds: <span className="font-semibold">{earnedClassifieds}</span>
        </Link>
        <Link to={getDetailLink("community")} className="flex items-center gap-1 hover:underline">
          <Gift className="w-4 h-4 text-green-700" />
          Community: <span className="font-semibold">{earnedCommunity}</span>
        </Link>
        <Link to={getDetailLink("onboarding")} className="flex items-center gap-1 hover:underline">
          <Award className="w-4 h-4 text-orange-700" />
          Onboarding: <span className="font-semibold">{earnedOnboarding}</span>
        </Link>
        <Link to={getDetailLink("referral")} className="flex items-center gap-1 hover:underline">
          <UserPlus2 className="w-4 h-4 text-fuchsia-700" />
          Referral: <span className="font-semibold">{earnedReferral}</span>
        </Link>
      </div>
      <div className="text-xs text-muted-foreground">
        Each category links to a detailed report of your earned points.
      </div>
    </Card>
  );
}

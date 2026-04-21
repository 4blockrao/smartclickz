
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePointsWallet } from "@/hooks/usePointsWallet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Coins, TrendingUp, Calendar } from "lucide-react";

export default function DashboardPoints() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { ledger, pointsBalance, isLoading } = usePointsWallet(user?.id);

  // Calculate points breakdown
  const sumFor = (filterFn: (e: any) => boolean) =>
    ledger.filter((e) => e.type === "reward" && filterFn(e)).reduce((a, b) => a + b.amount, 0);

  const pointsBreakdown = {
    classifieds: sumFor((e) => (e.event_code || "").startsWith("classified")),
    community: sumFor((e) => (e.event_code || "").startsWith("task_")),
    onboarding: sumFor((e) => (e.event_code || "").startsWith("onboarding_")),
    referral: sumFor((e) => (e.event_code || "").startsWith("referral"))
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-muted rounded-lg" />
            <div className="h-24 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Points Wallet</h1>
          <p className="text-muted-foreground">Track your earnings and point history</p>
        </div>
      </div>

      {/* Total Points Card */}
      <Card className="mb-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Coins className="w-6 h-6" />
            Total Points Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-2">{pointsBalance.toLocaleString()}</div>
          <p className="text-green-100">Your total earned points</p>
        </CardContent>
      </Card>

      {/* Points Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{pointsBreakdown.classifieds}</div>
            <div className="text-sm text-muted-foreground">Classifieds</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{pointsBreakdown.community}</div>
            <div className="text-sm text-muted-foreground">Community Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{pointsBreakdown.onboarding}</div>
            <div className="text-sm text-muted-foreground">Onboarding</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{pointsBreakdown.referral}</div>
            <div className="text-sm text-muted-foreground">Referrals</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ledger.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet. Start completing tasks to earn points!
            </div>
          ) : (
            <div className="space-y-3">
              {ledger.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{entry.note || entry.event_code}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(entry.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${entry.type === 'reward' ? 'text-green-600' : 'text-red-600'}`}>
                      {entry.type === 'reward' ? '+' : '-'}{entry.amount}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {entry.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

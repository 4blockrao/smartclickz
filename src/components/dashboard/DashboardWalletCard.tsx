import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { usePointsWallet } from "@/hooks/usePointsWallet";
import { Link } from "react-router-dom";
import { Wallet, TrendingUp, DollarSign, ArrowUpRight } from "lucide-react";

export default function DashboardWalletCard() {
  const { user } = useAuth();
  const { pointsBalance, isLoading } = usePointsWallet(user?.id);

  const usdValue = pointsBalance * 0.01; // 1 point = $0.01
  const canWithdraw = pointsBalance >= 1000; // Minimum 1000 points

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wallet className="w-5 h-5 text-green-500" />
          Wallet Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">
              {pointsBalance.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Points</div>
            <div className="text-lg text-green-600 font-semibold">
              ≈ ${usdValue.toFixed(2)} USD
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-sm">
            <div className="p-2 bg-muted rounded">
              <div className="font-bold text-blue-600">
                {canWithdraw ? "Ready" : "1000 min"}
              </div>
              <div className="text-muted-foreground">Withdrawal</div>
            </div>
            <div className="p-2 bg-muted rounded">
              <div className="font-bold text-purple-600">$0.01</div>
              <div className="text-muted-foreground">Per Point</div>
            </div>
          </div>

          <div className="space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link to="/wallet">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Full Wallet
              </Link>
            </Button>
            
            <Button 
              asChild 
              className={`w-full ${canWithdraw ? 'bg-green-600 hover:bg-green-700' : ''}`}
              disabled={!canWithdraw}
              variant={canWithdraw ? "default" : "secondary"}
            >
              <Link to="/dashboard/withdrawal">
                <DollarSign className="w-4 h-4 mr-2" />
                {canWithdraw ? "Withdraw Earnings" : "Insufficient Balance"}
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
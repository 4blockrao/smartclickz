
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { usePointsWallet } from "@/hooks/usePointsWallet";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import { 
  Trophy, 
  TrendingUp, 
  Calendar, 
  ArrowLeft, 
  Award,
  Coins,
  Target,
  Gift
} from "lucide-react";

export default function DashboardPoints() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { ledger, isLoading: isLoadingLedger, pointsBalance } = usePointsWallet(user?.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <DashboardHeader userProfile={null} showBackButton />
        <div className="container mx-auto px-4 py-6">
          <Card className="max-w-lg mx-auto text-center p-8">
            <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">Please log in to view your points statement.</p>
            <Button onClick={() => navigate("/auth")} className="w-full">
              Login / Register
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalEarned = ledger.filter(entry => entry.type === "reward").reduce((sum, entry) => sum + entry.amount, 0);
  const totalSpent = ledger.filter(entry => entry.type === "debit").reduce((sum, entry) => sum + entry.amount, 0);
  const recentTransactions = ledger.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <DashboardHeader userProfile={null} showBackButton />
      
      <main className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
        {/* Header Section */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/dashboard')}
            className="md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              Points Wallet
            </h1>
            <p className="text-muted-foreground">Track your earnings and spending history</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="elevated" className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Current Balance</CardTitle>
                <Coins className="w-6 h-6" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{pointsBalance.toLocaleString()}</div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Available Points
              </Badge>
            </CardContent>
          </Card>

          <Card variant="elevated" className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Total Earned</CardTitle>
                <Award className="w-6 h-6" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{totalEarned.toLocaleString()}</div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Lifetime Rewards
              </Badge>
            </CardContent>
          </Card>

          <Card variant="elevated" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Total Spent</CardTitle>
                <Target className="w-6 h-6" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{totalSpent.toLocaleString()}</div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Investments Made
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Progress Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Points Activity Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Balance Utilization</span>
                <span>{totalSpent > 0 ? Math.round((totalSpent / totalEarned) * 100) : 0}%</span>
              </div>
              <Progress value={totalSpent > 0 ? (totalSpent / totalEarned) * 100 : 0} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600">{ledger.filter(e => e.type === "reward").length}</div>
                <div className="text-sm text-muted-foreground">Earning Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{ledger.filter(e => e.type === "debit").length}</div>
                <div className="text-sm text-muted-foreground">Spending Events</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
              <Badge variant="outline">{ledger.length} total transactions</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingLedger ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                Loading transaction history...
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold mb-2">No transactions yet</h3>
                <p>Complete tasks to start earning points!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        entry.type === "reward" ? "bg-success-100 text-success-600" : "bg-blue-100 text-blue-600"
                      }`}>
                        {entry.type === "reward" ? <Award className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-medium">{entry.note || "Transaction"}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : "—"}
                        </div>
                      </div>
                    </div>
                    <div className={`font-bold ${
                      entry.type === "reward" ? "text-success-600" : "text-blue-600"
                    }`}>
                      {entry.type === "reward" ? "+" : "-"}{entry.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Full Transaction History */}
        {ledger.length > 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Complete Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>All your points transactions</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Event</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledger.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        {entry.created_at
                          ? new Date(entry.created_at).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={entry.type === "reward" ? "default" : "secondary"}>
                          {entry.type === "reward" ? "Earned" : "Spent"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-bold ${
                          entry.type === "reward" ? "text-success-600" : "text-blue-600"
                        }`}>
                          {entry.type === "reward" ? "+" : "-"}{entry.amount}
                        </span>
                      </TableCell>
                      <TableCell>{entry.note || "—"}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {entry.event_code || "—"}
                        </code>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Back to Dashboard */}
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")}
            className="min-w-[200px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}

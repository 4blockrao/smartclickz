import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePointsWallet } from "@/hooks/usePointsWallet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  ArrowLeft,
  Award,
  Coins,
  Target,
  Clock,
  Calendar,
  BarChart3,
  ArrowDownCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import ProMembershipCard from "@/components/dashboard/ProMembershipCard";

const Wallet: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { ledger, pointsBalance, isLoading } = usePointsWallet(user?.id);

  const totalEarned = ledger.filter((e) => e.type === "reward").reduce((s, e) => s + e.amount, 0);
  const totalWithdrawn = ledger.filter((e) => e.type !== "reward").reduce((s, e) => s + e.amount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const metrics = [
    { label: "Current Balance", value: pointsBalance.toLocaleString(), icon: Coins, color: "from-green-500 to-emerald-500" },
    { label: "Total Earned", value: totalEarned.toLocaleString(), icon: TrendingUp, color: "from-blue-500 to-purple-500" },
    { label: "Total Withdrawn", value: totalWithdrawn.toLocaleString(), icon: ArrowDownCircle, color: "from-orange-500 to-red-500" },
    { label: "Transactions", value: ledger.length.toLocaleString(), icon: BarChart3, color: "from-purple-500 to-pink-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="px-4 sm:px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metrics.map((m, i) => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardContent className="p-4 text-center">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${m.color} flex items-center justify-center mx-auto mb-2`}>
                      <m.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-white">{m.value}</div>
                    <div className="text-xs text-slate-300">{m.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-end mb-6">
            <Button onClick={() => navigate("/dashboard/withdrawal")} className="bg-green-600 hover:bg-green-700">
              <ArrowDownCircle className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid grid-cols-2 bg-white/10 backdrop-blur-lg border-white/20 w-full max-w-md">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/70">
                Overview
              </TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/70">
                Transactions
              </TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-6">
              <ProMembershipCard />

              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-400" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {ledger.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No activity yet. Complete activities to start earning.</p>
                  ) : (
                    <div className="space-y-3">
                      {ledger.slice(0, 6).map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${entry.type === "reward" ? "bg-green-500" : "bg-red-500"}`}>
                              {entry.type === "reward" ? <Award className="w-5 h-5 text-white" /> : <Target className="w-5 h-5 text-white" />}
                            </div>
                            <div>
                              <div className="text-white font-medium">{entry.note || entry.event_code}</div>
                              <div className="text-slate-400 text-sm">
                                {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : "—"}
                              </div>
                            </div>
                          </div>
                          <div className={`font-bold ${entry.type === "reward" ? "text-green-400" : "text-red-400"}`}>
                            {entry.type === "reward" ? "+" : "-"}{entry.amount}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transactions */}
            <TabsContent value="transactions" className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Transaction History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {ledger.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No transactions yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {ledger.map((entry, index) => (
                        <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="text-slate-400 text-sm font-mono">#{String(index + 1).padStart(4, "0")}</div>
                            <div>
                              <div className="text-white font-medium">{entry.note || entry.event_code}</div>
                              <div className="text-slate-400 text-sm flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : "—"}
                                <Badge variant="outline" className="text-xs">{entry.type}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className={`font-bold text-right ${entry.type === "reward" ? "text-green-400" : "text-red-400"}`}>
                            {entry.type === "reward" ? "+" : "-"}{entry.amount}
                            <div className="text-slate-400 text-xs">points</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Wallet;

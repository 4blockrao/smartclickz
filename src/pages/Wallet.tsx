
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePointsWallet } from "@/hooks/usePointsWallet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { 
  Wallet as WalletIcon, 
  TrendingUp, 
  Calendar, 
  ArrowLeft, 
  Award,
  Coins,
  Target,
  Gift,
  Package,
  Users,
  Clock,
  DollarSign,
  PieChart,
  BarChart3,
  Download,
  Filter
} from "lucide-react";
import { motion } from "framer-motion";

const Wallet: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { ledger, pointsBalance, isLoading } = usePointsWallet(user?.id);
  const [activeTab, setActiveTab] = useState("overview");
  const [filterPeriod, setFilterPeriod] = useState("all");

  // Mock package data - In real implementation, fetch from Supabase
  const userPackages = [
    {
      id: 1,
      name: "Gold Package",
      purchaseAmount: 500,
      purchaseDate: "2024-01-15",
      targetEarnings: 1000, // 2x the package amount
      currentEarnings: 750,
      status: "active",
      daysActive: 45,
      dailyEarnings: 16.67
    },
    {
      id: 2,
      name: "Silver Package", 
      purchaseAmount: 250,
      purchaseDate: "2024-02-01",
      targetEarnings: 500,
      currentEarnings: 300,
      status: "active",
      daysActive: 30,
      dailyEarnings: 10
    }
  ];

  // Calculate earnings breakdown
  const earningsBreakdown = {
    tasks: ledger.filter(e => e.event_code?.startsWith("task_")).reduce((sum, e) => sum + e.amount, 0),
    classifieds: ledger.filter(e => e.event_code?.startsWith("classified")).reduce((sum, e) => sum + e.amount, 0),
    onboarding: ledger.filter(e => e.event_code?.startsWith("onboarding_")).reduce((sum, e) => sum + e.amount, 0),
    referrals: ledger.filter(e => e.event_code?.startsWith("referral")).reduce((sum, e) => sum + e.amount, 0),
    packages: ledger.filter(e => e.event_code?.startsWith("package")).reduce((sum, e) => sum + e.amount, 0)
  };

  const totalEarnings = Object.values(earningsBreakdown).reduce((sum, val) => sum + val, 0);
  const totalPackageInvestment = userPackages.reduce((sum, pkg) => sum + pkg.purchaseAmount, 0);
  const totalPackageEarnings = userPackages.reduce((sum, pkg) => sum + pkg.currentEarnings, 0);
  const packageROI = totalPackageInvestment > 0 ? ((totalPackageEarnings / totalPackageInvestment) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative px-4 sm:px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
              Your Wallet
            </h1>
            <p className="text-slate-300 text-sm sm:text-base">
              Complete earnings overview and financial tracking
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-2">
                    <Coins className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white">{pointsBalance.toLocaleString()}</div>
                  <div className="text-xs text-slate-300">Current Balance</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white">{totalEarnings.toLocaleString()}</div>
                  <div className="text-xs text-slate-300">Total Earnings</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-2">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white">{packageROI.toFixed(1)}%</div>
                  <div className="text-xs text-slate-300">Package ROI</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-2">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white">{earningsBreakdown.referrals.toLocaleString()}</div>
                  <div className="text-xs text-slate-300">Referral Earnings</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="grid grid-cols-4 bg-white/10 backdrop-blur-lg border-white/20 w-full min-w-max">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/70"
                >
                  <PieChart className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="packages" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/70"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Packages
                </TabsTrigger>
                <TabsTrigger 
                  value="transactions" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/70"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Transactions
                </TabsTrigger>
                <TabsTrigger 
                  value="reports" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/70"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Reports
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Earnings Breakdown */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-400" />
                    Earnings Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {Object.entries(earningsBreakdown).map(([category, amount], index) => {
                      const colors = [
                        "from-blue-500 to-blue-600",
                        "from-green-500 to-green-600", 
                        "from-orange-500 to-orange-600",
                        "from-purple-500 to-purple-600",
                        "from-pink-500 to-pink-600"
                      ];
                      const percentage = totalEarnings > 0 ? (amount / totalEarnings) * 100 : 0;
                      
                      return (
                        <div key={category} className="text-center">
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${colors[index]} flex items-center justify-center mx-auto mb-2`}>
                            <span className="text-white font-bold text-lg">{percentage.toFixed(0)}%</span>
                          </div>
                          <div className="text-white font-semibold capitalize">{category}</div>
                          <div className="text-slate-300 text-sm">{amount.toLocaleString()} pts</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-400" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ledger.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            entry.type === "reward" ? "bg-green-500" : "bg-red-500"
                          }`}>
                            {entry.type === "reward" ? <Award className="w-5 h-5 text-white" /> : <Target className="w-5 h-5 text-white" />}
                          </div>
                          <div>
                            <div className="text-white font-medium">{entry.note || entry.event_code}</div>
                            <div className="text-slate-400 text-sm">
                              {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : "—"}
                            </div>
                          </div>
                        </div>
                        <div className={`font-bold ${
                          entry.type === "reward" ? "text-green-400" : "text-red-400"
                        }`}>
                          {entry.type === "reward" ? "+" : "-"}{entry.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Packages Tab */}
            <TabsContent value="packages" className="space-y-6">
              <div className="grid gap-6">
                {userPackages.map((pkg) => {
                  const progress = (pkg.currentEarnings / pkg.targetEarnings) * 100;
                  const remainingEarnings = pkg.targetEarnings - pkg.currentEarnings;
                  
                  return (
                    <Card key={pkg.id} className="bg-white/10 backdrop-blur-lg border-white/20">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white flex items-center gap-2">
                            <Package className="w-5 h-5 text-purple-400" />
                            {pkg.name}
                          </CardTitle>
                          <Badge className={`${
                            pkg.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                          } text-white`}>
                            {pkg.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-white font-bold text-lg">${pkg.purchaseAmount}</div>
                            <div className="text-slate-400 text-sm">Investment</div>
                          </div>
                          <div className="text-center">
                            <div className="text-green-400 font-bold text-lg">${pkg.currentEarnings}</div>
                            <div className="text-slate-400 text-sm">Earned</div>
                          </div>
                          <div className="text-center">
                            <div className="text-blue-400 font-bold text-lg">${remainingEarnings}</div>
                            <div className="text-slate-400 text-sm">Remaining</div>
                          </div>
                          <div className="text-center">
                            <div className="text-purple-400 font-bold text-lg">{pkg.daysActive}</div>
                            <div className="text-slate-400 text-sm">Days Active</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-300">Progress to 2x Target</span>
                            <span className="text-white">{progress.toFixed(1)}%</span>
                          </div>
                          <Progress value={progress} className="h-3" />
                        </div>
                        
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <div className="text-slate-300 text-sm">Daily Average Earnings</div>
                          <div className="text-white font-bold">${pkg.dailyEarnings.toFixed(2)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                      Transaction History
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-white border-white/20">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm" className="text-white border-white/20">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ledger.map((entry, index) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="text-slate-400 text-sm font-mono">
                            #{String(index + 1).padStart(6, '0')}
                          </div>
                          <div>
                            <div className="text-white font-medium">{entry.note || entry.event_code}</div>
                            <div className="text-slate-400 text-sm flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : "—"}
                              <Badge variant="outline" className="text-xs">
                                {entry.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className={`font-bold text-right ${
                          entry.type === "reward" ? "text-green-400" : "text-red-400"
                        }`}>
                          {entry.type === "reward" ? "+" : "-"}{entry.amount}
                          <div className="text-slate-400 text-xs">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      Monthly Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Total Earnings This Month</span>
                        <span className="text-white font-bold">{totalEarnings.toLocaleString()} pts</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Package Earnings</span>
                        <span className="text-green-400 font-bold">{totalPackageEarnings.toLocaleString()} pts</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Referral Commissions</span>
                        <span className="text-purple-400 font-bold">{earningsBreakdown.referrals.toLocaleString()} pts</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Task Rewards</span>
                        <span className="text-blue-400 font-bold">{earningsBreakdown.tasks.toLocaleString()} pts</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-400" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Average Daily Earnings</span>
                        <span className="text-white font-bold">${(totalPackageEarnings / 30).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Total ROI</span>
                        <span className="text-green-400 font-bold">{packageROI.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Active Packages</span>
                        <span className="text-blue-400 font-bold">{userPackages.filter(p => p.status === 'active').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Total Transactions</span>
                        <span className="text-purple-400 font-bold">{ledger.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Download Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                      <Download className="w-4 h-4 mr-2" />
                      Monthly Report
                    </Button>
                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                      <Download className="w-4 h-4 mr-2" />
                      Tax Statement
                    </Button>
                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                      <Download className="w-4 h-4 mr-2" />
                      Package Summary
                    </Button>
                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                      <Download className="w-4 h-4 mr-2" />
                      Transaction Log
                    </Button>
                  </div>
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

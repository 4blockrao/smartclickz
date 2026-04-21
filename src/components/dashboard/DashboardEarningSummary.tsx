
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePointsWallet } from "@/hooks/usePointsWallet";
import { 
  TrendingUp, 
  Award, 
  Users, 
  Target,
  Calendar,
  ArrowRight,
  Coins,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

const DashboardEarningSummary = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { ledger, pointsBalance } = usePointsWallet(user?.id);

  // Calculate earnings by category
  const earningsBreakdown = {
    tasks: ledger.filter(e => e.event_code?.startsWith("task_")).reduce((sum, e) => sum + e.amount, 0),
    classifieds: ledger.filter(e => e.event_code?.startsWith("classified")).reduce((sum, e) => sum + e.amount, 0),
    onboarding: ledger.filter(e => e.event_code?.startsWith("onboarding_")).reduce((sum, e) => sum + e.amount, 0),
    referrals: ledger.filter(e => e.event_code?.startsWith("referral")).reduce((sum, e) => sum + e.amount, 0),
    packages: ledger.filter(e => e.event_code?.startsWith("package")).reduce((sum, e) => sum + e.amount, 0)
  };

  const totalEarnings = Object.values(earningsBreakdown).reduce((sum, val) => sum + val, 0);
  
  // Get today's earnings
  const today = new Date().toISOString().slice(0, 10);
  const todaysEarnings = ledger
    .filter(e => e.created_at?.slice(0, 10) === today && e.type === "reward")
    .reduce((sum, e) => sum + e.amount, 0);

  // Get this month's earnings
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthlyEarnings = ledger
    .filter(e => e.created_at?.slice(0, 7) === thisMonth && e.type === "reward")
    .reduce((sum, e) => sum + e.amount, 0);

  const earningCategories = [
    {
      name: "Community Tasks",
      amount: earningsBreakdown.tasks,
      icon: Target,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-400"
    },
    {
      name: "Classified Ads",
      amount: earningsBreakdown.classifieds,
      icon: BarChart3,
      color: "from-green-500 to-green-600",
      textColor: "text-green-400"
    },
    {
      name: "Referral Bonus",
      amount: earningsBreakdown.referrals,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-400"
    },
    {
      name: "Package Earnings",
      amount: earningsBreakdown.packages,
      icon: Award,
      color: "from-orange-500 to-orange-600",
      textColor: "text-orange-400"
    }
  ];

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Earnings Summary
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/wallet')}
            className="text-green-300 hover:bg-green-500/20"
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-white/5 rounded-lg">
          <div className="text-center">
            <div className="text-white font-bold text-lg">{pointsBalance.toLocaleString()}</div>
            <div className="text-slate-400 text-xs">Current Balance</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-bold text-lg">{todaysEarnings.toLocaleString()}</div>
            <div className="text-slate-400 text-xs">Today's Earnings</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 font-bold text-lg">{monthlyEarnings.toLocaleString()}</div>
            <div className="text-slate-400 text-xs">This Month</div>
          </div>
        </div>

        {/* Earnings Categories */}
        <div className="space-y-3">
          {earningCategories.map((category, index) => {
            const percentage = totalEarnings > 0 ? (category.amount / totalEarnings) * 100 : 0;
            
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                    <category.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{category.name}</div>
                    <div className="text-slate-400 text-xs">{percentage.toFixed(1)}% of total</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${category.textColor}`}>
                    {category.amount.toLocaleString()}
                  </div>
                  <div className="text-slate-400 text-xs">points</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Transactions Preview */}
        <div className="border-t border-white/10 pt-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium text-sm">Recent Transactions</h4>
            <Badge variant="outline" className="text-slate-300 border-slate-600">
              {ledger.length} total
            </Badge>
          </div>
          <div className="space-y-2">
            {ledger.slice(0, 3).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-2 bg-white/5 rounded text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    entry.type === "reward" ? "bg-green-500" : "bg-red-500"
                  }`}></div>
                  <span className="text-slate-300 truncate max-w-[120px]">
                    {entry.note || entry.event_code}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${
                    entry.type === "reward" ? "text-green-400" : "text-red-400"
                  }`}>
                    {entry.type === "reward" ? "+" : "-"}{entry.amount}
                  </span>
                  <Calendar className="w-3 h-3 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={() => navigate('/wallet')}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
        >
          <Coins className="w-4 h-4 mr-2" />
          Open Full Wallet Dashboard
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardEarningSummary;

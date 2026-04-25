
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePointsWallet } from "@/hooks/usePointsWallet";
import { Wallet, TrendingUp, Coins, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardWalletCard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { ledger, pointsBalance } = usePointsWallet(user?.id);

  // Calculate today's earnings
  const today = new Date().toISOString().slice(0, 10);
  const todaysEarnings = ledger
    .filter(e => e.created_at?.slice(0, 10) === today && e.type === "reward")
    .reduce((sum, e) => sum + e.amount, 0);

  // Calculate total earnings
  const totalEarnings = ledger
    .filter(e => e.type === "reward")
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="p-5 bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-lg border-green-500/30 shadow-xl flex flex-col h-full group hover:from-green-500/30 hover:to-emerald-600/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/wallet')}
            className="text-green-300 hover:bg-green-500/20"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 space-y-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">
              {pointsBalance.toLocaleString()}
            </div>
            <div className="text-green-200 text-sm font-medium">Current Balance</div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-white/10 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-green-300" />
                <span className="text-green-300 font-bold text-sm">{todaysEarnings}</span>
              </div>
              <div className="text-green-200 text-xs">Today</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Coins className="w-3 h-3 text-green-300" />
                <span className="text-green-300 font-bold text-sm">{totalEarnings.toLocaleString()}</span>
              </div>
              <div className="text-green-200 text-xs">Total Earned</div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-green-200 text-xs mb-2">Recent Transactions: {ledger.length}</div>
          </div>
        </div>

        <Button 
          onClick={() => navigate('/wallet')}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg group-hover:shadow-green-500/25 transition-all duration-300"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Open Wallet
        </Button>
      </Card>
    </motion.div>
  );
}

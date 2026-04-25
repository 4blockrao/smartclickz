
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useReferrals } from "@/hooks/useReferrals";
import { 
  Crown, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Award,
  Zap,
  ArrowUp
} from "lucide-react";

const ranks = [
  { name: "Bronze", color: "from-amber-600 to-amber-700", requirement: 1000, commission: 15 },
  { name: "Silver", color: "from-gray-400 to-gray-500", requirement: 5000, commission: 20 },
  { name: "Gold", color: "from-yellow-400 to-yellow-500", requirement: 15000, commission: 25 },
  { name: "Platinum", color: "from-purple-400 to-purple-500", requirement: 50000, commission: 30 },
  { name: "Diamond", color: "from-blue-400 to-blue-500", requirement: 150000, commission: 35 },
  { name: "Elite", color: "from-pink-400 to-pink-500", requirement: 500000, commission: 40 }
];

const royaltyTiers = [
  { name: "Director", bv: 50000, monthly: 500 },
  { name: "Executive", bv: 100000, monthly: 1200 },
  { name: "Senior Executive", bv: 250000, monthly: 3500 },
  { name: "Vice President", bv: 500000, monthly: 8000 },
  { name: "Senior VP", bv: 1000000, monthly: 18000 },
  { name: "President", bv: 2500000, monthly: 45000 },
  { name: "Chairman", bv: 5000000, monthly: 100000 }
];

export default function DashboardRankProgress() {
  const { userProfile } = useAuth();
  const { referralData } = useReferrals();

  // Mock data - in real app, calculate from user's actual performance
  const personalSales = 12500;
  const teamSales = 45000;
  const balancedVolume = 38000;
  const currentRankIndex = 2; // Gold
  const currentRank = ranks[currentRankIndex];
  const nextRank = ranks[currentRankIndex + 1];
  
  const progressToNext = nextRank ? 
    Math.min(100, (balancedVolume / nextRank.requirement) * 100) : 100;

  const currentRoyaltyTier = royaltyTiers.find(tier => balancedVolume >= tier.bv) || null;
  const nextRoyaltyTier = royaltyTiers.find(tier => balancedVolume < tier.bv);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Current Rank Status */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Crown className="w-6 h-6 text-yellow-400" />
            Current Rank Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Rank */}
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${currentRank.color} flex items-center justify-center mb-3`}>
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{currentRank.name}</h3>
              <p className="text-slate-400 text-sm">Current Rank</p>
              <Badge className="mt-2 bg-green-500/20 text-green-400">
                {currentRank.commission}% Commission
              </Badge>
            </div>

            {/* Progress to Next */}
            {nextRank && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Progress to {nextRank.name}</span>
                  <span className="text-white">{progressToNext.toFixed(1)}%</span>
                </div>
                <Progress value={progressToNext} className="h-3" />
                <div className="text-center">
                  <p className="text-slate-400 text-sm">
                    ${balancedVolume.toLocaleString()} / ${nextRank.requirement.toLocaleString()} BV
                  </p>
                  <p className="text-green-400 text-sm font-medium">
                    ${(nextRank.requirement - balancedVolume).toLocaleString()} needed
                  </p>
                </div>
              </div>
            )}

            {/* Key Metrics */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Personal Sales:</span>
                <span className="text-white">${personalSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Team Sales:</span>
                <span className="text-white">${teamSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Balanced Volume:</span>
                <span className="text-green-400 font-bold">${balancedVolume.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Royalty Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="w-6 h-6 text-purple-400" />
            Royalty Program Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Royalty Tier */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Current Tier</h3>
              {currentRoyaltyTier ? (
                <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    <span className="font-bold text-purple-400">{currentRoyaltyTier.name}</span>
                  </div>
                  <p className="text-slate-300">Monthly Royalty: ${currentRoyaltyTier.monthly.toLocaleString()}</p>
                  <p className="text-slate-400 text-sm">Required BV: ${currentRoyaltyTier.bv.toLocaleString()}</p>
                </div>
              ) : (
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                  <p className="text-slate-400">Not yet qualified for royalties</p>
                  <p className="text-slate-500 text-sm">Build your team to unlock monthly bonuses</p>
                </div>
              )}
            </div>

            {/* Next Royalty Tier */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Next Goal</h3>
              {nextRoyaltyTier ? (
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    <span className="font-bold text-blue-400">{nextRoyaltyTier.name}</span>
                  </div>
                  <p className="text-slate-300">Monthly Royalty: ${nextRoyaltyTier.monthly.toLocaleString()}</p>
                  <p className="text-slate-400 text-sm">Required BV: ${nextRoyaltyTier.bv.toLocaleString()}</p>
                  <p className="text-green-400 text-sm mt-2">
                    ${(nextRoyaltyTier.bv - balancedVolume).toLocaleString()} BV needed
                  </p>
                </div>
              ) : (
                <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
                  <p className="text-green-400 font-bold">Maximum Tier Achieved!</p>
                  <p className="text-slate-300 text-sm">You've reached the highest royalty level</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Ranks Overview */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="w-6 h-6 text-green-400" />
            Rank Progression Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ranks.map((rank, index) => (
              <div 
                key={rank.name}
                className={`p-4 rounded-lg border transition-all ${
                  index === currentRankIndex 
                    ? 'bg-gradient-to-r ' + rank.color + ' border-white/20' 
                    : index < currentRankIndex
                    ? 'bg-green-500/20 border-green-500/30'
                    : 'bg-slate-700/50 border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {index < currentRankIndex ? (
                    <Award className="w-5 h-5 text-green-400" />
                  ) : index === currentRankIndex ? (
                    <Crown className="w-5 h-5 text-white" />
                  ) : (
                    <ArrowUp className="w-5 h-5 text-slate-400" />
                  )}
                  <span className={`font-bold ${
                    index <= currentRankIndex ? 'text-white' : 'text-slate-400'
                  }`}>
                    {rank.name}
                  </span>
                </div>
                <p className={`text-sm ${
                  index <= currentRankIndex ? 'text-slate-200' : 'text-slate-500'
                }`}>
                  ${rank.requirement.toLocaleString()} BV
                </p>
                <p className={`text-sm ${
                  index <= currentRankIndex ? 'text-green-300' : 'text-slate-500'
                }`}>
                  {rank.commission}% Commission
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="w-6 h-6 text-orange-400" />
            Growth Action Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Users className="w-4 h-4 mr-2" />
              Recruit New Team Members
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <DollarSign className="w-4 h-4 mr-2" />
              Increase Personal Sales
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Help Team Advance
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Award className="w-4 h-4 mr-2" />
              View Training Resources
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

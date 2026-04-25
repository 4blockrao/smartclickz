
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Award,
  Zap,
  BarChart3,
  Users
} from "lucide-react";

const royaltyHistory = [
  { month: "January 2024", tier: "Executive", bv: 125000, royalty: 1200, qualified: true },
  { month: "February 2024", tier: "Executive", bv: 118000, royalty: 1200, qualified: true },
  { month: "March 2024", tier: "Senior Executive", bv: 268000, royalty: 3500, qualified: true },
  { month: "April 2024", tier: "Senior Executive", bv: 245000, royalty: 3500, qualified: false },
  { month: "May 2024", tier: "Executive", bv: 95000, royalty: 1200, qualified: false },
  { month: "June 2024", tier: "Senior Executive", bv: 285000, royalty: 3500, qualified: true }
];

const teamPerformance = [
  { member: "Sarah Johnson", rank: "Gold", bv: 15000, contribution: 18.5 },
  { member: "Mike Chen", rank: "Platinum", bv: 12500, contribution: 15.4 },
  { member: "Lisa Rodriguez", rank: "Silver", bv: 8500, contribution: 10.5 },
  { member: "David Kim", rank: "Gold", bv: 7200, contribution: 8.9 },
  { member: "Emma Davis", rank: "Bronze", bv: 6800, contribution: 8.4 }
];

export default function DashboardRoyalty() {
  const [selectedTab, setSelectedTab] = useState("overview");
  
  const currentMonthBV = 285000;
  const currentTier = "Senior Executive";
  const currentRoyalty = 3500;
  const nextTierBV = 500000;
  const progressToNext = (currentMonthBV / nextTierBV) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Current Royalty Status */}
      <Card className="bg-gradient-to-r from-purple-900 to-indigo-900 border-purple-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Crown className="w-6 h-6 text-yellow-400" />
            Current Royalty Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-3">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{currentTier}</h3>
              <p className="text-purple-200 text-sm">Current Tier</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                ${currentRoyalty.toLocaleString()}
              </div>
              <p className="text-purple-200 text-sm">Monthly Royalty</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                ${currentMonthBV.toLocaleString()}
              </div>
              <p className="text-purple-200 text-sm">This Month's BV</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-1">
                {progressToNext.toFixed(1)}%
              </div>
              <p className="text-purple-200 text-sm">Progress to Next Tier</p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-purple-200">Progress to Vice President</span>
              <span className="text-white">${(nextTierBV - currentMonthBV).toLocaleString()} BV needed</span>
            </div>
            <Progress value={progressToNext} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-purple-600">
            <Calendar className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-purple-600">
            <Users className="w-4 h-4 mr-2" />
            Team Performance
          </TabsTrigger>
          <TabsTrigger value="projections" className="data-[state=active]:bg-purple-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Projections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* This Month Breakdown */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">This Month Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Left Leg Volume:</span>
                  <span className="text-white">$142,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Right Leg Volume:</span>
                  <span className="text-white">$143,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Balanced Volume:</span>
                  <span className="text-green-400 font-bold">$142,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Royalty Rate:</span>
                  <span className="text-purple-400">2.5%</span>
                </div>
                <div className="border-t border-slate-600 pt-2">
                  <div className="flex justify-between">
                    <span className="text-white font-bold">Total Royalty:</span>
                    <span className="text-green-400 font-bold">${currentRoyalty.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Qualification Status */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Qualification Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Personal Sales:</span>
                  <Badge className="bg-green-500/20 text-green-400">✓ Qualified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Team Volume:</span>
                  <Badge className="bg-green-500/20 text-green-400">✓ Qualified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Active Status:</span>
                  <Badge className="bg-green-500/20 text-green-400">✓ Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Rank Maintained:</span>
                  <Badge className="bg-green-500/20 text-green-400">✓ Yes</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">6-Month Royalty History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {royaltyHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div>
                      <span className="text-white font-medium">{entry.month}</span>
                      <p className="text-slate-400 text-sm">{entry.tier} • ${entry.bv.toLocaleString()} BV</p>
                    </div>
                    <div className="text-right">
                      <span className="text-green-400 font-bold">${entry.royalty.toLocaleString()}</span>
                      <div>
                        {entry.qualified ? (
                          <Badge className="bg-green-500/20 text-green-400 text-xs">Qualified</Badge>
                        ) : (
                          <Badge className="bg-red-500/20 text-red-400 text-xs">Not Qualified</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Top Contributing Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamPerformance.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {member.member.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <span className="text-white font-medium">{member.member}</span>
                        <p className="text-slate-400 text-sm">{member.rank} Rank</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-green-400 font-bold">${member.bv.toLocaleString()}</span>
                      <p className="text-slate-400 text-sm">{member.contribution}% contribution</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projections" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Monthly Projections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
                  <h3 className="text-green-400 font-bold mb-2">Conservative</h3>
                  <p className="text-2xl font-bold text-white">$3,500</p>
                  <p className="text-slate-400 text-sm">Based on current trend</p>
                </div>
                <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                  <h3 className="text-blue-400 font-bold mb-2">Optimistic</h3>
                  <p className="text-2xl font-bold text-white">$5,200</p>
                  <p className="text-slate-400 text-sm">With 15% growth</p>
                </div>
                <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
                  <h3 className="text-purple-400 font-bold mb-2">Stretch Goal</h3>
                  <p className="text-2xl font-bold text-white">$8,000</p>
                  <p className="text-slate-400 text-sm">Next tier achieved</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-white font-semibold">Actions to Reach Next Tier:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Recruit 3 new active team members
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Increase weaker leg by $75,000 BV
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Help 2 team members advance rank
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

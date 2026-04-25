
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Calculator,
  Users,
  DollarSign,
  Target,
  ArrowLeftRight,
  Award
} from "lucide-react";

const teamLegs = [
  { 
    name: "Left Leg", 
    volume: 145000, 
    members: 45, 
    growth: 12.5,
    topContributors: [
      { name: "Sarah Johnson", volume: 25000 },
      { name: "Mike Chen", volume: 18500 },
      { name: "Lisa Rodriguez", volume: 15200 }
    ]
  },
  { 
    name: "Right Leg", 
    volume: 128000, 
    members: 38, 
    growth: 8.2,
    topContributors: [
      { name: "David Kim", volume: 22000 },
      { name: "Emma Davis", volume: 19800 },
      { name: "John Smith", volume: 14500 }
    ]
  },
  { 
    name: "Center Leg", 
    volume: 95000, 
    members: 28, 
    growth: 15.3,
    topContributors: [
      { name: "Anna Wilson", volume: 18000 },
      { name: "Tom Brown", volume: 16200 },
      { name: "Kate Lee", volume: 12800 }
    ]
  }
];

const commissionRates = [
  { tier: "Bronze", rate: 10, requirement: 50000 },
  { tier: "Silver", rate: 15, requirement: 100000 },
  { tier: "Gold", rate: 20, requirement: 200000 },
  { tier: "Platinum", rate: 25, requirement: 400000 },
  { tier: "Diamond", rate: 30, requirement: 800000 }
];

export default function DashboardBalancedVolume() {
  const [selectedTab, setSelectedTab] = useState("overview");
  
  // Calculate balanced volume (smallest leg)
  const volumes = teamLegs.map(leg => leg.volume);
  const balancedVolume = Math.min(...volumes);
  const totalVolume = volumes.reduce((sum, vol) => sum + vol, 0);
  const powerLeg = Math.max(...volumes);
  const powerLegName = teamLegs.find(leg => leg.volume === powerLeg)?.name || "";
  
  // Calculate commission
  const currentTier = commissionRates.reverse().find(tier => balancedVolume >= tier.requirement) || commissionRates[commissionRates.length - 1];
  const monthlyCommission = balancedVolume * (currentTier.rate / 100);
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Balanced Volume Overview */}
      <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Balanced Volume Commission Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                ${balancedVolume.toLocaleString()}
              </div>
              <p className="text-blue-200 text-sm">Balanced Volume</p>
              <p className="text-blue-300 text-xs">(Smallest Leg)</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">
                ${monthlyCommission.toLocaleString()}
              </div>
              <p className="text-blue-200 text-sm">Monthly Commission</p>
              <p className="text-blue-300 text-xs">{currentTier.rate}% of BV</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-1">
                ${powerLeg.toLocaleString()}
              </div>
              <p className="text-blue-200 text-sm">Power Leg Volume</p>
              <p className="text-blue-300 text-xs">{powerLegName}</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">
                {currentTier.tier}
              </div>
              <p className="text-blue-200 text-sm">Current Tier</p>
              <p className="text-blue-300 text-xs">{currentTier.rate}% Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="legs" className="data-[state=active]:bg-blue-600">
            <Users className="w-4 h-4 mr-2" />
            Team Legs
          </TabsTrigger>
          <TabsTrigger value="calculator" className="data-[state=active]:bg-blue-600">
            <Calculator className="w-4 h-4 mr-2" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="optimization" className="data-[state=active]:bg-blue-600">
            <Target className="w-4 h-4 mr-2" />
            Optimization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Volume Breakdown */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Volume Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamLegs.map((leg, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{leg.name}:</span>
                      <span className={`font-bold ${
                        leg.volume === balancedVolume ? 'text-green-400' : 
                        leg.volume === powerLeg ? 'text-orange-400' : 'text-white'
                      }`}>
                        ${leg.volume.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={(leg.volume / powerLeg) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">{leg.members} members</span>
                      <span className="text-green-400">+{leg.growth}% this month</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Commission Tiers */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Commission Tiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {commissionRates.reverse().map((tier, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border ${
                      tier.tier === currentTier.tier
                        ? 'bg-blue-500/20 border-blue-500/50'
                        : balancedVolume >= tier.requirement
                        ? 'bg-green-500/20 border-green-500/50'
                        : 'bg-slate-700/50 border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className={`font-bold ${
                          tier.tier === currentTier.tier ? 'text-blue-400' :
                          balancedVolume >= tier.requirement ? 'text-green-400' : 'text-slate-400'
                        }`}>
                          {tier.tier}
                        </span>
                        <p className="text-slate-400 text-sm">
                          ${tier.requirement.toLocaleString()} BV minimum
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-lg font-bold ${
                          tier.tier === currentTier.tier ? 'text-blue-400' :
                          balancedVolume >= tier.requirement ? 'text-green-400' : 'text-slate-400'
                        }`}>
                          {tier.rate}%
                        </span>
                        {tier.tier === currentTier.tier && (
                          <p className="text-blue-300 text-sm">Current</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="legs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamLegs.map((leg, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${
                    leg.volume === balancedVolume ? 'text-green-400' : 
                    leg.volume === powerLeg ? 'text-orange-400' : 'text-white'
                  }`}>
                    <Users className="w-5 h-5" />
                    {leg.name}
                    {leg.volume === balancedVolume && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                        Balanced
                      </span>
                    )}
                    {leg.volume === powerLeg && (
                      <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
                        Power
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      ${leg.volume.toLocaleString()}
                    </div>
                    <p className="text-slate-400 text-sm">{leg.members} active members</p>
                    <p className="text-green-400 text-sm">+{leg.growth}% growth</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-white font-medium text-sm">Top Contributors:</h4>
                    {leg.topContributors.map((contributor, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-slate-400">{contributor.name}</span>
                        <span className="text-white">${contributor.volume.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Commission Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Current Month</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Balanced Volume:</span>
                      <span className="text-green-400 font-bold">${balancedVolume.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Commission Rate:</span>
                      <span className="text-blue-400 font-bold">{currentTier.rate}%</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-600 pt-3">
                      <span className="text-white font-bold">Total Commission:</span>
                      <span className="text-green-400 font-bold">${monthlyCommission.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Growth Scenarios</h3>
                  <div className="space-y-3">
                    {[10, 25, 50].map(growth => {
                      const newBV = balancedVolume * (1 + growth / 100);
                      const newTier = commissionRates.find(tier => newBV >= tier.requirement) || commissionRates[commissionRates.length - 1];
                      const newCommission = newBV * (newTier.rate / 100);
                      const increase = newCommission - monthlyCommission;
                      
                      return (
                        <div key={growth} className="bg-slate-700/50 p-3 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-400">+{growth}% BV Growth:</span>
                            <span className="text-white">${newBV.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">New Commission:</span>
                            <span className="text-green-400">
                              ${newCommission.toLocaleString()} 
                              <span className="text-xs text-green-300">
                                (+${increase.toLocaleString()})
                              </span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Immediate Actions</h3>
                  <div className="space-y-3">
                    <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                      <h4 className="text-blue-400 font-medium mb-2">Focus on Weakest Leg</h4>
                      <p className="text-slate-300 text-sm">
                        Your Center Leg is limiting your BV. Adding ${(balancedVolume * 0.2).toLocaleString()} 
                        here would increase commission by ${((balancedVolume * 1.2) * (currentTier.rate / 100) - monthlyCommission).toLocaleString()}.
                      </p>
                    </div>
                    
                    <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
                      <h4 className="text-green-400 font-medium mb-2">Recruit in Weak Areas</h4>
                      <p className="text-slate-300 text-sm">
                        Target recruitment in your Center Leg to balance volume distribution.
                      </p>
                    </div>
                    
                    <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
                      <h4 className="text-purple-400 font-medium mb-2">Team Training</h4>
                      <p className="text-slate-300 text-sm">
                        Help underperforming members increase their sales to boost overall leg volume.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Growth Targets</h3>
                  <div className="space-y-3">
                    {commissionRates.filter(tier => tier.requirement > balancedVolume).slice(0, 3).map((tier, index) => (
                      <div key={index} className="bg-slate-700/50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium">{tier.tier} Tier</span>
                          <span className="text-green-400">{tier.rate}% Rate</span>
                        </div>
                        <div className="text-sm text-slate-400">
                          Need: ${(tier.requirement - balancedVolume).toLocaleString()} more BV
                        </div>
                        <div className="text-sm text-green-300">
                          Potential: ${(tier.requirement * (tier.rate / 100)).toLocaleString()}/month
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Target className="w-4 h-4 mr-2" />
                  Set Growth Goals
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Users className="w-4 h-4 mr-2" />
                  View Team Performance
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Access Training Resources
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

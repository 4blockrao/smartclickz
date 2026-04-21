
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  TrendingUp, 
  Users,
  Target,
  DollarSign,
  Award,
  Star,
  Zap,
  BarChart3,
  Calendar
} from "lucide-react";

const leadershipTiers = [
  { 
    title: "Director", 
    requirements: { bv: 50000, directs: 5, legs: 2 },
    benefits: ["$500 monthly bonus", "Leadership training", "Priority support"],
    color: "from-blue-500 to-blue-600"
  },
  { 
    title: "Executive", 
    requirements: { bv: 100000, directs: 8, legs: 3 },
    benefits: ["$1200 monthly bonus", "International events", "Car bonus eligible"],
    color: "from-purple-500 to-purple-600"
  },
  { 
    title: "Senior Executive", 
    requirements: { bv: 250000, directs: 12, legs: 4 },
    benefits: ["$3500 monthly bonus", "Leadership council", "Travel incentives"],
    color: "from-pink-500 to-pink-600"
  },
  { 
    title: "Vice President", 
    requirements: { bv: 500000, directs: 20, legs: 5 },
    benefits: ["$8000 monthly bonus", "Equity participation", "Global recognition"],
    color: "from-orange-500 to-orange-600"
  }
];

const teamLeaders = [
  { 
    name: "Sarah Johnson", 
    rank: "Executive", 
    bv: 125000, 
    team: 45, 
    growth: 23.5,
    regions: ["North America", "Europe"],
    specialty: "Digital Marketing"
  },
  { 
    name: "Mike Chen", 
    rank: "Director", 
    bv: 85000, 
    team: 32, 
    growth: 18.2,
    regions: ["Asia Pacific"],
    specialty: "Team Building"
  },
  { 
    name: "Lisa Rodriguez", 
    rank: "Senior Executive", 
    bv: 180000, 
    team: 67, 
    growth: 31.8,
    regions: ["Latin America", "Caribbean"],
    specialty: "Training & Development"
  },
  { 
    name: "David Kim", 
    rank: "Director", 
    bv: 95000, 
    team: 38, 
    growth: 15.7,
    regions: ["Middle East", "Africa"],
    specialty: "Strategic Planning"
  }
];

const achievements = [
  { title: "Top Recruiter", month: "June 2024", recipient: "Sarah Johnson", metric: "15 new directs" },
  { title: "Volume Leader", month: "June 2024", recipient: "Lisa Rodriguez", metric: "$180K BV" },
  { title: "Mentor Award", month: "May 2024", recipient: "Mike Chen", metric: "5 rank advances" },
  { title: "Innovation Award", month: "May 2024", recipient: "David Kim", metric: "New training program" }
];

export default function DashboardLeadership() {
  const [selectedTab, setSelectedTab] = useState("overview");
  
  // Current user leadership status
  const currentRank = "Executive";
  const currentBV = 125000;
  const currentDirects = 12;
  const currentLegs = 3;
  const nextTier = leadershipTiers.find(tier => tier.requirements.bv > currentBV);
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Leadership Overview */}
      <Card className="bg-gradient-to-r from-purple-900 to-pink-900 border-purple-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Crown className="w-6 h-6 text-yellow-400" />
            Leadership Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-3">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{currentRank}</h3>
              <p className="text-purple-200 text-sm">Current Leadership Level</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                ${currentBV.toLocaleString()}
              </div>
              <p className="text-purple-200 text-sm">Monthly BV</p>
              <p className="text-purple-300 text-xs">Balanced Volume</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {currentDirects}
              </div>
              <p className="text-purple-200 text-sm">Direct Leaders</p>
              <p className="text-purple-300 text-xs">Personal Recruits</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-1">
                {currentLegs}
              </div>
              <p className="text-purple-200 text-sm">Active Legs</p>
              <p className="text-purple-300 text-xs">Team Branches</p>
            </div>
          </div>
          
          {nextTier && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-purple-200">Progress to {nextTier.title}</span>
                <span className="text-white">
                  ${(nextTier.requirements.bv - currentBV).toLocaleString()} BV needed
                </span>
              </div>
              <Progress value={(currentBV / nextTier.requirements.bv) * 100} className="h-3" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leadership Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
            <Crown className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-purple-600">
            <Users className="w-4 h-4 mr-2" />
            Team Leaders
          </TabsTrigger>
          <TabsTrigger value="tiers" className="data-[state=active]:bg-purple-600">
            <Star className="w-4 h-4 mr-2" />
            Leadership Tiers
          </TabsTrigger>
          <TabsTrigger value="development" className="data-[state=active]:bg-purple-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Development
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leadership Metrics */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Leadership Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Team Size:</span>
                  <span className="text-white font-bold">156 members</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Leaders:</span>
                  <span className="text-green-400 font-bold">23 leaders</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Team Growth:</span>
                  <span className="text-blue-400 font-bold">+18% this month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Leadership Bonus:</span>
                  <span className="text-purple-400 font-bold">$1,200/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Global Rank:</span>
                  <span className="text-orange-400 font-bold">#47 worldwide</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{achievement.title}</h4>
                      <p className="text-slate-400 text-xs">{achievement.month} • {achievement.recipient}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-sm font-medium">{achievement.metric}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamLeaders.map((leader, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {leader.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <span className="font-medium">{leader.name}</span>
                        <p className="text-slate-400 text-sm">{leader.specialty}</p>
                      </div>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-400">
                      {leader.rank}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-lg font-bold text-green-400">
                        ${leader.bv.toLocaleString()}
                      </p>
                      <p className="text-slate-400 text-xs">Monthly BV</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-400">{leader.team}</p>
                      <p className="text-slate-400 text-xs">Team Size</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-orange-400">+{leader.growth}%</p>
                      <p className="text-slate-400 text-xs">Growth</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Regions:</p>
                    <div className="flex flex-wrap gap-1">
                      {leader.regions.map((region, idx) => (
                        <Badge key={idx} className="bg-slate-600 text-slate-300 text-xs">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tiers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {leadershipTiers.map((tier, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center`}>
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    {tier.title}
                    {tier.title === currentRank && (
                      <Badge className="bg-green-500/20 text-green-400 text-xs">Current</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-white font-medium text-sm">Requirements:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Balanced Volume:</span>
                        <span className="text-white">${tier.requirements.bv.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Direct Leaders:</span>
                        <span className="text-white">{tier.requirements.directs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Active Legs:</span>
                        <span className="text-white">{tier.requirements.legs}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-white font-medium text-sm">Benefits:</h4>
                    <div className="space-y-1">
                      {tier.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                          <span className="text-slate-300 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {tier.title !== currentRank && (
                    <div className="pt-2">
                      {currentBV >= tier.requirements.bv ? (
                        <Badge className="bg-green-500/20 text-green-400 w-full justify-center">
                          BV Requirement Met
                        </Badge>
                      ) : (
                        <p className="text-slate-400 text-xs text-center">
                          ${(tier.requirements.bv - currentBV).toLocaleString()} BV needed
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="development" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Leadership Development Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                  <h3 className="text-blue-400 font-bold mb-2">Current Focus</h3>
                  <p className="text-white font-medium">Team Expansion</p>
                  <p className="text-slate-300 text-sm">Recruit 8 more direct leaders</p>
                  <p className="text-blue-400 text-xs mt-2">Target: Next 3 months</p>
                </div>
                
                <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
                  <h3 className="text-green-400 font-bold mb-2">Volume Growth</h3>
                  <p className="text-white font-medium">Balanced Development</p>
                  <p className="text-slate-300 text-sm">Strengthen weaker legs</p>
                  <p className="text-green-400 text-xs mt-2">Target: +50K BV/month</p>
                </div>
                
                <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
                  <h3 className="text-purple-400 font-bold mb-2">Skill Building</h3>
                  <p className="text-white font-medium">Advanced Training</p>
                  <p className="text-slate-300 text-sm">Complete leadership program</p>
                  <p className="text-purple-400 text-xs mt-2">Progress: 60% complete</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-white font-semibold">Next Milestones:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Achieve Senior Executive rank (125K more BV needed)
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Develop 4 more active team legs
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Complete advanced leadership certification
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    Mentor 3 team members to Director rank
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Target className="w-4 h-4 mr-2" />
                  Set Goals
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Users className="w-4 h-4 mr-2" />
                  View Team Plans
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Training
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

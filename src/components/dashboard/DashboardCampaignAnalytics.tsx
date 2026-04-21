
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Eye,
  Target,
  DollarSign,
  Users,
  Calendar,
  Activity,
  Award,
  Zap
} from "lucide-react";

const campaignData = [
  {
    id: 1,
    name: "Instagram Engagement Boost",
    status: "active",
    budget: 5000,
    spent: 3200,
    tasks: { total: 500, completed: 320, approved: 298 },
    performance: { ctr: 4.2, engagement: 8.5, roi: 156 },
    platform: "Instagram",
    type: "Engagement",
    startDate: "2024-01-15",
    endDate: "2024-02-15"
  },
  {
    id: 2,
    name: "TikTok Video Views",
    status: "completed",
    budget: 2500,
    spent: 2500,
    tasks: { total: 250, completed: 250, approved: 245 },
    performance: { ctr: 6.8, engagement: 12.3, roi: 189 },
    platform: "TikTok",
    type: "Views",
    startDate: "2024-01-01",
    endDate: "2024-01-31"
  },
  {
    id: 3,
    name: "YouTube Subscriber Drive",
    status: "paused",
    budget: 8000,
    spent: 4800,
    tasks: { total: 800, completed: 480, approved: 465 },
    performance: { ctr: 3.9, engagement: 7.2, roi: 134 },
    platform: "YouTube",
    type: "Subscribers",
    startDate: "2024-01-20",
    endDate: "2024-03-20"
  }
];

const platformMetrics = [
  { platform: "Instagram", campaigns: 12, totalSpend: 45000, avgROI: 168, topPerformer: "Fashion Brand Boost" },
  { platform: "TikTok", campaigns: 8, totalSpend: 28000, avgROI: 192, topPerformer: "Dance Challenge" },
  { platform: "YouTube", campaigns: 15, totalSpend: 72000, avgROI: 156, topPerformer: "Tech Review Series" },
  { platform: "Facebook", campaigns: 6, totalSpend: 18000, avgROI: 143, topPerformer: "Local Business Promo" }
];

export default function DashboardCampaignAnalytics() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedCampaign, setSelectedCampaign] = useState(campaignData[0]);
  
  const totalBudget = campaignData.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = campaignData.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalTasks = campaignData.reduce((sum, campaign) => sum + campaign.tasks.completed, 0);
  const avgROI = campaignData.reduce((sum, campaign) => sum + campaign.performance.roi, 0) / campaignData.length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Campaign Analytics Overview */}
      <Card className="bg-gradient-to-r from-green-900 to-blue-900 border-green-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="w-6 h-6 text-green-400" />
            Campaign Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                ${totalSpent.toLocaleString()}
              </div>
              <p className="text-green-200 text-sm">Total Spent</p>
              <p className="text-green-300 text-xs">${totalBudget.toLocaleString()} budgeted</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {totalTasks.toLocaleString()}
              </div>
              <p className="text-green-200 text-sm">Tasks Completed</p>
              <p className="text-green-300 text-xs">Across all campaigns</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {avgROI.toFixed(0)}%
              </div>
              <p className="text-green-200 text-sm">Average ROI</p>
              <p className="text-green-300 text-xs">Return on investment</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-1">
                {campaignData.filter(c => c.status === 'active').length}
              </div>
              <p className="text-green-200 text-sm">Active Campaigns</p>
              <p className="text-green-300 text-xs">Currently running</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-green-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-green-600">
            <Target className="w-4 h-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="platforms" className="data-[state=active]:bg-green-600">
            <Activity className="w-4 h-4 mr-2" />
            Platforms
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-green-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Budget Utilization */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Budget Utilization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Budget:</span>
                    <span className="text-white">${totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Amount Spent:</span>
                    <span className="text-green-400">${totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Remaining:</span>
                    <span className="text-blue-400">${(totalBudget - totalSpent).toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={(totalSpent / totalBudget) * 100} 
                    className="h-3"
                  />
                  <p className="text-slate-400 text-sm text-center">
                    {((totalSpent / totalBudget) * 100).toFixed(1)}% utilized
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Task Performance */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Task Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaignData.map((campaign, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{campaign.name}:</span>
                      <span className="text-white">
                        {campaign.tasks.completed}/{campaign.tasks.total}
                      </span>
                    </div>
                    <Progress 
                      value={(campaign.tasks.completed / campaign.tasks.total) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">
                        {campaign.tasks.approved} approved
                      </span>
                      <span className="text-green-400">
                        {((campaign.tasks.completed / campaign.tasks.total) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campaignData.map((campaign, index) => (
              <Card 
                key={index} 
                className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all ${
                  selectedCampaign.id === campaign.id ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => setSelectedCampaign(campaign)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    <span className="text-sm">{campaign.name}</span>
                    <Badge className={`${
                      campaign.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      campaign.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      {campaign.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Budget:</span>
                    <span className="text-white">${campaign.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Spent:</span>
                    <span className="text-green-400">${campaign.spent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">ROI:</span>
                    <span className="text-purple-400">{campaign.performance.roi}%</span>
                  </div>
                  <Progress 
                    value={(campaign.spent / campaign.budget) * 100} 
                    className="h-2"
                  />
                  <div className="text-xs text-slate-500 text-center">
                    {((campaign.spent / campaign.budget) * 100).toFixed(1)}% budget used
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Campaign Details */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                {selectedCampaign.name} - Detailed Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {selectedCampaign.performance.ctr}%
                  </div>
                  <p className="text-slate-400 text-sm">Click-through Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {selectedCampaign.performance.engagement}%
                  </div>
                  <p className="text-slate-400 text-sm">Engagement Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {selectedCampaign.performance.roi}%
                  </div>
                  <p className="text-slate-400 text-sm">Return on Investment</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400 mb-1">
                    {selectedCampaign.tasks.approved}
                  </div>
                  <p className="text-slate-400 text-sm">Approved Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platformMetrics.map((platform, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="w-5 h-5 text-blue-400" />
                    {platform.platform}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">Total Campaigns</p>
                      <p className="text-2xl font-bold text-white">{platform.campaigns}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Total Spend</p>
                      <p className="text-2xl font-bold text-green-400">
                        ${platform.totalSpend.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Average ROI:</span>
                      <span className="text-purple-400 font-bold">{platform.avgROI}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Top Performer:</span>
                      <span className="text-blue-400 text-sm">{platform.topPerformer}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Performance Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
                  <h3 className="text-green-400 font-bold mb-2">Top Performing</h3>
                  <p className="text-white font-medium">TikTok Video Views</p>
                  <p className="text-slate-300 text-sm">189% ROI • 12.3% engagement</p>
                  <p className="text-green-400 text-xs mt-2">Best platform for video content</p>
                </div>
                
                <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                  <h3 className="text-blue-400 font-bold mb-2">Most Active</h3>
                  <p className="text-white font-medium">Instagram Engagement</p>
                  <p className="text-slate-300 text-sm">320 tasks completed</p>
                  <p className="text-blue-400 text-xs mt-2">Highest user participation</p>
                </div>
                
                <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
                  <h3 className="text-purple-400 font-bold mb-2">Growth Opportunity</h3>
                  <p className="text-white font-medium">YouTube Campaigns</p>
                  <p className="text-slate-300 text-sm">Can improve targeting</p>
                  <p className="text-purple-400 text-xs mt-2">Focus on subscriber quality</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-white font-semibold">Recommended Actions:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Increase TikTok campaign budget based on high ROI
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Optimize Instagram campaigns for better engagement rates
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Review YouTube targeting criteria to improve performance
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Optimize Campaigns
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Export Analytics
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Award className="w-4 h-4 mr-2" />
                  View Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

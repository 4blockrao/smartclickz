import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Globe, 
  Users, 
  DollarSign,
  Calendar,
  Play,
  Pause,
  Eye,
  Heart,
  Share,
  MessageCircle,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";

const DashboardCampaignBuilder = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    title: "",
    description: "",
    targetUrl: "",
    campaignType: "",
    platform: "",
    budget: "",
    rewardPerTask: "",
    maxTasks: "",
    targetCountries: [],
    targetAgeMin: "",
    targetAgeMax: "",
    creatives: []
  });

  // Mock user's existing campaigns
  const userCampaigns = [
    {
      id: 1,
      title: "Instagram Fashion Brand Promotion",
      platform: "Instagram",
      type: "like",
      status: "active",
      budget: 500,
      spent: 320,
      tasksCompleted: 64,
      maxTasks: 100,
      rewardPerTask: 5,
      createdAt: "2024-01-15",
      targetUrl: "https://instagram.com/fashionbrand"
    },
    {
      id: 2,
      title: "YouTube Tech Review Channel",
      platform: "YouTube", 
      type: "view",
      status: "paused",
      budget: 1000,
      spent: 450,
      tasksCompleted: 90,
      maxTasks: 200,
      rewardPerTask: 5,
      createdAt: "2024-01-10",
      targetUrl: "https://youtube.com/watch?v=techreview"
    }
  ];

  const campaignTypes = [
    { value: "view", label: "View Content", icon: <Eye className="w-4 h-4" /> },
    { value: "like", label: "Like Post", icon: <Heart className="w-4 h-4" /> },
    { value: "follow", label: "Follow Account", icon: <Users className="w-4 h-4" /> },
    { value: "share", label: "Share Content", icon: <Share className="w-4 h-4" /> },
    { value: "comment", label: "Comment", icon: <MessageCircle className="w-4 h-4" /> }
  ];

  const platforms = [
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
    { value: "twitter", label: "Twitter" }
  ];

  const handleCreateCampaign = () => {
    console.log("Creating campaign:", campaignData);
    // In real implementation, submit to backend
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return '📷';
      case 'facebook': return '👥';
      case 'youtube': return '📺';
      case 'tiktok': return '🎵';
      case 'twitter': return '🐦';
      default: return '🌐';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Campaign Management</h1>
          <p className="text-slate-300">Create and manage your social media campaigns</p>
        </div>
        <Button 
          onClick={() => setActiveStep(1)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Campaign Creation Form */}
        <div className="lg:col-span-2">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Create New Campaign
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Basic Information */}
              {activeStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="text-white">Campaign Title</Label>
                    <Input
                      placeholder="Enter campaign title"
                      value={campaignData.title}
                      onChange={(e) => setCampaignData({...campaignData, title: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Description</Label>
                    <Textarea
                      placeholder="Describe your campaign"
                      value={campaignData.description}
                      onChange={(e) => setCampaignData({...campaignData, description: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Target URL</Label>
                    <Input
                      placeholder="https://..."
                      value={campaignData.targetUrl}
                      onChange={(e) => setCampaignData({...campaignData, targetUrl: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <Button onClick={() => setActiveStep(2)} className="w-full">
                    Next: Campaign Type
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Campaign Type & Platform */}
              {activeStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="text-white">Campaign Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {campaignTypes.map((type) => (
                        <Button
                          key={type.value}
                          variant={campaignData.campaignType === type.value ? "default" : "outline"}
                          onClick={() => setCampaignData({...campaignData, campaignType: type.value})}
                          className="flex items-center gap-2"
                        >
                          {type.icon}
                          {type.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Platform</Label>
                    <Select 
                      value={campaignData.platform}
                      onValueChange={(value) => setCampaignData({...campaignData, platform: value})}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((platform) => (
                          <SelectItem key={platform.value} value={platform.value}>
                            {platform.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setActiveStep(1)}>
                      Back
                    </Button>
                    <Button onClick={() => setActiveStep(3)} className="flex-1">
                      Next: Budget & Rewards
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Budget & Rewards */}
              {activeStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Total Budget ($)</Label>
                      <Input
                        type="number"
                        placeholder="500"
                        value={campaignData.budget}
                        onChange={(e) => setCampaignData({...campaignData, budget: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Reward per Task ($)</Label>
                      <Input
                        type="number"
                        placeholder="5"
                        value={campaignData.rewardPerTask}
                        onChange={(e) => setCampaignData({...campaignData, rewardPerTask: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Maximum Tasks</Label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={campaignData.maxTasks}
                      onChange={(e) => setCampaignData({...campaignData, maxTasks: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  {campaignData.budget && campaignData.rewardPerTask && (
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <div className="text-blue-400 text-sm">
                        Estimated Tasks: {Math.floor(Number(campaignData.budget) / Number(campaignData.rewardPerTask))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setActiveStep(2)}>
                      Back
                    </Button>
                    <Button onClick={handleCreateCampaign} className="flex-1">
                      Create Campaign
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Campaign Statistics */}
        <div className="space-y-4">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-sm">Campaign Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-300 text-sm">Active Campaigns</span>
                <span className="text-green-400 font-bold">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300 text-sm">Total Spent</span>
                <span className="text-white font-bold">$770</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300 text-sm">Tasks Completed</span>
                <span className="text-blue-400 font-bold">154</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300 text-sm">Avg. Task Cost</span>
                <span className="text-purple-400 font-bold">$5.00</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Existing Campaigns */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            My Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userCampaigns.map((campaign) => {
              const progress = (campaign.tasksCompleted / campaign.maxTasks) * 100;
              const budgetUsed = (campaign.spent / campaign.budget) * 100;
              
              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getPlatformIcon(campaign.platform)}</span>
                      <div>
                        <h4 className="text-white font-medium">{campaign.title}</h4>
                        <p className="text-slate-400 text-sm">{campaign.platform} • {campaign.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(campaign.status)} text-white`}>
                        {campaign.status}
                      </Badge>
                      {campaign.status === 'active' ? (
                        <Button size="sm" variant="outline">
                          <Pause className="w-3 h-3" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          <Play className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-white font-bold">{campaign.tasksCompleted}</div>
                      <div className="text-slate-400 text-xs">Tasks Done</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 font-bold">${campaign.spent}</div>
                      <div className="text-slate-400 text-xs">Spent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">${campaign.rewardPerTask}</div>
                      <div className="text-slate-400 text-xs">Per Task</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 font-bold">{progress.toFixed(0)}%</div>
                      <div className="text-slate-400 text-xs">Complete</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Task Progress</span>
                      <span className="text-white">{campaign.tasksCompleted}/{campaign.maxTasks}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCampaignBuilder;

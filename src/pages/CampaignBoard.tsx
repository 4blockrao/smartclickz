
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Clock, 
  DollarSign, 
  Users, 
  Target,
  TrendingUp,
  Star,
  MapPin,
  Calendar,
  Zap,
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CampaignBoard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns", activeFilter],
    queryFn: async () => {
      // Mock data for now - replace with actual Supabase query
      return [
        {
          id: "1",
          title: "Instagram Story Engagement Campaign",
          description: "Create engaging Instagram stories for our new product launch. Must include specific hashtags and mention our brand.",
          reward_per_task: 25.00,
          total_budget: 5000,
          max_tasks: 200,
          completed_tasks: 47,
          status: "active",
          campaign_type: "social_media",
          target_platform: "instagram",
          proof_type: "screenshot",
          end_date: "2024-02-15",
          target_countries: ["US", "CA", "UK"],
          difficulty: "Easy",
          category: "Social Media",
          timeToComplete: "15 mins",
          requirements: ["1K+ followers", "Active account", "English speaking"]
        },
        {
          id: "2",
          title: "TikTok Video Creation Challenge",
          description: "Create viral TikTok videos featuring our product. Must be original content with trending audio.",
          reward_per_task: 50.00,
          total_budget: 10000,
          max_tasks: 200,
          completed_tasks: 89,
          status: "active",
          campaign_type: "content_creation",
          target_platform: "tiktok",
          proof_type: "video",
          end_date: "2024-02-20",
          target_countries: ["US", "CA", "UK", "AU"],
          difficulty: "Medium",
          category: "Content Creation",
          timeToComplete: "30 mins",
          requirements: ["500+ followers", "Creative skills", "Video editing"]
        },
        {
          id: "3",
          title: "Product Review Survey",
          description: "Complete detailed survey about our new product line. Your feedback helps improve our offerings.",
          reward_per_task: 15.00,
          total_budget: 3000,
          max_tasks: 200,
          completed_tasks: 156,
          status: "active",
          campaign_type: "survey",
          target_platform: "web",
          proof_type: "form",
          end_date: "2024-02-10",
          target_countries: ["Global"],
          difficulty: "Easy",
          category: "Surveys",
          timeToComplete: "10 mins",
          requirements: ["18+ years old", "Product experience"]
        },
        // Add more mock campaigns...
      ];
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Hard": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "paused": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "completed": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const categories = [
    { id: "all", label: "All Campaigns", count: campaigns?.length || 0 },
    { id: "social_media", label: "Social Media", count: 15 },
    { id: "surveys", label: "Surveys", count: 8 },
    { id: "content_creation", label: "Content Creation", count: 12 },
    { id: "app_testing", label: "App Testing", count: 6 }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <h3 className="text-xl font-semibold text-white">Loading Campaigns</h3>
          <p className="text-slate-400">Finding the best opportunities for you...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative px-4 sm:px-6 py-8 sm:py-12">
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Target className="w-10 h-10 text-blue-400" />
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Campaign Board
              </h1>
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Discover high-paying campaigns and start earning immediately
            </p>

            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <Input 
                    placeholder="Search campaigns..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 backdrop-blur-lg border-white/20 text-white placeholder:text-slate-400"
                  />
                </div>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Category Tabs */}
          <Tabs value={activeFilter} onValueChange={setActiveFilter} className="mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 bg-white/10 backdrop-blur-lg border-white/20">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-sm"
                >
                  <span className="hidden sm:inline">{category.label}</span>
                  <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                  <Badge className="ml-2 bg-white/20 text-xs">{category.count}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Available Campaigns", value: "41", icon: Target, color: "from-blue-500 to-cyan-500" },
              { label: "Total Rewards", value: "$125K", icon: DollarSign, color: "from-green-500 to-emerald-500" },
              { label: "Active Participants", value: "8.5K", icon: Users, color: "from-purple-500 to-pink-500" },
              { label: "Success Rate", value: "94%", icon: TrendingUp, color: "from-orange-500 to-red-500" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Campaigns Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns?.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getDifficultyColor(campaign.difficulty)} variant="outline">
                        {campaign.difficulty}
                      </Badge>
                      <Badge className={getStatusColor(campaign.status)} variant="outline">
                        {campaign.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg leading-tight">
                      {campaign.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-300 text-sm line-clamp-3">
                      {campaign.description}
                    </p>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="text-xs text-green-400">Reward</span>
                        </div>
                        <div className="text-lg font-bold text-white">
                          ${campaign.reward_per_task.toFixed(2)}
                        </div>
                      </div>
                      <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-xs text-blue-400">Time</span>
                        </div>
                        <div className="text-lg font-bold text-white">
                          {campaign.timeToComplete}
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-white">
                          {campaign.completed_tasks}/{campaign.max_tasks}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(campaign.completed_tasks / campaign.max_tasks) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-2">Requirements:</h4>
                      <div className="flex flex-wrap gap-1">
                        {campaign.requirements.slice(0, 2).map((req, idx) => (
                          <Badge key={idx} className="bg-purple-500/20 text-purple-300 text-xs">
                            {req}
                          </Badge>
                        ))}
                        {campaign.requirements.length > 2 && (
                          <Badge className="bg-slate-600/20 text-slate-400 text-xs">
                            +{campaign.requirements.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0"
                        onClick={() => navigate(`/campaigns/${campaign.id}`)}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Start Task
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 px-8"
            >
              Load More Campaigns
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignBoard;

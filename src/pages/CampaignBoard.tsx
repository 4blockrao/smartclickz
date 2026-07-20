import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Trophy,
  Users,
  Target,
  Layers,
  Zap,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface AvailableActivity {
  id: string;
  campaign_id: string;
  reward_amount: number | null;
  status: string | null;
  created_at: string | null;
  campaign_title: string | null;
  campaign_type: string | null;
  target_platform: string | null;
  target_url: string | null;
  description: string | null;
  proof_requirements: string | null;
}

const prettyType = (t?: string | null) =>
  (t || "activity").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const CampaignBoard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();
  const { user } = useAuth();

  // Real, matched feed: activities distributed to this user by the DB function
  // (filters by the user's country / city / interests vs each campaign's targeting).
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["available-activities", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_available_tasks_for_user" as any, {
        _user_id: user!.id,
      });
      if (error) throw error;
      return (data || []) as AvailableActivity[];
    },
  });

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    activities.forEach((a) => {
      const key = a.campaign_type || "other";
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return [
      { id: "all", label: "All Activities", count: activities.length },
      ...Array.from(counts.entries()).map(([id, count]) => ({
        id,
        label: prettyType(id),
        count,
      })),
    ];
  }, [activities]);

  const filtered = activities.filter((a) => {
    const matchesFilter = activeFilter === "all" || a.campaign_type === activeFilter;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (a.campaign_title || "").toLowerCase().includes(q) ||
      (a.description || "").toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const totalPoints = activities.reduce((sum, a) => sum + (Number(a.reward_amount) || 0), 0);
  const uniqueCampaigns = new Set(activities.map((a) => a.campaign_id)).size;

  // Track a deliberate click, then proceed. (High-volume impression logging is
  // intentionally deferred to the event-pipeline tier rather than flooding Postgres.)
  const recordClick = (taskId: string) => {
    supabase.rpc("record_task_event" as any, { _campaign_task_id: taskId, _event_type: "clicked" });
  };
  const startActivity = (activity: AvailableActivity) => {
    recordClick(activity.id);
    navigate(`/campaigns/${activity.campaign_id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
          <h3 className="text-xl font-semibold text-white">Loading Activities</h3>
          <p className="text-slate-400">Finding opportunities matched to you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        <div className="relative px-4 sm:px-6 py-8 sm:py-12">
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Target className="w-10 h-10 text-blue-400" />
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Activity Board
              </h1>
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Opportunities matched to your location and interests
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 backdrop-blur-lg border-white/20 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Category tabs (derived from real data) */}
          {categories.length > 1 && (
            <Tabs value={activeFilter} onValueChange={setActiveFilter} className="mb-8">
              <TabsList className="flex flex-wrap h-auto bg-white/10 backdrop-blur-lg border-white/20">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-sm"
                  >
                    {category.label}
                    <Badge className="ml-2 bg-white/20 text-xs">{category.count}</Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}

          {/* Real quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Available Activities", value: String(activities.length), icon: Layers, color: "from-blue-500 to-cyan-500" },
              { label: "Total Points on Offer", value: totalPoints.toLocaleString(), icon: Trophy, color: "from-green-500 to-emerald-500" },
              { label: "Active Campaigns", value: String(uniqueCampaigns), icon: Users, color: "from-purple-500 to-pink-500" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {!user ? (
            <div className="text-center py-20">
              <p className="text-slate-300 mb-4">Sign in to see activities matched to you.</p>
              <Button onClick={() => navigate("/auth")} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                Sign In
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Target className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No matching activities yet</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                New activities appear here as advertisers launch campaigns that match your location and
                interests. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.4) }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30" variant="outline">
                          {prettyType(activity.campaign_type)}
                        </Badge>
                        {activity.target_platform && (
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30" variant="outline">
                            {prettyType(activity.target_platform)}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-white text-lg leading-tight">
                        {activity.campaign_title || "Activity"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {activity.description && (
                        <p className="text-slate-300 text-sm line-clamp-3">{activity.description}</p>
                      )}

                      <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20 flex items-center justify-between">
                        <span className="text-xs text-green-400">Reward</span>
                        <span className="text-lg font-bold text-white">
                          +{Number(activity.reward_amount) || 0} pts
                        </span>
                      </div>

                      {activity.proof_requirements && (
                        <div>
                          <h4 className="text-white font-semibold text-sm mb-1">Proof required</h4>
                          <p className="text-slate-400 text-xs line-clamp-2">{activity.proof_requirements}</p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0"
                          onClick={() => startActivity(activity)}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Start Activity
                        </Button>
                        {activity.target_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10"
                            onClick={() => {
                              recordClick(activity.id);
                              window.open(activity.target_url!, "_blank");
                            }}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignBoard;

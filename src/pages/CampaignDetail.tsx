import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase as _supabase } from "@/integrations/supabase/client";
const supabase = _supabase as any;
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ExternalLink, Clock, Users, DollarSign, Target, TrendingUp, Globe } from "lucide-react";

const CampaignDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["campaign-detail", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div>Loading campaign details...</div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Campaign Not Found</h2>
          <Button onClick={() => navigate("/campaigns")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
          </Button>
        </div>
      </div>
    );
  }

  const completionPercentage = (campaign.completed_tasks / campaign.max_tasks) * 100;
  const budgetUsedPercentage = (parseFloat(campaign.spent_budget.toString()) / parseFloat(campaign.total_budget.toString())) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto max-w-6xl py-8 px-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Campaign Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border/50 shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="w-fit">
                      {campaign.campaign_type.replace(/_/g, " ").toUpperCase()}
                    </Badge>
                    <CardTitle className="text-2xl font-bold">{campaign.title}</CardTitle>
                    <CardDescription>
                      Created on {new Date(campaign.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={campaign.status === 'active' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {campaign.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Campaign Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {campaign.description}
                  </p>
                </div>

                {campaign.target_url && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <ExternalLink className="h-5 w-5 text-primary" />
                      Target URL
                    </h3>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open(campaign.target_url, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {campaign.target_url}
                    </Button>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">Task Progress</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completed</span>
                        <span>{campaign.completed_tasks} / {campaign.max_tasks}</span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">Budget Usage</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Spent</span>
                        <span>${campaign.spent_budget} / ${campaign.total_budget}</span>
                      </div>
                      <Progress value={budgetUsedPercentage} className="h-2" />
                    </div>
                  </Card>
                </div>

                {campaign.proof_requirements && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Proof Requirements</h3>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {campaign.proof_requirements}
                      </p>
                    </div>
                  </div>
                )}

                <Button size="lg" className="w-full">
                  Join Campaign
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Stats Sidebar */}
          <div className="space-y-6">
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Reward Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Per Task</span>
                  <span className="font-semibold">${campaign.reward_per_task}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Budget</span>
                  <span className="font-semibold">${campaign.total_budget}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Remaining</span>
                  <span className="font-semibold text-green-600">
                    ${(parseFloat(campaign.total_budget.toString()) - parseFloat(campaign.spent_budget.toString())).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Campaign Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Platform</span>
                  <Badge variant="outline" className="capitalize">
                    {campaign.target_platform}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Participants</span>
                  <span className="font-semibold">{campaign.completed_tasks}</span>
                </div>
                {campaign.end_date && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Ends</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(campaign.end_date).toLocaleDateString()}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {(campaign.target_countries || campaign.target_cities) && (
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Targeting
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {campaign.target_countries && (
                    <div>
                      <span className="text-sm text-muted-foreground">Countries</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {campaign.target_countries.map((country: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {country}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {campaign.target_cities && (
                    <div>
                      <span className="text-sm text-muted-foreground">Cities</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {campaign.target_cities.map((city: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {city}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {campaign.target_age_min && campaign.target_age_max && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Age Range</span>
                      <span className="text-sm">{campaign.target_age_min} - {campaign.target_age_max}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
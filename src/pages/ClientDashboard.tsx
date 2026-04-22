import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase as _supabase } from "@/integrations/supabase/client";
const supabase = _supabase as any;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target, 
  Plus, 
  BarChart3, 
  Clock,
  CheckCircle,
  AlertCircle,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: clientData } = useQuery({
    queryKey: ["client-data", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: campaigns } = useQuery({
    queryKey: ["client-campaigns", clientData?.id],
    queryFn: async () => {
      if (!clientData) return [];
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("client_id", clientData.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!clientData,
  });

  const stats = [
    {
      title: "Active Campaigns",
      value: campaigns?.filter(c => c.status === 'active').length || 0,
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Total Spent",
      value: `$${clientData?.total_spent || 0}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Wallet Balance",
      value: `$${clientData?.wallet_balance || 0}`,
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "Total Tasks",
      value: campaigns?.reduce((sum, c) => sum + c.completed_tasks, 0) || 0,
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Client Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your campaigns and track performance
            </p>
          </div>
          <Button onClick={() => navigate("/create-campaign")} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Your Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                {campaigns?.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first campaign to start reaching your audience
                    </p>
                    <Button onClick={() => navigate("/create-campaign")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Campaign
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaigns?.map((campaign) => {
                      const completionRate = (campaign.completed_tasks / campaign.max_tasks) * 100;
                      const budgetUsed = (parseFloat(campaign.spent_budget.toString()) / parseFloat(campaign.total_budget.toString())) * 100;
                      
                      return (
                        <Card key={campaign.id} className="border border-border/30">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-lg">{campaign.title}</h3>
                                  <Badge 
                                    variant={campaign.status === 'active' ? 'default' : 'secondary'}
                                    className="capitalize"
                                  >
                                    {campaign.status}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm mb-3">
                                  {campaign.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {new Date(campaign.created_at).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {campaign.completed_tasks} participants
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-primary">
                                  ${campaign.reward_per_task}
                                </div>
                                <div className="text-sm text-muted-foreground">per task</div>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Task Progress</span>
                                  <span>{campaign.completed_tasks} / {campaign.max_tasks}</span>
                                </div>
                                <Progress value={completionRate} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Budget Used</span>
                                  <span>${campaign.spent_budget} / ${campaign.total_budget}</span>
                                </div>
                                <Progress value={budgetUsed} className="h-2" />
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/campaign/${campaign.id}`)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Button>
                              <Button variant="outline" size="sm">
                                <BarChart3 className="mr-2 h-4 w-4" />
                                Analytics
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Detailed campaign analytics and insights will be available soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle>Billing & Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Current Balance</h3>
                      <p className="text-2xl font-bold text-primary">${clientData?.wallet_balance || 0}</p>
                    </div>
                    <Button>Add Funds</Button>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Billing Information</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Company:</span>
                        <span className="ml-2">{clientData?.company_name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <span className="ml-2">{clientData?.business_email}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Spent:</span>
                        <span className="ml-2">${clientData?.total_spent}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant="outline" className="ml-2 capitalize">
                          {clientData?.verification_status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  Target, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  DollarSign,
  Filter,
  Search,
  Eye
} from 'lucide-react';

const AdminCampaigns: React.FC = () => {
  const [activeTab, setActiveTab] = useState('draft');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['admin-campaigns', activeTab],
    queryFn: async () => {
      let query = supabase
        .from('campaigns')
        .select(`
          *,
          clients (
            company_name,
            business_email,
            verification_status
          )
        `);

      if (activeTab !== 'all') {
        query = query.eq('status', activeTab as any);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: campaignTasks } = useQuery({
    queryKey: ['admin-campaign-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_tasks')
        .select(`
          *,
          campaigns (
            title,
            campaign_type,
            target_platform
          )
        `)
        .eq('status', 'submitted')
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const approveCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      // First activate the campaign
      const { error: updateError } = await supabase
        .from('campaigns')
        .update({ status: 'active' })
        .eq('id', campaignId);
      
      if (updateError) throw updateError;

      // Generate tasks for the campaign
      const { error: rpcError } = await supabase.rpc('generate_campaign_tasks' as any, {
        campaign_id_param: campaignId
      });
      
      if (rpcError) throw rpcError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
      toast({
        title: "Campaign Approved",
        description: "Campaign has been approved and tasks generated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error approving campaign:', error);
      toast({
        title: "Error",
        description: "Failed to approve campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  const rejectCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      const { error } = await supabase
        .from('campaigns')
        .update({ status: 'rejected' as any })
        .eq('id', campaignId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
      toast({
        title: "Campaign Rejected",
        description: "Campaign has been rejected.",
      });
    },
  });

  const approveTaskMutation = useMutation({
    mutationFn: async ({ taskId, adminNote }: { taskId: string; adminNote?: string }) => {
      const { error } = await supabase
        .from('campaign_tasks')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          admin_note: adminNote
        })
        .eq('id', taskId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaign-tasks'] });
      toast({
        title: "Task Approved",
        description: "Task has been approved and user will be rewarded.",
      });
    },
  });

  const rejectTaskMutation = useMutation({
    mutationFn: async ({ taskId, adminNote }: { taskId: string; adminNote?: string }) => {
      const { error } = await supabase
        .from('campaign_tasks')
        .update({
          status: 'rejected',
          admin_note: adminNote
        })
        .eq('id', taskId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaign-tasks'] });
      toast({
        title: "Task Rejected",
        description: "Task has been rejected.",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredCampaigns = campaigns?.filter(campaign =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.clients?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <h3 className="text-xl font-semibold text-white">Loading Campaigns</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Campaign Management
            </h1>
            <p className="text-slate-300 mt-1">Review and manage advertiser campaigns</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <TabsList className="grid grid-cols-4 bg-white/10 backdrop-blur-lg border-white/20">
              <TabsTrigger value="draft" className="data-[state=active]:bg-purple-600">
                Draft ({campaigns?.filter(c => c.status === 'draft').length || 0})
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-purple-600">
                Active ({campaigns?.filter(c => c.status === 'active').length || 0})
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-purple-600">
                Completed ({campaigns?.filter(c => c.status === 'completed').length || 0})
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
                All ({campaigns?.length || 0})
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <Input 
                  placeholder="Search campaigns..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 backdrop-blur-lg border-white/20 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          <TabsContent value={activeTab} className="space-y-6">
            {activeTab === 'draft' || activeTab === 'all' ? (
              <div className="grid gap-6">
                {filteredCampaigns?.filter(c => activeTab === 'all' || c.status === activeTab).map((campaign) => (
                  <Card key={campaign.id} className="bg-white/10 backdrop-blur-lg border-white/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-white">{campaign.title}</CardTitle>
                            <Badge className={getStatusColor(campaign.status)} variant="outline">
                              {campaign.status}
                            </Badge>
                          </div>
                          <p className="text-slate-300 text-sm mb-3">{campaign.description}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>{campaign.clients?.company_name}</span>
                            <span>{campaign.clients?.business_email}</span>
                            <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">
                            ${campaign.reward_per_task}
                          </div>
                          <div className="text-sm text-slate-400">per task</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <Target className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-blue-400">Platform</span>
                          </div>
                          <div className="font-semibold text-white capitalize">
                            {campaign.target_platform}
                          </div>
                        </div>
                        <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-green-400">Budget</span>
                          </div>
                          <div className="font-semibold text-white">
                            ${campaign.total_budget}
                          </div>
                        </div>
                        <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4 text-purple-400" />
                            <span className="text-xs text-purple-400">Max Tasks</span>
                          </div>
                          <div className="font-semibold text-white">
                            {campaign.max_tasks}
                          </div>
                        </div>
                        <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-orange-400" />
                            <span className="text-xs text-orange-400">End Date</span>
                          </div>
                          <div className="font-semibold text-white">
                            {new Date(campaign.end_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {campaign.status === 'draft' && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => approveCampaignMutation.mutate(campaign.id)}
                            disabled={approveCampaignMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve & Generate Tasks
                          </Button>
                          <Button
                            onClick={() => rejectCampaignMutation.mutate(campaign.id)}
                            disabled={rejectCampaignMutation.isPending}
                            variant="destructive"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : null}
          </TabsContent>
        </Tabs>

        {/* Task Review Section */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Pending Task Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {campaignTasks && campaignTasks.length > 0 ? (
              <div className="space-y-4">
                {campaignTasks.map((task) => (
                  <div key={task.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-white">{task.campaigns?.title}</h3>
                        <p className="text-slate-400 text-sm">
                          Platform: {task.campaigns?.target_platform} | Type: {task.campaigns?.campaign_type}
                        </p>
                        <p className="text-slate-400 text-sm">
                          Submitted: {new Date(task.submitted_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-400">
                          ${task.reward_amount}
                        </div>
                        <div className="text-sm text-slate-400">reward</div>
                      </div>
                    </div>

                    {task.proof_url && (
                      <div className="mb-3">
                        <span className="text-slate-400 text-sm">Proof URL: </span>
                        <a 
                          href={task.proof_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          {task.proof_url}
                        </a>
                      </div>
                    )}

                    {task.proof_data && (
                      <div className="mb-4">
                        <span className="text-slate-400 text-sm">Proof Data: </span>
                        <p className="text-white text-sm">{JSON.stringify(task.proof_data)}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={() => approveTaskMutation.mutate({ taskId: task.id })}
                        disabled={approveTaskMutation.isPending}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => rejectTaskMutation.mutate({ taskId: task.id, adminNote: 'Quality does not meet requirements' })}
                        disabled={rejectTaskMutation.isPending}
                        size="sm"
                        variant="destructive"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No pending reviews</h3>
                <p className="text-slate-400">All task submissions have been reviewed.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCampaigns;
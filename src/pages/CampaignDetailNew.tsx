import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase as _supabase } from '@/integrations/supabase/client';
const supabase = _supabase as any;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Upload, 
  DollarSign, 
  Clock, 
  Users, 
  Target,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';

const CampaignDetailNew: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [proofDescription, setProofDescription] = useState('');
  const [proofUrl, setProofUrl] = useState('');

  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: userTask } = useQuery({
    queryKey: ['user-campaign-task', id, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('campaign_tasks')
        .select('*')
        .eq('campaign_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  const startTaskMutation = useMutation({
    mutationFn: async () => {
      if (!user || !campaign) throw new Error('User not authenticated');
      
      // Call the assign_task_to_user function
      const { data: availableTask } = await supabase
        .from('campaign_tasks')
        .select('id')
        .eq('campaign_id', campaign.id)
        .eq('status', 'available')
        .is('user_id', null)
        .limit(1)
        .single();
      
      if (!availableTask) throw new Error('No available tasks');
      
      const { data, error } = await supabase.rpc('assign_task_to_user', {
        task_id: availableTask.id,
        user_id: user.id
      });
      
      if (error || !data) throw new Error('Failed to assign task');
      
      return availableTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-campaign-task'] });
      toast({
        title: "Task Started!",
        description: "You've successfully started this campaign task.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const submitTaskMutation = useMutation({
    mutationFn: async () => {
      if (!userTask) throw new Error('No task assigned');
      
      const { error } = await supabase
        .from('campaign_tasks')
        .update({
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          proof_url: proofUrl,
          proof_data: proofDescription ? { description: proofDescription } : null,
        })
        .eq('id', userTask.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-campaign-task'] });
      toast({
        title: "Task Submitted!",
        description: "Your task has been submitted for review.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit task. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <h3 className="text-xl font-semibold text-white">Loading Campaign</h3>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
          <h3 className="text-xl font-semibold text-white">Campaign Not Found</h3>
          <Button onClick={() => navigate('/campaigns')} variant="outline">
            Back to Campaigns
          </Button>
        </div>
      </div>
    );
  }

  const completionRate = (campaign.completed_tasks / campaign.max_tasks) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/campaigns')}
            className="text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaigns
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Campaign Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-white mb-2">
                      {campaign.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {campaign.status}
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {campaign.campaign_type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-400">
                      ${campaign.reward_per_task}
                    </div>
                    <div className="text-sm text-slate-400">per task</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-white mb-2">Description</h3>
                  <p className="text-slate-300">{campaign.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">Requirements</h3>
                  <p className="text-slate-300">{campaign.proof_requirements || 'Follow the campaign instructions and provide proof of completion.'}</p>
                </div>

                {campaign.target_url && (
                  <div>
                    <h3 className="font-semibold text-white mb-2">Target URL</h3>
                    <a 
                      href={campaign.target_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 break-all"
                    >
                      {campaign.target_url}
                    </a>
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-purple-400">Platform</span>
                    </div>
                    <div className="font-semibold text-white capitalize">
                      {campaign.target_platform}
                    </div>
                  </div>
                  <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-orange-400">Deadline</span>
                    </div>
                    <div className="font-semibold text-white">
                      {new Date(campaign.end_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-blue-400">Progress</span>
                    </div>
                    <div className="font-semibold text-white">
                      {campaign.completed_tasks}/{campaign.max_tasks}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Campaign Progress</span>
                    <span className="text-white">{completionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Task Action Panel */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Task Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!userTask ? (
                  <div className="text-center space-y-4">
                    <Zap className="w-12 h-12 text-blue-400 mx-auto" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">Ready to Start?</h3>
                      <p className="text-sm text-slate-400 mb-4">
                        Click below to claim your task and start earning!
                      </p>
                      <Button
                        onClick={() => startTaskMutation.mutate()}
                        disabled={startTaskMutation.isPending || campaign.status !== 'active'}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        {startTaskMutation.isPending ? 'Starting...' : 'Start Task'}
                      </Button>
                    </div>
                  </div>
                ) : userTask.status === 'assigned' ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-white">Task Assigned!</h3>
                      <p className="text-sm text-slate-400">Complete the task and submit proof below.</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="proof_url" className="text-slate-300">Proof URL (optional)</Label>
                      <Input
                        id="proof_url"
                        value={proofUrl}
                        onChange={(e) => setProofUrl(e.target.value)}
                        placeholder="https://example.com/proof"
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="proof_description" className="text-slate-300">Proof Description</Label>
                      <Textarea
                        id="proof_description"
                        value={proofDescription}
                        onChange={(e) => setProofDescription(e.target.value)}
                        placeholder="Describe how you completed the task..."
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                        rows={4}
                        required
                      />
                    </div>

                    <Button
                      onClick={() => submitTaskMutation.mutate()}
                      disabled={submitTaskMutation.isPending || !proofDescription.trim()}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {submitTaskMutation.isPending ? 'Submitting...' : 'Submit Task'}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                      userTask.status === 'submitted' ? 'bg-yellow-500/20' :
                      userTask.status === 'approved' ? 'bg-green-500/20' :
                      'bg-red-500/20'
                    }`}>
                      {userTask.status === 'submitted' ? (
                        <Clock className="w-6 h-6 text-yellow-400" />
                      ) : userTask.status === 'approved' ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white capitalize">{userTask.status}</h3>
                      <p className="text-sm text-slate-400">
                        {userTask.status === 'submitted' && 'Your task is under review'}
                        {userTask.status === 'approved' && `Task completed! You earned $${userTask.reward_amount}`}
                        {userTask.status === 'rejected' && 'Task was rejected. Please try again.'}
                      </p>
                      {userTask.admin_note && (
                        <div className="mt-2 p-2 bg-slate-700 rounded text-sm">
                          <strong>Admin Note:</strong> {userTask.admin_note}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Campaign Stats */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Campaign Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Budget</span>
                  <span className="text-white font-semibold">${campaign.total_budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Spent</span>
                  <span className="text-white font-semibold">${campaign.spent_budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Participants</span>
                  <span className="text-white font-semibold">{campaign.completed_tasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Success Rate</span>
                  <span className="text-green-400 font-semibold">
                    {campaign.max_tasks > 0 ? (completionRate.toFixed(1)) : 0}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailNew;
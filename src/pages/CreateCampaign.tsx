
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Target, DollarSign, Users, Calendar } from 'lucide-react';

interface CampaignFormData {
  title: string;
  description: string;
  campaign_type: string;
  target_platform: string;
  target_url: string;
  reward_per_task: number;
  total_budget: number;
  max_tasks: number;
  start_date: string;
  end_date: string;
  target_countries: string[];
  target_cities: string[];
  target_interests: string[];
  target_age_min: number;
  target_age_max: number;
  proof_requirements: string;
}

const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<CampaignFormData>({
    title: '',
    description: '',
    campaign_type: '',
    target_platform: '',
    target_url: '',
    reward_per_task: 0,
    total_budget: 0,
    max_tasks: 0,
    start_date: '',
    end_date: '',
    target_countries: [],
    target_cities: [],
    target_interests: [],
    target_age_min: 18,
    target_age_max: 65,
    proof_requirements: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a campaign.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First create or get client profile
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let clientId = clientData?.id;

      if (!clientId) {
        // Create client profile if it doesn't exist
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({
            user_id: user.id,
            company_name: 'Default Company',
            business_email: user.email || 'test@example.com',
            verification_status: 'pending'
          })
          .select('id')
          .single();

        if (clientError) {
          throw clientError;
        }
        clientId = newClient.id;
      }

      // Create the campaign with required client_id
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .insert({
          client_id: clientId,
          title: formData.title,
          description: formData.description,
          campaign_type: formData.campaign_type as any,
          target_platform: formData.target_platform as any,
          target_url: formData.target_url,
          reward_per_task: formData.reward_per_task,
          total_budget: formData.total_budget,
          max_tasks: formData.max_tasks,
          start_date: formData.start_date,
          end_date: formData.end_date,
          target_countries: formData.target_countries,
          target_cities: formData.target_cities,
          target_interests: formData.target_interests,
          target_age_min: formData.target_age_min,
          target_age_max: formData.target_age_max,
          proof_requirements: formData.proof_requirements,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully!",
      });

      navigate('/campaigns');
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof CampaignFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Create Campaign
            </h1>
            <p className="text-slate-300">Launch your social media marketing campaign</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Campaign Basics */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-blue-400" />
                Campaign Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-slate-300">Campaign Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="Enter campaign title"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-slate-300">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Describe your campaign objectives"
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campaign_type" className="text-slate-300">Campaign Type</Label>
                  <Select value={formData.campaign_type} onValueChange={(value) => updateFormData('campaign_type', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select campaign type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="follower_growth">Follower Growth</SelectItem>
                      <SelectItem value="engagement_boost">Engagement Boost</SelectItem>
                      <SelectItem value="content_amplification">Content Amplification</SelectItem>
                      <SelectItem value="surveys">Surveys</SelectItem>
                      <SelectItem value="app_installs">App Installs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="target_platform" className="text-slate-300">Target Platform</Label>
                  <Select value={formData.target_platform} onValueChange={(value) => updateFormData('target_platform', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="target_url" className="text-slate-300">Target URL</Label>
                <Input
                  id="target_url"
                  value={formData.target_url}
                  onChange={(e) => updateFormData('target_url', e.target.value)}
                  placeholder="https://example.com"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Budget & Rewards */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="w-5 h-5 text-green-400" />
                Budget & Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="reward_per_task" className="text-slate-300">Reward per Task ($)</Label>
                  <Input
                    id="reward_per_task"
                    type="number"
                    value={formData.reward_per_task}
                    onChange={(e) => updateFormData('reward_per_task', parseFloat(e.target.value) || 0)}
                    placeholder="5.00"
                    step="0.01"
                    min="0"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="max_tasks" className="text-slate-300">Max Tasks</Label>
                  <Input
                    id="max_tasks"
                    type="number"
                    value={formData.max_tasks}
                    onChange={(e) => updateFormData('max_tasks', parseInt(e.target.value) || 0)}
                    placeholder="100"
                    min="1"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="total_budget" className="text-slate-300">Total Budget ($)</Label>
                  <Input
                    id="total_budget"
                    type="number"
                    value={formData.total_budget}
                    onChange={(e) => updateFormData('total_budget', parseFloat(e.target.value) || 0)}
                    placeholder="500.00"
                    step="0.01"
                    min="0"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Targeting */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-purple-400" />
                Audience Targeting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="target_age_min" className="text-slate-300">Min Age</Label>
                  <Input
                    id="target_age_min"
                    type="number"
                    value={formData.target_age_min}
                    onChange={(e) => updateFormData('target_age_min', parseInt(e.target.value) || 18)}
                    min="13"
                    max="100"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="target_age_max" className="text-slate-300">Max Age</Label>
                  <Input
                    id="target_age_max"
                    type="number"
                    value={formData.target_age_max}
                    onChange={(e) => updateFormData('target_age_max', parseInt(e.target.value) || 65)}
                    min="13"
                    max="100"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="proof_requirements" className="text-slate-300">Proof Requirements</Label>
                <Textarea
                  id="proof_requirements"
                  value={formData.proof_requirements}
                  onChange={(e) => updateFormData('proof_requirements', e.target.value)}
                  placeholder="Describe what proof is required for task completion"
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="w-5 h-5 text-orange-400" />
                Campaign Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date" className="text-slate-300">Start Date</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => updateFormData('start_date', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="end_date" className="text-slate-300">End Date</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => updateFormData('end_date', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isSubmitting ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;

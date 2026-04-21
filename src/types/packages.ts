export interface Package {
  id: string;
  name: string;
  price: number;
  daily_percentage: number;
  duration_days: number;
  min_investment: number;
  max_investment: number;
  campaign_goal_multiplier: number;
  referral_boost_percentage: number;
  max_campaigns: number;
  description: string;
  features: string[];
  is_active: boolean;
  is_popular?: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPackage {
  id: string;
  user_id: string;
  package_id: string;
  purchase_date: string;
  status: 'active' | 'completed' | 'paused';
  target_amount: number;
  total_earned: number;
  daily_earnings: number;
  days_active: number;
  remaining_days?: number;
  last_payout_date?: string;
  created_at: string;
  updated_at: string;
  package?: Package;
}

export interface Campaign {
  id: string;
  client_id: string;
  title: string;
  description: string;
  campaign_type: 'view' | 'like' | 'follow' | 'share' | 'comment';
  target_platform: string;
  target_url: string;
  reward_per_task: number;
  total_budget: number;
  max_tasks: number;
  tasks_completed: number;
  status: 'draft' | 'active' | 'paused' | 'completed';
  start_date?: string;
  end_date?: string;
  targeting_criteria?: any;
  created_at: string;
  updated_at: string;
}

export interface CampaignTask {
  id: string;
  campaign_id: string;
  user_id?: string;
  task_type: string;
  status: 'available' | 'assigned' | 'submitted' | 'approved' | 'rejected' | 'expired';
  reward_amount: number;
  proof_url?: string;
  proof_data?: any;
  assigned_at?: string;
  submitted_at?: string;
  approved_at?: string;
  admin_note?: string;
  created_at: string;
  updated_at: string;
  campaign?: Campaign;
}

export interface ReferralStats {
  total_referrals: number;
  tier1_referrals: number;
  tier2_referrals: number;
  tier3_referrals: number;
  total_commission: number;
  monthly_commission: number;
  rank: string;
  balanced_volume: number;
  personal_sales: number;
}

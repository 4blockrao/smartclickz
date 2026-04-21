
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  TrendingUp, 
  Crown, 
  Target, 
  DollarSign, 
  Award,
  Calendar,
  Zap,
  Copy,
  Share2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EnhancedReferralStatsProps {
  stats: {
    directReferrals: number;
    tier2Referrals: number;
    tier3Referrals: number;
    totalCommissions: number;
    thisMonthCommissions: number;
    balancedVolume: number;
    currentRank: string;
    nextRank: string;
    rankProgress: number;
    monthlyRoyalty: number;
    referralCode: string;
    referralLink: string;
    activeReferrals: number;
    pendingReferrals: number;
    conversionRate: number;
    averageTeamVolume: number;
  };
}

const EnhancedReferralStats: React.FC<EnhancedReferralStatsProps> = ({ stats }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(stats.referralLink);
    toast({
      title: "Link Copied!",
      description: "Your referral link has been copied to clipboard.",
    });
  };

  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join SmartClicks',
        text: 'Start earning daily returns on your social media engagement!',
        url: stats.referralLink,
      });
    } else {
      handleCopyLink();
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'bronze': return 'from-orange-600 to-orange-700';
      case 'silver': return 'from-gray-400 to-gray-500';
      case 'gold': return 'from-yellow-500 to-yellow-600';
      case 'platinum': return 'from-purple-500 to-purple-600';
      case 'diamond': return 'from-blue-500 to-blue-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Team</p>
                <p className="text-3xl font-bold text-white">
                  {stats.directReferrals + stats.tier2Referrals + stats.tier3Referrals}
                </p>
                <p className="text-blue-200 text-xs">Across 3 levels</p>
              </div>
              <Users className="w-10 h-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium">Total Earnings</p>
                <p className="text-3xl font-bold text-white">${stats.totalCommissions.toLocaleString()}</p>
                <p className="text-green-200 text-xs">All time commissions</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">This Month</p>
                <p className="text-3xl font-bold text-white">${stats.thisMonthCommissions.toLocaleString()}</p>
                <p className="text-purple-200 text-xs">Monthly earnings</p>
              </div>
              <Calendar className="w-10 h-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm font-medium">Monthly Royalty</p>
                <p className="text-3xl font-bold text-white">${stats.monthlyRoyalty.toLocaleString()}</p>
                <p className="text-yellow-200 text-xs">Passive income</p>
              </div>
              <Crown className="w-10 h-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link & Sharing */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Share2 className="w-5 h-5 text-blue-400" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={stats.referralLink}
              readOnly
              className="flex-1 bg-slate-700 border-slate-600 text-white px-3 py-2 rounded-md text-sm"
            />
            <Button onClick={handleCopyLink} size="sm" variant="outline" className="border-slate-600">
              <Copy className="w-4 h-4" />
            </Button>
            <Button onClick={handleShareLink} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 text-sm">Your Referral Code</span>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {stats.referralCode}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">{stats.activeReferrals}</div>
                <div className="text-slate-400">Active</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-400">{stats.pendingReferrals}</div>
                <div className="text-slate-400">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">{stats.conversionRate}%</div>
                <div className="text-slate-400">Conversion</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Breakdown & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5 text-blue-400" />
              Team Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div>
                  <span className="text-blue-400 font-semibold">Level 1 (Direct)</span>
                  <p className="text-xs text-slate-400">15% commission</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">{stats.directReferrals}</div>
                  <div className="text-xs text-blue-400">referrals</div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div>
                  <span className="text-green-400 font-semibold">Level 2</span>
                  <p className="text-xs text-slate-400">5% commission</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">{stats.tier2Referrals}</div>
                  <div className="text-xs text-green-400">referrals</div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div>
                  <span className="text-purple-400 font-semibold">Level 3</span>
                  <p className="text-xs text-slate-400">2% commission</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">{stats.tier3Referrals}</div>
                  <div className="text-xs text-purple-400">referrals</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Balanced Volume</span>
                  <span className="text-purple-400 font-semibold">
                    ${stats.balancedVolume.toLocaleString()}
                  </span>
                </div>
                <Progress value={75} className="h-2 bg-slate-700" />
                <p className="text-xs text-slate-400 mt-1">Monthly target: $50,000</p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Average Team Volume</span>
                  <span className="text-blue-400 font-semibold">
                    ${stats.averageTeamVolume.toLocaleString()}
                  </span>
                </div>
                <Progress value={60} className="h-2 bg-slate-700" />
                <p className="text-xs text-slate-400 mt-1">Per team member</p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-300 text-sm">Current Rank</span>
                    <div className={`text-lg font-bold bg-gradient-to-r ${getRankColor(stats.currentRank)} bg-clip-text text-transparent`}>
                      {stats.currentRank}
                    </div>
                  </div>
                  <Award className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rank Progress */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="w-5 h-5 text-orange-400" />
            Rank Advancement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Progress to {stats.nextRank}
                </h3>
                <p className="text-slate-400 text-sm">Continue building your team to unlock new benefits</p>
              </div>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                {stats.rankProgress}% Complete
              </Badge>
            </div>
            
            <Progress value={stats.rankProgress} className="h-3 bg-slate-700" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                <div className="text-sm text-slate-300">Next Level Perks</div>
                <div className="text-xs text-slate-400">Higher commissions</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                <Crown className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <div className="text-sm text-slate-300">Leadership Bonus</div>
                <div className="text-xs text-slate-400">Monthly royalties</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                <Award className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-sm text-slate-300">Exclusive Access</div>
                <div className="text-xs text-slate-400">VIP features</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedReferralStats;

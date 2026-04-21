
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, TrendingUp, Crown, Target, DollarSign } from 'lucide-react';

interface ReferralStatsProps {
  stats: {
    directReferrals: number;
    tier2Referrals: number;
    tier3Referrals: number;
    totalCommissions: number;
    balancedVolume: number;
    currentRank: string;
    nextRank: string;
    rankProgress: number;
    monthlyRoyalty: number;
  };
}

const ReferralStats: React.FC<ReferralStatsProps> = ({ stats }) => {
  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'bronze': return 'text-orange-600';
      case 'silver': return 'text-gray-600';
      case 'gold': return 'text-yellow-600';
      case 'platinum': return 'text-purple-600';
      case 'diamond': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            Team Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Tier 1 (15%)</span>
            <span className="font-semibold">{stats.directReferrals}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Tier 2 (5%)</span>
            <span className="font-semibold">{stats.tier2Referrals}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Tier 3 (2%)</span>
            <span className="font-semibold">{stats.tier3Referrals}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            Commissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            ${stats.totalCommissions.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            Total earned from referrals
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            Balanced Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            ${stats.balancedVolume.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            Monthly BV (10% match)
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Crown className="h-4 w-4 text-yellow-500" />
            Rank & Royalty
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className={getRankColor(stats.currentRank)}>
              {stats.currentRank}
            </Badge>
            {stats.monthlyRoyalty > 0 && (
              <span className="text-sm font-semibold text-yellow-600">
                ${stats.monthlyRoyalty.toLocaleString()}/mo
              </span>
            )}
          </div>
          {stats.nextRank && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress to {stats.nextRank}</span>
                <span>{stats.rankProgress}%</span>
              </div>
              <Progress value={stats.rankProgress} className="h-1" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralStats;

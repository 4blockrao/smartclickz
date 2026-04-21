
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Crown, DollarSign, TrendingUp, Award, Target } from 'lucide-react';

interface ReferralPlanProps {
  currentLevel: number;
  directReferrals: number;
  teamVolume: number;
  monthlyCommissions: number;
}

const REFERRAL_LEVELS = [
  {
    level: 1,
    title: "Networker",
    requirements: { directReferrals: 0, teamVolume: 0 },
    benefits: {
      directCommission: 15,
      level2Commission: 5,
      level3Commission: 2,
      bonuses: ["Welcome bonus", "Basic support"],
      monthlyRoyalty: 0
    },
    color: "from-gray-500 to-gray-600"
  },
  {
    level: 2,
    title: "Bronze Leader",
    requirements: { directReferrals: 3, teamVolume: 1000 },
    benefits: {
      directCommission: 18,
      level2Commission: 6,
      level3Commission: 3,
      bonuses: ["Leadership bonus", "Priority support", "Team building tools"],
      monthlyRoyalty: 100
    },
    color: "from-orange-600 to-orange-700"
  },
  {
    level: 3,
    title: "Silver Leader",
    requirements: { directReferrals: 5, teamVolume: 5000 },
    benefits: {
      directCommission: 20,
      level2Commission: 8,
      level3Commission: 4,
      bonuses: ["Silver rewards", "Advanced analytics", "1-on-1 coaching"],
      monthlyRoyalty: 300
    },
    color: "from-gray-400 to-gray-500"
  },
  {
    level: 4,
    title: "Gold Leader",
    requirements: { directReferrals: 10, teamVolume: 15000 },
    benefits: {
      directCommission: 22,
      level2Commission: 10,
      level3Commission: 5,
      bonuses: ["Gold perks", "VIP events", "Custom strategies"],
      monthlyRoyalty: 750
    },
    color: "from-yellow-500 to-yellow-600"
  },
  {
    level: 5,
    title: "Platinum Leader",
    requirements: { directReferrals: 20, teamVolume: 50000 },
    benefits: {
      directCommission: 25,
      level2Commission: 12,
      level3Commission: 6,
      bonuses: ["Platinum benefits", "Global recognition", "Exclusive mastermind"],
      monthlyRoyalty: 2000
    },
    color: "from-purple-500 to-purple-600"
  },
  {
    level: 6,
    title: "Diamond Elite",
    requirements: { directReferrals: 50, teamVolume: 150000 },
    benefits: {
      directCommission: 30,
      level2Commission: 15,
      level3Commission: 8,
      bonuses: ["Diamond status", "Luxury rewards", "Executive advisory board"],
      monthlyRoyalty: 5000
    },
    color: "from-blue-500 to-blue-600"
  }
];

const ReferralPlan: React.FC<ReferralPlanProps> = ({
  currentLevel,
  directReferrals,
  teamVolume,
  monthlyCommissions
}) => {
  const currentLevelData = REFERRAL_LEVELS[currentLevel - 1] || REFERRAL_LEVELS[0];
  const nextLevelData = REFERRAL_LEVELS[currentLevel] || null;

  const calculateProgress = (current: number, required: number) => {
    return Math.min((current / required) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Crown className="w-6 h-6 text-yellow-400" />
            Your Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-2xl font-bold bg-gradient-to-r ${currentLevelData.color} bg-clip-text text-transparent`}>
                {currentLevelData.title}
              </h3>
              <p className="text-slate-300">Level {currentLevel}</p>
            </div>
            <Badge className={`bg-gradient-to-r ${currentLevelData.color} text-white px-4 py-2`}>
              Active
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{directReferrals}</div>
              <div className="text-sm text-slate-300">Direct Referrals</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">${teamVolume.toLocaleString()}</div>
              <div className="text-sm text-slate-300">Team Volume</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <DollarSign className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">${monthlyCommissions.toLocaleString()}</div>
              <div className="text-sm text-slate-300">Monthly Earnings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress to Next Level */}
      {nextLevelData && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="w-6 h-6 text-purple-400" />
              Progress to {nextLevelData.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">Direct Referrals</span>
                <span className="text-purple-400">
                  {directReferrals} / {nextLevelData.requirements.directReferrals}
                </span>
              </div>
              <Progress 
                value={calculateProgress(directReferrals, nextLevelData.requirements.directReferrals)} 
                className="h-2 bg-slate-700"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">Team Volume</span>
                <span className="text-purple-400">
                  ${teamVolume.toLocaleString()} / ${nextLevelData.requirements.teamVolume.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={calculateProgress(teamVolume, nextLevelData.requirements.teamVolume)} 
                className="h-2 bg-slate-700"
              />
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
              <h4 className="font-semibold text-white mb-2">Upcoming Benefits:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-300">Direct Commission:</span>
                  <span className="text-green-400 font-semibold ml-2">
                    {nextLevelData.benefits.directCommission}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-300">Monthly Royalty:</span>
                  <span className="text-yellow-400 font-semibold ml-2">
                    ${nextLevelData.benefits.monthlyRoyalty}/mo
                  </span>
                </div>
                <div>
                  <span className="text-slate-300">Level 2 Bonus:</span>
                  <span className="text-blue-400 font-semibold ml-2">
                    {nextLevelData.benefits.level2Commission}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Commission Structure */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <DollarSign className="w-6 h-6 text-green-400" />
            Your Current Commission Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {currentLevelData.benefits.directCommission}%
              </div>
              <div className="text-sm text-slate-300">Direct Referrals</div>
              <div className="text-xs text-slate-400 mt-1">Level 1</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {currentLevelData.benefits.level2Commission}%
              </div>
              <div className="text-sm text-slate-300">Second Level</div>
              <div className="text-xs text-slate-400 mt-1">Level 2</div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {currentLevelData.benefits.level3Commission}%
              </div>
              <div className="text-sm text-slate-300">Third Level</div>
              <div className="text-xs text-slate-400 mt-1">Level 3</div>
            </div>
          </div>

          {currentLevelData.benefits.monthlyRoyalty > 0 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Leadership Royalty</h4>
                  <p className="text-sm text-slate-300">Monthly passive income</p>
                </div>
                <div className="text-2xl font-bold text-yellow-400">
                  ${currentLevelData.benefits.monthlyRoyalty}/mo
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Levels Overview */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Award className="w-6 h-6 text-purple-400" />
            Complete Referral Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {REFERRAL_LEVELS.map((level, index) => (
              <div
                key={level.level}
                className={`p-4 rounded-lg border transition-all ${
                  level.level === currentLevel
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50'
                    : level.level < currentLevel
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-slate-700/30 border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center text-white font-bold`}>
                      {level.level}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{level.title}</h3>
                      <p className="text-xs text-slate-400">Level {level.level}</p>
                    </div>
                  </div>
                  {level.level === currentLevel && (
                    <Badge className="bg-blue-500 text-white">Current</Badge>
                  )}
                  {level.level < currentLevel && (
                    <Badge className="bg-green-500 text-white">Achieved</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                  <div>
                    <span className="text-slate-400">Requirements:</span>
                    <div className="text-white font-medium">
                      {level.requirements.directReferrals} refs
                    </div>
                    <div className="text-white font-medium">
                      ${level.requirements.teamVolume.toLocaleString()} vol
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Direct:</span>
                    <div className="text-green-400 font-semibold">
                      {level.benefits.directCommission}%
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Level 2:</span>
                    <div className="text-blue-400 font-semibold">
                      {level.benefits.level2Commission}%
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Level 3:</span>
                    <div className="text-purple-400 font-semibold">
                      {level.benefits.level3Commission}%
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Royalty:</span>
                    <div className="text-yellow-400 font-semibold">
                      ${level.benefits.monthlyRoyalty}/mo
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralPlan;

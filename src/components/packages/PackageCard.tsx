
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Star, Zap, TrendingUp } from 'lucide-react';
import { Package } from '@/types/packages';

interface PackageCardProps {
  package: Package;
  onPurchase: (pkg: Package) => void;
  isActive?: boolean;
}

const PackageCard: React.FC<PackageCardProps> = ({ 
  package: pkg, 
  onPurchase, 
  isActive = false 
}) => {
  const totalReturn = (pkg.price * pkg.daily_percentage * pkg.duration_days) / 100;
  const roi = ((totalReturn - pkg.price) / pkg.price) * 100;

  return (
    <Card 
      className={`relative bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 ${
        pkg.is_popular ? 'ring-2 ring-blue-500/50 scale-105' : ''
      } ${isActive ? 'ring-2 ring-green-500/50' : ''}`}
    >
      {pkg.is_popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      {isActive && (
        <div className="absolute -top-4 right-4">
          <Badge className="bg-green-500 text-white">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-white">{pkg.name}</CardTitle>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-blue-400">
            ${pkg.price}
          </div>
          <div className="text-sm text-slate-300">
            Minimum investment
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="text-lg font-bold text-green-400">{pkg.daily_percentage}%</div>
            <div className="text-xs text-slate-300">Daily Return</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="text-lg font-bold text-purple-400">{pkg.duration_days}</div>
            <div className="text-xs text-slate-300">Days</div>
          </div>
        </div>

        {/* Investment Range */}
        <div className="text-center">
          <div className="text-sm text-slate-300 mb-1">Investment Range</div>
          <div className="text-lg font-semibold text-white">
            ${pkg.min_investment} - ${pkg.max_investment}
          </div>
        </div>

        {/* ROI Calculation */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-3 border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 text-sm">Total Return</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-xl font-bold text-green-400">
            ${totalReturn.toFixed(2)}
          </div>
          <div className="text-sm text-slate-400">
            ROI: {roi.toFixed(1)}%
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white text-sm">Features:</h4>
          <ul className="space-y-1">
            {pkg.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Campaign Multiplier */}
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-slate-300">Campaign Boost</span>
          </div>
          <div className="text-lg font-bold text-yellow-400">
            {pkg.campaign_goal_multiplier}x
          </div>
          <div className="text-xs text-slate-400">Earning multiplier</div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => onPurchase(pkg)}
          disabled={isActive}
          className={`w-full text-white font-semibold ${
            isActive
              ? 'bg-slate-600 cursor-not-allowed'
              : pkg.is_popular
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              : 'bg-slate-700 hover:bg-slate-600'
          }`}
          size="lg"
        >
          {isActive ? 'Currently Active' : 'Choose Package'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PackageCard;

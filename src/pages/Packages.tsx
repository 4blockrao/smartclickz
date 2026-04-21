
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Star, Zap, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Package } from '@/types/packages';

// Mock packages data since the table doesn't exist yet
const mockPackages: Package[] = [
  {
    id: "1",
    name: "Starter",
    price: 50,
    daily_percentage: 2.5,
    duration_days: 30,
    min_investment: 50,
    max_investment: 500,
    campaign_goal_multiplier: 1.0,
    referral_boost_percentage: 5,
    max_campaigns: 10,
    description: "Perfect for beginners",
    features: ["Basic campaigns", "Standard support", "Weekly payouts"],
    is_popular: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2", 
    name: "Professional",
    price: 200,
    daily_percentage: 3.5,
    duration_days: 60,
    min_investment: 200,
    max_investment: 2000,
    campaign_goal_multiplier: 1.5,
    referral_boost_percentage: 10,
    max_campaigns: 25,
    description: "Most popular choice",
    features: ["Premium campaigns", "Priority support", "Daily payouts", "Advanced analytics"],
    is_popular: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    name: "Enterprise", 
    price: 1000,
    daily_percentage: 5.0,
    duration_days: 90,
    min_investment: 1000,
    max_investment: 10000,
    campaign_goal_multiplier: 2.0,
    referral_boost_percentage: 15,
    max_campaigns: 100,
    description: "For serious investors",
    features: ["VIP campaigns", "24/7 support", "Instant payouts", "Custom strategies", "Dedicated manager"],
    is_popular: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const Packages: React.FC = () => {
  const { user } = useAuth();

  // Mock user packages query
  const { data: userPackages = [] } = useQuery({
    queryKey: ['user-packages', user?.id],
    queryFn: async () => {
      // Return empty array since table doesn't exist yet
      return [];
    },
    enabled: !!user
  });

  const handlePurchasePackage = async (packageData: Package) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to purchase a package.",
        variant: "destructive",
      });
      return;
    }

    // Mock purchase logic
    toast({
      title: "Package Purchase",
      description: `Package "${packageData.name}" purchase initiated. This feature will be fully implemented soon.`,
    });
  };

  const hasActivePackage = userPackages.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Investment Packages
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Choose your investment tier and start earning daily returns from social media campaigns
          </p>
        </div>

        {/* Active Package Status */}
        {hasActivePackage && (
          <Card className="mb-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30">
            <CardContent className="py-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Active Investment</h3>
                  <p className="text-slate-300">You have an active investment package</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {mockPackages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`relative bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 ${
                pkg.is_popular ? 'ring-2 ring-blue-500/50 scale-105' : ''
              }`}
            >
              {pkg.is_popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
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

                {/* CTA Button */}
                <Button
                  onClick={() => handlePurchasePackage(pkg)}
                  className={`w-full text-white font-semibold ${
                    pkg.is_popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  size="lg"
                >
                  {hasActivePackage ? 'Upgrade Package' : 'Choose Package'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center flex items-center justify-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-400">1</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Choose Package</h3>
                <p className="text-slate-300 text-sm">Select an investment package that fits your budget and goals</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-purple-400">2</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Complete Campaigns</h3>
                <p className="text-slate-300 text-sm">Participate in social media campaigns to earn daily returns</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-green-400">3</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Earn Returns</h3>
                <p className="text-slate-300 text-sm">Receive guaranteed daily returns on your investment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Packages;

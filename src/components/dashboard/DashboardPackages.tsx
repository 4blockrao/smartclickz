
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  TrendingUp, 
  Target, 
  Calendar,
  DollarSign,
  ArrowRight,
  Star,
  Crown,
  Award,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

const DashboardPackages = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("available");
  
  // Mock available packages - in real implementation, fetch from Supabase
  const availablePackages = [
    {
      id: 1,
      name: "Starter",
      price: 50,
      dailyPercentage: 0.3,
      duration: 100,
      maxEarnings: 100, // 2x package price
      description: "Perfect for beginners",
      features: ["Basic campaign access", "Email support", "Mobile app access"],
      isPopular: false,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      name: "Bronze",
      price: 100,
      dailyPercentage: 0.4,
      duration: 100,
      maxEarnings: 200,
      description: "Great for growing your presence",
      features: ["Priority task access", "Advanced analytics", "Live chat support"],
      isPopular: false,
      color: "from-orange-500 to-orange-600"
    },
    {
      id: 3,
      name: "Silver",
      price: 250,
      dailyPercentage: 0.5,
      duration: 100,
      maxEarnings: 500,
      description: "Ideal for serious marketers",
      features: ["Premium campaigns", "Custom targeting", "Priority support"],
      isPopular: true,
      color: "from-gray-400 to-gray-500"
    },
    {
      id: 4,
      name: "Gold",
      price: 500,
      dailyPercentage: 0.6,
      duration: 100,
      maxEarnings: 1000,
      description: "For ambitious entrepreneurs",
      features: ["Exclusive campaigns", "Personal account manager", "Advanced tools"],
      isPopular: false,
      color: "from-yellow-500 to-yellow-600"
    },
    {
      id: 5,
      name: "Platinum",
      price: 1000,
      dailyPercentage: 0.7,
      duration: 100,
      maxEarnings: 2000,
      description: "Professional-grade acceleration",
      features: ["VIP campaign access", "Custom strategies", "24/7 dedicated support"],
      isPopular: false,
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 6,
      name: "Diamond",
      price: 2500,
      dailyPercentage: 0.8,
      duration: 100,
      maxEarnings: 5000,
      description: "Elite package for professionals",
      features: ["Unlimited campaigns", "White-label options", "API access"],
      isPopular: false,
      color: "from-cyan-500 to-cyan-600"
    },
    {
      id: 7,
      name: "Elite",
      price: 5000,
      dailyPercentage: 0.9,
      duration: 100,
      maxEarnings: 10000,
      description: "The ultimate powerhouse",
      features: ["Enterprise features", "Custom integrations", "Personal consultant"],
      isPopular: false,
      color: "from-pink-500 to-pink-600"
    }
  ];

  // Mock user's purchased packages
  const userPackages = [
    {
      id: 1,
      packageName: "Gold Package",
      purchaseDate: "2024-01-15",
      purchaseAmount: 500,
      currentEarnings: 750,
      targetEarnings: 1000,
      dailyEarnings: 16.67,
      daysActive: 45,
      remainingDays: 55,
      status: "active",
      dailyPercentage: 0.6
    },
    {
      id: 2,
      packageName: "Silver Package",
      purchaseDate: "2024-02-01",
      purchaseAmount: 250,
      currentEarnings: 300,
      targetEarnings: 500,
      dailyEarnings: 10,
      daysActive: 30,
      remainingDays: 70,
      status: "active",
      dailyPercentage: 0.5
    }
  ];

  const handlePurchasePackage = (packageId: number) => {
    // Navigate to payment flow
    console.log(`Purchasing package ${packageId}`);
    // In real implementation, integrate with Stripe/PayPal
  };

  const getPackageIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'starter': return <Package className="w-5 h-5" />;
      case 'bronze': return <Award className="w-5 h-5" />;
      case 'silver': return <Star className="w-5 h-5" />;
      case 'gold': return <Crown className="w-5 h-5" />;
      case 'platinum': return <Zap className="w-5 h-5" />;
      case 'diamond': return <Star className="w-5 h-5" />;
      case 'elite': return <Crown className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Package Management</h1>
          <p className="text-slate-300">Manage your investment packages and track performance</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 bg-white/10 backdrop-blur-lg border-white/20">
          <TabsTrigger 
            value="available" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/70"
          >
            <Package className="w-4 h-4 mr-2" />
            Available Packages
          </TabsTrigger>
          <TabsTrigger 
            value="my-packages" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/70"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            My Packages
          </TabsTrigger>
        </TabsList>

        {/* Available Packages Tab */}
        <TabsContent value="available" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`bg-white/10 backdrop-blur-lg border-white/20 relative overflow-hidden ${
                  pkg.isPopular ? 'ring-2 ring-purple-500' : ''
                }`}>
                  {pkg.isPopular && (
                    <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                      POPULAR
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center mx-auto mb-3`}>
                      {getPackageIcon(pkg.name)}
                    </div>
                    <CardTitle className="text-white">{pkg.name}</CardTitle>
                    <div className="text-3xl font-bold text-white">${pkg.price}</div>
                    <p className="text-slate-300 text-sm">{pkg.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Daily Return:</span>
                        <span className="text-green-400 font-bold">{pkg.dailyPercentage}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Max Earnings:</span>
                        <span className="text-purple-400 font-bold">${pkg.maxEarnings}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">ROI:</span>
                        <span className="text-blue-400 font-bold">200%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-white font-medium text-sm">Features:</h4>
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Button 
                      onClick={() => handlePurchasePackage(pkg.id)}
                      className={`w-full bg-gradient-to-r ${pkg.color} hover:opacity-90 text-white font-semibold`}
                    >
                      Purchase Package
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* My Packages Tab */}
        <TabsContent value="my-packages" className="space-y-6">
          {userPackages.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="text-center py-12">
                <Package className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-semibold text-white mb-2">No packages yet</h3>
                <p className="text-slate-300 mb-4">Purchase your first package to start earning</p>
                <Button onClick={() => setActiveTab("available")}>
                  Browse Packages
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {userPackages.map((pkg, index) => {
                const progress = (pkg.currentEarnings / pkg.targetEarnings) * 100;
                const dailyEarnings = pkg.purchaseAmount * (pkg.dailyPercentage / 100);
                
                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white flex items-center gap-2">
                            <Package className="w-5 h-5 text-purple-400" />
                            {pkg.packageName}
                          </CardTitle>
                          <Badge className={`${
                            pkg.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                          } text-white`}>
                            {pkg.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-white font-bold text-lg">${pkg.purchaseAmount}</div>
                            <div className="text-slate-400 text-sm">Investment</div>
                          </div>
                          <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-green-400 font-bold text-lg">${pkg.currentEarnings}</div>
                            <div className="text-slate-400 text-sm">Earned</div>
                          </div>
                          <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-blue-400 font-bold text-lg">{pkg.daysActive}</div>
                            <div className="text-slate-400 text-sm">Days Active</div>
                          </div>
                          <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-purple-400 font-bold text-lg">{pkg.remainingDays}</div>
                            <div className="text-slate-400 text-sm">Days Left</div>
                          </div>
                        </div>

                        {/* Progress to 2x Target */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-300">Progress to 2x Target (${pkg.targetEarnings})</span>
                            <span className="text-white">{progress.toFixed(1)}%</span>
                          </div>
                          <Progress value={progress} className="h-3" />
                        </div>

                        {/* Daily Performance */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-white/5 rounded-lg">
                            <div className="text-slate-300 text-sm">Daily Percentage</div>
                            <div className="text-green-400 font-bold">{pkg.dailyPercentage}%</div>
                          </div>
                          <div className="p-3 bg-white/5 rounded-lg">
                            <div className="text-slate-300 text-sm">Daily Earnings</div>
                            <div className="text-green-400 font-bold">${dailyEarnings.toFixed(2)}</div>
                          </div>
                        </div>

                        {/* Package Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Calendar className="w-4 h-4" />
                            Purchased: {new Date(pkg.purchaseDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <Target className="w-4 h-4" />
                            Target: ${pkg.targetEarnings}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPackages;

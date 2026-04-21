
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  TrendingUp, 
  Target, 
  Calendar,
  DollarSign,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const DashboardPackagePerformance = () => {
  const navigate = useNavigate();
  
  // Mock data - replace with actual API call
  const userPackages = [
    {
      id: 1,
      name: "Gold Package",
      purchaseAmount: 500,
      currentEarnings: 750,
      targetEarnings: 1000,
      dailyEarnings: 16.67,
      daysActive: 45,
      status: "active",
      roi: 150
    },
    {
      id: 2,
      name: "Silver Package",
      purchaseAmount: 250,
      currentEarnings: 300,
      targetEarnings: 500,
      dailyEarnings: 10,
      daysActive: 30,
      status: "active",
      roi: 120
    }
  ];

  const totalInvestment = userPackages.reduce((sum, pkg) => sum + pkg.purchaseAmount, 0);
  const totalEarnings = userPackages.reduce((sum, pkg) => sum + pkg.currentEarnings, 0);
  const overallROI = totalInvestment > 0 ? ((totalEarnings / totalInvestment) * 100) : 0;

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-400" />
            Package Performance
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/wallet')}
            className="text-purple-300 hover:bg-purple-500/20"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-white/5 rounded-lg">
          <div className="text-center">
            <div className="text-white font-bold">${totalInvestment}</div>
            <div className="text-slate-400 text-xs">Total Investment</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-bold">${totalEarnings}</div>
            <div className="text-slate-400 text-xs">Total Earned</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 font-bold">{overallROI.toFixed(1)}%</div>
            <div className="text-slate-400 text-xs">Overall ROI</div>
          </div>
        </div>

        {/* Package List */}
        <div className="space-y-3">
          {userPackages.map((pkg, index) => {
            const progress = (pkg.currentEarnings / pkg.targetEarnings) * 100;
            
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-medium">{pkg.name}</h4>
                    <Badge className={`${
                      pkg.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                    } text-white text-xs`}>
                      {pkg.status}
                    </Badge>
                  </div>
                  <div className="text-purple-400 font-bold text-sm">
                    ROI: {pkg.roi}%
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-2 text-xs">
                  <div className="flex items-center gap-1 text-slate-300">
                    <DollarSign className="w-3 h-3" />
                    Investment: ${pkg.purchaseAmount}
                  </div>
                  <div className="flex items-center gap-1 text-slate-300">
                    <TrendingUp className="w-3 h-3" />
                    Earned: ${pkg.currentEarnings}
                  </div>
                  <div className="flex items-center gap-1 text-slate-300">
                    <Target className="w-3 h-3" />
                    Target: ${pkg.targetEarnings}
                  </div>
                  <div className="flex items-center gap-1 text-slate-300">
                    <Calendar className="w-3 h-3" />
                    {pkg.daysActive} days active
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Progress to 2x Target</span>
                    <span className="text-white">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="mt-2 text-center text-xs">
                  <span className="text-slate-400">Daily Avg: </span>
                  <span className="text-green-400 font-medium">${pkg.dailyEarnings}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <Button 
          onClick={() => navigate('/wallet')}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          <Package className="w-4 h-4 mr-2" />
          View Detailed Package Analytics
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardPackagePerformance;

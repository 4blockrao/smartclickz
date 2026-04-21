
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Download,
  CreditCard,
  Zap
} from "lucide-react";

const payoutHistory = [
  {
    date: "2024-06-15",
    type: "Balanced Volume Commission",
    amount: 2850,
    status: "completed",
    method: "Bank Transfer",
    reference: "BVC-240615-001"
  },
  {
    date: "2024-06-15",
    type: "Direct Referral Commission",
    amount: 450,
    status: "completed",
    method: "Bank Transfer",
    reference: "DRC-240615-002"
  },
  {
    date: "2024-06-15",
    type: "Task Override Commission",
    amount: 320,
    status: "completed",
    method: "Bank Transfer",
    reference: "TOC-240615-003"
  },
  {
    date: "2024-06-10",
    type: "Royalty Bonus",
    amount: 1200,
    status: "completed",
    method: "Bank Transfer",
    reference: "ROY-240610-004"
  },
  {
    date: "2024-06-01",
    type: "Package Daily Earnings",
    amount: 185,
    status: "pending",
    method: "Bank Transfer",
    reference: "PDE-240601-005"
  }
];

const upcomingPayouts = [
  {
    type: "Balanced Volume Commission",
    estimatedAmount: 3200,
    payoutDate: "2024-07-15",
    status: "calculating",
    description: "Based on June BV performance"
  },
  {
    type: "Direct Referral Commission",
    estimatedAmount: 520,
    payoutDate: "2024-07-15",
    status: "ready",
    description: "3 new direct referrals qualified"
  },
  {
    type: "Royalty Bonus",
    estimatedAmount: 1200,
    payoutDate: "2024-07-01",
    status: "ready",
    description: "Executive tier monthly bonus"
  }
];

const automationRules = [
  {
    type: "Balanced Volume Commission",
    frequency: "Monthly",
    threshold: 50000,
    rate: "20%",
    enabled: true,
    lastRun: "2024-06-15"
  },
  {
    type: "Direct Referral Commission", 
    frequency: "Weekly",
    threshold: 0,
    rate: "15% T1, 5% T2, 2% T3",
    enabled: true,
    lastRun: "2024-06-22"
  },
  {
    type: "Task Override Commission",
    frequency: "Daily",
    threshold: 0,
    rate: "10% T1, 5% T2, 2% T3",
    enabled: true,
    lastRun: "2024-06-23"
  },
  {
    type: "Royalty Bonuses",
    frequency: "Monthly",
    threshold: 100000,
    rate: "Fixed tier amounts",
    enabled: true,
    lastRun: "2024-06-01"
  }
];

export default function DashboardPayouts() {
  const [selectedTab, setSelectedTab] = useState("overview");
  
  const totalEarnings = payoutHistory
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const pendingPayouts = payoutHistory
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const estimatedNext = upcomingPayouts
    .reduce((sum, p) => sum + p.estimatedAmount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Payout System Overview */}
      <Card className="bg-gradient-to-r from-green-900 to-emerald-900 border-green-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <DollarSign className="w-6 h-6 text-green-400" />
            Automated Payout System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                ${totalEarnings.toLocaleString()}
              </div>
              <p className="text-green-200 text-sm">Total Paid Out</p>
              <p className="text-green-300 text-xs">This month</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">
                ${pendingPayouts.toLocaleString()}
              </div>
              <p className="text-green-200 text-sm">Pending Payouts</p>
              <p className="text-green-300 text-xs">Processing</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                ${estimatedNext.toLocaleString()}
              </div>
              <p className="text-green-200 text-sm">Next Payout</p>
              <p className="text-green-300 text-xs">Estimated</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {automationRules.filter(r => r.enabled).length}
              </div>
              <p className="text-green-200 text-sm">Active Rules</p>
              <p className="text-green-300 text-xs">Automated</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payout Management Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-green-600">
            <DollarSign className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-green-600">
            <Calendar className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-green-600">
            <Clock className="w-4 h-4 mr-2" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="automation" className="data-[state=active]:bg-green-600">
            <Zap className="w-4 h-4 mr-2" />
            Automation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payout Breakdown */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">This Month's Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">BV Commission:</span>
                    <span className="text-green-400 font-bold">$2,850</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Royalty Bonus:</span>
                    <span className="text-purple-400 font-bold">$1,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Referral Commission:</span>
                    <span className="text-blue-400 font-bold">$450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Task Overrides:</span>
                    <span className="text-orange-400 font-bold">$320</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Package Earnings:</span>
                    <span className="text-yellow-400 font-bold">$185</span>
                  </div>
                  <div className="border-t border-slate-600 pt-2">
                    <div className="flex justify-between">
                      <span className="text-white font-bold">Total:</span>
                      <span className="text-green-400 font-bold">${totalEarnings.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payout Status */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Daily Calculations:</span>
                    <Badge className="bg-green-500/20 text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Weekly Payouts:</span>
                    <Badge className="bg-green-500/20 text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Monthly Bonuses:</span>
                    <Badge className="bg-green-500/20 text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Bank Integration:</span>
                    <Badge className="bg-green-500/20 text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Next Automation:</span>
                    <span className="text-blue-400 text-sm">Today 6:00 PM</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Payouts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Payout History</CardTitle>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payoutHistory.map((payout, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        payout.status === 'completed' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                      }`}>
                        {payout.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{payout.type}</h4>
                        <p className="text-slate-400 text-sm">
                          {payout.date} • {payout.method} • {payout.reference}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-green-400 font-bold text-lg">
                        ${payout.amount.toLocaleString()}
                      </span>
                      <div>
                        <Badge className={`text-xs ${
                          payout.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {payout.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Upcoming Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingPayouts.map((payout, index) => (
                  <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">{payout.type}</h4>
                      <Badge className={`${
                        payout.status === 'ready' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {payout.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Estimated Amount</p>
                        <p className="text-green-400 font-bold text-lg">
                          ${payout.estimatedAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Payout Date</p>
                        <p className="text-white">{payout.payoutDate}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Description</p>
                        <p className="text-slate-300">{payout.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Automation Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automationRules.map((rule, index) => (
                  <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          rule.enabled ? 'bg-green-400' : 'bg-gray-400'
                        }`}></div>
                        <h4 className="text-white font-medium">{rule.type}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500/20 text-blue-400">
                          {rule.frequency}
                        </Badge>
                        {rule.enabled ? (
                          <Badge className="bg-green-500/20 text-green-400">Enabled</Badge>
                        ) : (
                          <Badge className="bg-gray-500/20 text-gray-400">Disabled</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Threshold</p>
                        <p className="text-white">
                          {rule.threshold > 0 ? `$${rule.threshold.toLocaleString()}` : 'None'}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Rate</p>
                        <p className="text-white">{rule.rate}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Frequency</p>
                        <p className="text-white">{rule.frequency}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Last Run</p>
                        <p className="text-slate-300">{rule.lastRun}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4 mt-6">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Rules
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment Methods
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

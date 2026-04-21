import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePointsWallet } from "@/hooks/usePointsWallet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign, AlertTriangle, CheckCircle, Clock, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface WithdrawalRequest {
  id: string;
  requested_points: number;
  status: string;
  created_at: string;
  admin_note?: string;
}

export default function DashboardWithdrawal() {
  const { user } = useAuth();
  const { pointsBalance, isLoading } = usePointsWallet(user?.id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState("");
  const [withdrawalDetails, setWithdrawalDetails] = useState("");

  // Minimum withdrawal amounts and conversion rates
  const MIN_WITHDRAWAL = 1000; // points
  const POINTS_TO_USD_RATE = 0.01; // 1 point = $0.01
  const withdrawalAmountUSD = parseFloat(withdrawalAmount) * POINTS_TO_USD_RATE;

  const createWithdrawalMutation = useMutation({
    mutationFn: async (data: { points: number; method: string; details: string }) => {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from("withdrawal_requests")
        .insert([
          {
            user_id: user.id,
            requested_points: data.points,
            status: "pending"
          }
        ]);

      if (error) throw error;

      // Update user profile with withdrawal method and details
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          withdrawal_method: data.method,
          withdrawal_details: { method: data.method, details: data.details }
        })
        .eq("user_id", user.id);

      if (profileError) throw profileError;
    },
    onSuccess: () => {
      toast.success("Withdrawal request submitted successfully!");
      setWithdrawalAmount("");
      setWithdrawalMethod("");
      setWithdrawalDetails("");
      queryClient.invalidateQueries({ queryKey: ["withdrawal-requests"] });
    },
    onError: (error) => {
      toast.error("Failed to submit withdrawal request");
      console.error("Withdrawal error:", error);
    },
  });

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const points = parseInt(withdrawalAmount);
    
    if (!points || points < MIN_WITHDRAWAL) {
      toast.error(`Minimum withdrawal is ${MIN_WITHDRAWAL} points`);
      return;
    }
    
    if (points > pointsBalance) {
      toast.error("Insufficient balance");
      return;
    }
    
    if (!withdrawalMethod) {
      toast.error("Please select a withdrawal method");
      return;
    }
    
    if (!withdrawalDetails.trim()) {
      toast.error("Please provide withdrawal details");
      return;
    }

    createWithdrawalMutation.mutate({
      points,
      method: withdrawalMethod,
      details: withdrawalDetails
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Withdraw Earnings</h1>
            <p className="text-slate-300">Convert your points to real money</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Withdrawal Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Request Withdrawal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWithdrawalSubmit} className="space-y-6">
                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-white">Withdrawal Amount (Points)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min={MIN_WITHDRAWAL}
                      max={pointsBalance}
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      placeholder={`Minimum ${MIN_WITHDRAWAL} points`}
                      className="bg-white/10 border-white/20 text-white placeholder-slate-400"
                    />
                    {withdrawalAmount && (
                      <p className="text-sm text-green-400">
                        ≈ ${withdrawalAmountUSD.toFixed(2)} USD
                      </p>
                    )}
                  </div>

                  {/* Withdrawal Method */}
                  <div className="space-y-2">
                    <Label className="text-white">Withdrawal Method</Label>
                    <Select value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cryptocurrency">Cryptocurrency</SelectItem>
                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-2">
                    <Label htmlFor="details" className="text-white">Payment Details</Label>
                    <Textarea
                      id="details"
                      value={withdrawalDetails}
                      onChange={(e) => setWithdrawalDetails(e.target.value)}
                      placeholder={
                        withdrawalMethod === "paypal" ? "Enter your PayPal email address" :
                        withdrawalMethod === "bank_transfer" ? "Enter bank account details (Account number, Bank name, etc.)" :
                        withdrawalMethod === "cryptocurrency" ? "Enter your crypto wallet address" :
                        withdrawalMethod === "mobile_money" ? "Enter your mobile money number" :
                        "Enter your payment details"
                      }
                      className="bg-white/10 border-white/20 text-white placeholder-slate-400"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={createWithdrawalMutation.isPending}
                  >
                    {createWithdrawalMutation.isPending ? "Processing..." : "Submit Withdrawal Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Balance & Info */}
          <div className="space-y-6">
            {/* Current Balance */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  Current Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{pointsBalance.toLocaleString()}</div>
                  <div className="text-slate-300">Points</div>
                  <div className="text-lg text-green-400 mt-2">
                    ≈ ${(pointsBalance * POINTS_TO_USD_RATE).toFixed(2)} USD
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Minimum Withdrawal</span>
                    <span className="text-white">{MIN_WITHDRAWAL.toLocaleString()} points</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Conversion Rate</span>
                    <span className="text-white">1 point = $0.01</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal Info */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  Important Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-blue-400" />
                  <span>Processing time: 3-7 business days</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-400" />
                  <span>All withdrawals are manually reviewed for security</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 text-yellow-400" />
                  <span>Ensure payment details are accurate to avoid delays</span>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal Methods */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-sm">Supported Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="outline" className="text-white border-white/30">PayPal</Badge>
                <Badge variant="outline" className="text-white border-white/30">Bank Transfer</Badge>
                <Badge variant="outline" className="text-white border-white/30">Cryptocurrency</Badge>
                <Badge variant="outline" className="text-white border-white/30">Mobile Money</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
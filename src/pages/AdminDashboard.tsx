import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/integrations/supabase/client";
import { Loader, Users, Target, DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ServicePricingManager } from "@/components/admin/ServicePricingManager";
import AdminHome from "@/pages/admin/AdminHome";

// Only allow admins/super_admins
function useIsAdmin(userId: string | undefined) {
  return useQuery({
    queryKey: ["is-admin", userId],
    queryFn: async () => {
      if (!userId) return false;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      return !!data?.some((row) => row.role === "admin" || row.role === "super_admin");
    },
    enabled: !!userId,
    staleTime: 60000,
  });
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const userId = user?.id;
  const { data: isAdmin, isLoading } = useIsAdmin(userId);

  if (loading || isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-600 gap-2">
        <Loader className="animate-spin" />
        Loading admin portal...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center">
        <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
        <p className="text-gray-500 text-center">
          Only administrators can access the admin portal.<br />
          If you believe this is an error, please contact your team lead.
        </p>
      </div>
    );
  }

  const { data: adminStats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [usersRes, campaignsRes, tasksRes, transactionsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact" }),
        (supabase as any).from("campaigns").select("id, status", { count: "exact" }),
        supabase.from("tasks").select("id", { count: "exact" }),
        (supabase as any).from("transactions").select("amount")
      ]);

      return {
        totalUsers: usersRes.count || 0,
        totalCampaigns: campaignsRes.count || 0,
        activeCampaigns: campaignsRes.data?.filter(c => c.status === 'active').length || 0,
        totalTasks: tasksRes.count || 0,
        totalTransactions: transactionsRes.data?.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) || 0
      };
    },
    enabled: isAdmin,
  });

  // Main admin layout
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AdminSidebar />
      <main className="flex-1 p-6">
        {/* Here we'll place sub-pages like Users, Withdrawals, etc */}
        <Outlet />
        {/* Enhanced Admin Dashboard Home */}
        {location.pathname === "/admin" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Monitor platform performance and manage users
                </p>
              </div>
              <Badge variant="outline" className="px-3 py-1">
                Administrator
              </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold text-foreground">{adminStats?.totalUsers || 0}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                      <p className="text-2xl font-bold text-foreground">{adminStats?.activeCampaigns || 0}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                      <p className="text-2xl font-bold text-foreground">{adminStats?.totalTasks || 0}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-50">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold text-foreground">
                        ${adminStats?.totalTransactions?.toFixed(2) || 0}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-orange-50">
                      <DollarSign className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">New user registered</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Campaign approved</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Task completed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <Badge variant="default" className="bg-green-500">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Payment System</span>
                      <Badge variant="default" className="bg-green-500">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Services</span>
                      <Badge variant="default" className="bg-green-500">Online</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Pending Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Task Submissions</span>
                      <Badge variant="secondary">24</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Campaign Approvals</span>
                      <Badge variant="secondary">5</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Verifications</span>
                      <Badge variant="secondary">12</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <AdminHome />
          </div>
        )}
      </main>
    </div>
  );
}

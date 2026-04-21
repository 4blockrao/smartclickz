
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Key,
  ArrowLeft,
  Settings,
  Smartphone,
  Eye,
  Download,
  Trash2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function DashboardAccountSettings() {
  const { user, logout, userProfile } = useAuth();
  const navigate = useNavigate();

  // User profile query
  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleLogout = async () => {
    await logout();
    navigate("/auth", { replace: true });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 py-6">
          <Card className="max-w-lg mx-auto text-center p-8">
            <Settings className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">Please log in to access account settings.</p>
            <Button onClick={() => navigate("/auth")} className="w-full">
              Login / Register
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        {/* Header Section */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/dashboard')}
            className="md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Settings className="w-8 h-8 text-primary" />
              Account Settings
            </h1>
            <p className="text-muted-foreground">Manage your account preferences and security</p>
          </div>
        </div>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email Address</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                {user.email_confirmed_at ? "Verified" : "Unverified"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Account Status</p>
                  <p className="text-sm text-muted-foreground">Active member since {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            {profile && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Display Name</p>
                    <p className="text-sm text-muted-foreground">{profile.display_name || 'Not set'}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/profile/edit')}>
                  Edit Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/dashboard/security')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Security Center
              <span className="ml-auto text-sm text-muted-foreground">Manage login history, sessions & MFA</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/dashboard/settings/password')}
            >
              <Key className="w-4 h-4 mr-2" />
              Change Password
              <span className="ml-auto text-sm text-muted-foreground">Update your password</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/dashboard/settings/mfa')}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Two-Factor Authentication
              <span className="ml-auto text-sm text-muted-foreground">Enable MFA for extra security</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/dashboard/settings/privacy')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Privacy Settings
              <span className="ml-auto text-sm text-muted-foreground">Control data visibility</span>
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/dashboard/settings/notifications')}
            >
              <Bell className="w-4 h-4 mr-2" />
              Manage Notifications
              <span className="ml-auto text-sm text-muted-foreground">Email, SMS & push notifications</span>
            </Button>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              Data & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/dashboard/settings/export')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Your Data
              <span className="ml-auto text-sm text-muted-foreground">Download your account data</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start text-orange-600 hover:text-orange-700"
              onClick={() => navigate('/dashboard/settings/deactivate')}
            >
              <User className="w-4 h-4 mr-2" />
              Deactivate Account
              <span className="ml-auto text-sm text-muted-foreground">Temporarily disable your account</span>
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 mb-3">
                <strong>Warning:</strong> These actions are permanent and cannot be undone.
              </p>
              <div className="space-y-2">
                <Button 
                  variant="outline"
                  className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => navigate('/dashboard/settings/delete-account')}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account Permanently
                  <span className="ml-auto text-sm text-muted-foreground">This cannot be undone</span>
                </Button>
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="w-full"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Back to Dashboard */}
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")}
            className="min-w-[200px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

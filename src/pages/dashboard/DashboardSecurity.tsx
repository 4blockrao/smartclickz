
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSecurity } from "@/hooks/useSecurity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Monitor, 
  Clock,
  MapPin,
  Smartphone,
  ArrowLeft,
  RefreshCw
} from "lucide-react";

export default function DashboardSecurity() {
  const { user } = useAuth();
  const { 
    loginHistory, 
    activeSessions, 
    securityEvents, 
    loading, 
    loadSecurityData, 
    revokeSession,
    getSecuritySummary 
  } = useSecurity();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 py-6">
          <Card className="max-w-lg mx-auto text-center p-8">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">Please log in to access security settings.</p>
            <Button onClick={() => navigate("/auth")} className="w-full">
              Login / Register
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const summary = getSecuritySummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
        {/* Header Section */}
        <div className="flex items-center justify-between">
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
                <Shield className="w-8 h-8 text-primary" />
                Security Center
              </h1>
              <p className="text-muted-foreground">Monitor your account security and activity</p>
            </div>
          </div>
          
          <Button onClick={loadSecurityData} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Security Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Sessions</p>
                  <p className="text-2xl font-bold">{summary.totalActiveSessions}</p>
                </div>
                <Monitor className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Recent Logins (24h)</p>
                  <p className="text-2xl font-bold">{summary.recentLogins}</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Failed Attempts</p>
                  <p className="text-2xl font-bold">{summary.failedAttempts}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Security Alerts</p>
                  <p className="text-2xl font-bold">{summary.unacknowledgedAlerts}</p>
                </div>
                <Shield className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Security Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/dashboard/settings/password')}
              >
                <Shield className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/dashboard/settings/mfa')}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Two-Factor Auth
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={loadSecurityData}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Login History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Login Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loginHistory.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No login activity found</p>
            ) : (
              <div className="space-y-3">
                {loginHistory.slice(0, 10).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{item.text}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={item.event_type === 'login' ? 'default' : 'destructive'}>
                      {item.event_type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeSessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Session management will be available soon
              </p>
            ) : (
              <div className="space-y-3">
                {activeSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Monitor className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Unknown Device</p>
                        <p className="text-sm text-muted-foreground">
                          Last active: {new Date(session.last_activity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => revokeSession(session.id)}
                    >
                      Revoke
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {securityEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No security events found</p>
            ) : (
              <div className="space-y-3">
                {securityEvents.slice(0, 10).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{event.text}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {event.event_type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
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

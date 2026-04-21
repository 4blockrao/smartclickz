
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, UserX, ShieldAlert } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface MobileAuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  permissions?: string[];
}

export default function MobileAuthGuard({ 
  children, 
  requireAuth = true,
  redirectTo = "/auth",
  permissions = []
}: MobileAuthGuardProps) {
  const { user, session, loading, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasPermission, setHasPermission] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Check for authentication requirements
      if (requireAuth && (!user || !session)) {
        // Save current route for redirect after auth
        navigate(redirectTo, { 
          replace: true, 
          state: { from: location.pathname } 
        });
        
        toast({
          title: "Authentication Required",
          description: "Please sign in to access this area",
          variant: "default",
        });
      }
      
      // Check permissions if needed (when we have permission system in place)
      if (requireAuth && user && permissions.length > 0 && userProfile) {
        // This is where we would check user permissions
        // For now, we'll assume they have permission
        setHasPermission(true);
      }
      
      setInitialCheckDone(true);
    }
  }, [user, session, loading, requireAuth, navigate, location.pathname, permissions, userProfile, redirectTo]);

  // Show loading state
  if (loading || !initialCheckDone) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <Card className="w-full p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <Sparkles className="text-primary-foreground w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Verifying Access</h3>
                <p className="text-sm text-muted-foreground">Setting up your experience</p>
              </div>
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Handle authentication requirement
  if (requireAuth && (!user || !session)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <Card className="w-full p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <UserX className="text-primary-foreground w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Authentication Required</h3>
                <p className="text-sm text-muted-foreground">Please sign in to continue</p>
              </div>
              <Button 
                onClick={() => navigate(redirectTo, { state: { from: location.pathname } })} 
                className="w-full"
              >
                Sign In
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Handle permission check
  if (requireAuth && !hasPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <Card className="w-full p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <ShieldAlert className="text-primary-foreground w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Access Denied</h3>
                <p className="text-sm text-muted-foreground">
                  You don't have permission to access this area
                </p>
              </div>
              <Button 
                onClick={() => navigate("/")} 
                variant="outline" 
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

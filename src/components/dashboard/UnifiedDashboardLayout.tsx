
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import RefinedDashboardSidebar from "./RefinedDashboardSidebar";
import RefinedDashboardHeader from "./RefinedDashboardHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileLayout from "../mobile/MobileLayout";

export default function UnifiedDashboardLayout() {
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (!loading && (!user || !session)) {
      navigate("/auth", { 
        replace: true, 
        state: { from: location.pathname } 
      });
    }
  }, [user, session, loading, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 px-4">
        <div className="text-center space-y-6 w-full max-w-sm">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
              Loading Dashboard
            </h3>
            <p className="text-slate-600">Setting up your workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !session) {
    return null;
  }

  // Use the MobileLayout component for mobile devices
  if (isMobile) {
    return (
      <MobileLayout isDashboard={true} requireAuth={true}>
        <Outlet />
      </MobileLayout>
    );
  }

  // Desktop layout - elegant and modern
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <RefinedDashboardSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 w-full">
          <RefinedDashboardHeader />
          
          <main className="flex-1 overflow-auto w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

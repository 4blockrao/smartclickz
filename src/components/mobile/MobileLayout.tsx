
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MobileHeader from "./MobileHeader";
import MobileTabBar from "../MobileTabBar";
import { useAuth } from "@/hooks/useAuth";
import MobileAuthGuard from "./MobileAuthGuard";
import { Toaster } from "../ui/toaster";
import { motion, AnimatePresence } from "framer-motion";


interface MobileLayoutProps {
  children?: React.ReactNode;
  requireAuth?: boolean;
  showHeader?: boolean;
  showTabBar?: boolean;
  isDashboard?: boolean;
}

export default function MobileLayout({
  children,
  requireAuth = false,
  showHeader = true,
  showTabBar = true,
  isDashboard = false,
}: MobileLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  // Don't show tab bar on auth pages
  const hideTabBarOnRoutes = ["/auth", "/login", "/signup", "/reset-password"];
  const shouldHideTabBar = hideTabBarOnRoutes.some(route => location.pathname.startsWith(route));

  // Determine if we're in the dashboard
  const isDashboardPage = isDashboard || location.pathname.startsWith("/dashboard");
  
  // Determine if we should show the tab bar
  const displayTabBar = showTabBar && !shouldHideTabBar && !isDashboardPage;

  // Wrap content in auth guard if required
  const content = (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen flex flex-col bg-background"
      >
        {showHeader && <MobileHeader />}
        <main className={`flex-1 overflow-auto ${displayTabBar || isDashboardPage ? 'pb-20' : ''}`}>
          {children || <Outlet />}
        </main>
        {displayTabBar && <MobileTabBar />}
        
        <Toaster />
      </motion.div>
    </AnimatePresence>
  );

  if (requireAuth) {
    return <MobileAuthGuard>{content}</MobileAuthGuard>;
  }

  return content;
}

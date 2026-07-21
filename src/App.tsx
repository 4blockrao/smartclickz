import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from 'next-themes';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from '@/components/ui/error-boundary';
import Layout from '@/components/Layout';
import InstallPrompt from '@/components/pwa/InstallPrompt';

// Structural components kept eager (needed on every route)
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import RequireAdmin from '@/components/auth/RequireAdmin';

// Pages — lazy-loaded so each route is its own chunk (smaller initial bundle)
const Index = lazy(() => import('@/pages/Index'));
const Auth = lazy(() => import('@/pages/Auth'));
const ModernDashboard = lazy(() => import('@/pages/ModernDashboard'));
const DashboardProfile = lazy(() => import('@/pages/DashboardProfile'));
const DashboardSettings = lazy(() => import('@/pages/DashboardSettings'));
const DashboardSecurity = lazy(() => import('@/pages/DashboardSecurity'));
const DashboardAccountSettings = lazy(() => import('@/pages/DashboardAccountSettings'));
const DashboardPasswordChange = lazy(() => import('@/pages/DashboardPasswordChange'));
const DashboardTaskHistory = lazy(() => import('@/pages/DashboardTaskHistory'));
const ReferralDashboard = lazy(() => import('@/pages/ReferralDashboard'));
const Task2Earn = lazy(() => import('@/pages/Task2Earn'));
const Packages = lazy(() => import('@/pages/Packages'));
const Wallet = lazy(() => import('@/pages/Wallet'));
const SocialConnect = lazy(() => import('@/pages/SocialConnect'));
const Leaderboard = lazy(() => import('@/pages/Leaderboard'));
const AdminPanel = lazy(() => import('@/pages/AdminPanel'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const AdminHome = lazy(() => import('@/pages/AdminHome'));
const AdminUsers = lazy(() => import('@/pages/AdminUsers'));
const AdminActivityLog = lazy(() => import('@/pages/AdminActivityLog'));
const AdminEarnings = lazy(() => import('@/pages/AdminEarnings'));
const AdminReports = lazy(() => import('@/pages/AdminReports'));
const AdminReferrals = lazy(() => import('@/pages/AdminReferrals'));
const AdminTasks = lazy(() => import('@/pages/AdminTasks'));
const AdminTeams = lazy(() => import('@/pages/AdminTeams'));
const AdminWithdrawals = lazy(() => import('@/pages/AdminWithdrawals'));
const AdminCampaigns = lazy(() => import('@/pages/AdminCampaigns'));
const AdminProUpgrades = lazy(() => import('@/pages/AdminProUpgrades'));
const AdminSubscriptions = lazy(() => import('@/pages/AdminSubscriptions'));
const AdminClients = lazy(() => import('@/pages/AdminClients'));
const ManageRoles = lazy(() => import('@/pages/ManageRoles'));
const DashboardWithdrawal = lazy(() => import('@/pages/DashboardWithdrawal'));
const ClientDashboard = lazy(() => import('@/pages/ClientDashboard'));
const CreateCampaign = lazy(() => import('@/pages/CreateCampaign'));
const CampaignBoard = lazy(() => import('@/pages/CampaignBoard'));
const CampaignDetailNew = lazy(() => import('@/pages/CampaignDetailNew'));
const CompensationPlan = lazy(() => import('@/pages/CompensationPlan'));
const About = lazy(() => import('@/pages/About'));
const Help = lazy(() => import('@/pages/Help'));
const Contact = lazy(() => import('@/pages/Contact'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Dashboard section views (also lazy)
const DashboardRankProgress = lazy(() => import('@/components/dashboard/DashboardRankProgress'));
const DashboardRoyalty = lazy(() => import('@/components/dashboard/DashboardRoyalty'));
const DashboardBalancedVolume = lazy(() => import('@/components/dashboard/DashboardBalancedVolume'));
const DashboardCampaignAnalytics = lazy(() => import('@/components/dashboard/DashboardCampaignAnalytics'));
const DashboardLeadership = lazy(() => import('@/components/dashboard/DashboardLeadership'));

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 2;
      },
    },
  },
});

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-muted border-t-primary" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          {/* App is designed dark-only (index.css :root holds the dark palette;
              pages hardcode dark surfaces). Lock to dark for consistency. */}
          <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
            <AuthProvider>
              <Router>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public auth route */}
                    <Route path="/auth" element={<Auth />} />

                    {/* ===== Authenticated app shell: ONE sidebar + header for every logged-in page ===== */}
                    <Route element={<UnifiedDashboardLayout />}>
                      {/* Dashboard */}
                      <Route path="dashboard" element={<ModernDashboard />} />
                      <Route path="dashboard/profile" element={<DashboardProfile />} />
                      <Route path="dashboard/settings" element={<DashboardSettings />} />
                      <Route path="dashboard/security" element={<DashboardSecurity />} />
                      <Route path="dashboard/account" element={<DashboardAccountSettings />} />
                      <Route path="dashboard/password" element={<DashboardPasswordChange />} />
                      <Route path="dashboard/task-history" element={<DashboardTaskHistory />} />
                      <Route path="referrals" element={<ReferralDashboard />} />
                      <Route path="dashboard/rank-progress" element={<DashboardRankProgress />} />
                      <Route path="dashboard/royalty" element={<DashboardRoyalty />} />
                      <Route path="dashboard/balanced-volume" element={<DashboardBalancedVolume />} />
                      <Route path="dashboard/campaign-analytics" element={<DashboardCampaignAnalytics />} />
                      <Route path="dashboard/leadership" element={<DashboardLeadership />} />
                      <Route path="dashboard/withdrawal" element={<DashboardWithdrawal />} />

                      {/* Earn / portal */}
                      <Route path="tasks" element={<Task2Earn />} />
                      <Route path="packages" element={<Packages />} />
                      <Route path="wallet" element={<Wallet />} />
                      <Route path="social-connect" element={<SocialConnect />} />
                      <Route path="leaderboard" element={<Leaderboard />} />
                      <Route path="plan" element={<CompensationPlan />} />

                      {/* Advertiser */}
                      <Route path="client" element={<ClientDashboard />} />
                      <Route path="create-campaign" element={<CreateCampaign />} />
                      <Route path="campaigns" element={<CampaignBoard />} />
                      <Route path="campaigns/:id" element={<CampaignDetailNew />} />

                      {/* Admin (role-gated) */}
                      <Route element={<RequireAdmin />}>
                        <Route path="admin" element={<AdminDashboard />} />
                        <Route path="admin/panel" element={<AdminPanel />} />
                        <Route path="admin/dashboard" element={<AdminDashboard />} />
                        <Route path="admin/home" element={<AdminHome />} />
                        <Route path="admin/users" element={<AdminUsers />} />
                        <Route path="admin/activity" element={<AdminActivityLog />} />
                        <Route path="admin/earnings" element={<AdminEarnings />} />
                        <Route path="admin/reports" element={<AdminReports />} />
                        <Route path="admin/referrals" element={<AdminReferrals />} />
                        <Route path="admin/tasks" element={<AdminTasks />} />
                        <Route path="admin/teams" element={<AdminTeams />} />
                        <Route path="admin/withdrawals" element={<AdminWithdrawals />} />
                        <Route path="admin/campaigns" element={<AdminCampaigns />} />
                        <Route path="admin/pro-upgrades" element={<AdminProUpgrades />} />
                        <Route path="admin/subscriptions" element={<AdminSubscriptions />} />
                        <Route path="admin/clients" element={<AdminClients />} />
                        <Route path="admin/roles" element={<ManageRoles />} />
                      </Route>
                    </Route>

                    {/* ===== Public (marketing shell) ===== */}
                    <Route path="/" element={<Layout><Index /></Layout>} />
                    <Route path="compensation" element={<Layout><CompensationPlan /></Layout>} />
                    <Route path="about" element={<Layout><About /></Layout>} />
                    <Route path="help" element={<Layout><Help /></Layout>} />
                    <Route path="contact" element={<Layout><Contact /></Layout>} />
                    <Route path="privacy" element={<Layout><Privacy /></Layout>} />
                    <Route path="terms" element={<Layout><Terms /></Layout>} />

                    {/* 404 */}
                    <Route path="*" element={<Layout><NotFound /></Layout>} />
                  </Routes>
                </Suspense>

                {/* PWA Install Prompt */}
                <InstallPrompt />
              </Router>
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;

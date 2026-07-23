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
const DashboardSecurity = lazy(() => import('@/pages/DashboardSecurity'));
const DashboardAccountSettings = lazy(() => import('@/pages/DashboardAccountSettings'));
const DashboardPasswordChange = lazy(() => import('@/pages/DashboardPasswordChange'));
const ReferralDashboard = lazy(() => import('@/pages/ReferralDashboard'));
const Task2Earn = lazy(() => import('@/pages/Task2Earn'));
const Packages = lazy(() => import('@/pages/Packages'));
const Wallet = lazy(() => import('@/pages/Wallet'));
const SocialConnect = lazy(() => import('@/pages/SocialConnect'));
const Leaderboard = lazy(() => import('@/pages/Leaderboard'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const AdminHome = lazy(() => import('@/pages/admin/AdminHome'));
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
const AdminLedger = lazy(() => import('@/pages/AdminLedger'));
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
                      <Route path="dashboard/security" element={<DashboardSecurity />} />
                      <Route path="dashboard/account" element={<DashboardAccountSettings />} />
                      <Route path="dashboard/password" element={<DashboardPasswordChange />} />
                      <Route path="referrals" element={<ReferralDashboard />} />
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

                    </Route>

                    {/* ===== Admin portal: its own shell (AdminSidebar), role-gated ===== */}
                    <Route element={<RequireAdmin />}>
                      <Route path="admin" element={<AdminDashboard />}>
                        <Route index element={<AdminHome />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="activity" element={<AdminActivityLog />} />
                        <Route path="earnings" element={<AdminEarnings />} />
                        <Route path="reports" element={<AdminReports />} />
                        <Route path="referrals" element={<AdminReferrals />} />
                        <Route path="tasks" element={<AdminTasks />} />
                        <Route path="teams" element={<AdminTeams />} />
                        <Route path="withdrawals" element={<AdminWithdrawals />} />
                        <Route path="campaigns" element={<AdminCampaigns />} />
                        <Route path="pro-upgrades" element={<AdminProUpgrades />} />
                        <Route path="subscriptions" element={<AdminSubscriptions />} />
                        <Route path="ledger" element={<AdminLedger />} />
                        <Route path="clients" element={<AdminClients />} />
                        <Route path="roles" element={<ManageRoles />} />
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

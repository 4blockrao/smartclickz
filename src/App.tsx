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
const DashboardTasks = lazy(() => import('@/pages/DashboardTasks'));
const DashboardTaskHistory = lazy(() => import('@/pages/DashboardTaskHistory'));
const DashboardTeam = lazy(() => import('@/pages/DashboardTeam'));
const DashboardPoints = lazy(() => import('@/pages/DashboardPoints'));
const Tasks = lazy(() => import('@/pages/Tasks'));
const TaskDetail = lazy(() => import('@/pages/TaskDetail'));
const Task2Earn = lazy(() => import('@/pages/Task2Earn'));
const Packages = lazy(() => import('@/pages/Packages'));
const ReferralDashboard = lazy(() => import('@/pages/ReferralDashboard'));
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
const AdminClients = lazy(() => import('@/pages/AdminClients'));
const ManageRoles = lazy(() => import('@/pages/ManageRoles'));
const DashboardWithdrawal = lazy(() => import('@/pages/DashboardWithdrawal'));
const ClientDashboard = lazy(() => import('@/pages/ClientDashboard'));
const CreateCampaign = lazy(() => import('@/pages/CreateCampaign'));
const CampaignBoard = lazy(() => import('@/pages/CampaignBoard'));
const CampaignDetailNew = lazy(() => import('@/pages/CampaignDetailNew'));
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
const DashboardPayouts = lazy(() => import('@/components/dashboard/DashboardPayouts'));

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

                    {/* Dashboard routes with auth protection */}
                    <Route path="/dashboard" element={<UnifiedDashboardLayout />}>
                      <Route index element={<ModernDashboard />} />
                      <Route path="profile" element={<DashboardProfile />} />
                      <Route path="settings" element={<DashboardSettings />} />
                      <Route path="security" element={<DashboardSecurity />} />
                      <Route path="account" element={<DashboardAccountSettings />} />
                      <Route path="password" element={<DashboardPasswordChange />} />
                      <Route path="tasks" element={<DashboardTasks />} />
                      <Route path="task-history" element={<DashboardTaskHistory />} />
                      <Route path="team" element={<DashboardTeam />} />
                      <Route path="points" element={<DashboardPoints />} />
                      <Route path="rank-progress" element={<DashboardRankProgress />} />
                      <Route path="royalty" element={<DashboardRoyalty />} />
                      <Route path="balanced-volume" element={<DashboardBalancedVolume />} />
                      <Route path="campaign-analytics" element={<DashboardCampaignAnalytics />} />
                      <Route path="leadership" element={<DashboardLeadership />} />
                      <Route path="payouts" element={<DashboardPayouts />} />
                    </Route>

                    {/* Public routes with layout */}
                    <Route path="/" element={<Layout><Index /></Layout>} />

                    {/* Tasks Routes */}
                    <Route path="tasks" element={<Layout><Tasks /></Layout>} />
                    <Route path="tasks/:id" element={<Layout><TaskDetail /></Layout>} />
                    <Route path="task2earn" element={<Layout><Task2Earn /></Layout>} />

                    {/* Other Routes */}
                    <Route path="packages" element={<Layout><Packages /></Layout>} />
                    <Route path="referrals" element={<Layout><ReferralDashboard /></Layout>} />
                    <Route path="wallet" element={<Layout><Wallet /></Layout>} />
                    <Route path="social-connect" element={<Layout><SocialConnect /></Layout>} />
                    <Route path="leaderboard" element={<Layout><Leaderboard /></Layout>} />

                    {/* Admin Routes (role-gated via RequireAdmin) */}
                    <Route element={<RequireAdmin />}>
                      <Route path="admin" element={<Layout><AdminDashboard /></Layout>} />
                      <Route path="admin/panel" element={<Layout><AdminPanel /></Layout>} />
                      <Route path="admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />
                      <Route path="admin/home" element={<Layout><AdminHome /></Layout>} />
                      <Route path="admin/users" element={<Layout><AdminUsers /></Layout>} />
                      <Route path="admin/activity" element={<Layout><AdminActivityLog /></Layout>} />
                      <Route path="admin/earnings" element={<Layout><AdminEarnings /></Layout>} />
                      <Route path="admin/reports" element={<Layout><AdminReports /></Layout>} />
                      <Route path="admin/referrals" element={<Layout><AdminReferrals /></Layout>} />
                      <Route path="admin/tasks" element={<Layout><AdminTasks /></Layout>} />
                      <Route path="admin/teams" element={<Layout><AdminTeams /></Layout>} />
                      <Route path="admin/withdrawals" element={<Layout><AdminWithdrawals /></Layout>} />
                      <Route path="admin/campaigns" element={<Layout><AdminCampaigns /></Layout>} />
                      <Route path="admin/pro-upgrades" element={<Layout><AdminProUpgrades /></Layout>} />
                      <Route path="admin/clients" element={<Layout><AdminClients /></Layout>} />
                      <Route path="admin/roles" element={<Layout><ManageRoles /></Layout>} />
                    </Route>
                    <Route path="dashboard/withdrawal" element={<Layout><DashboardWithdrawal /></Layout>} />

                    {/* Client/Campaign Routes */}
                    <Route path="client" element={<Layout><ClientDashboard /></Layout>} />
                    <Route path="create-campaign" element={<Layout><CreateCampaign /></Layout>} />
                    <Route path="campaigns" element={<Layout><CampaignBoard /></Layout>} />
                    <Route path="campaigns/:id" element={<Layout><CampaignDetailNew /></Layout>} />

                    {/* Static Pages */}
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

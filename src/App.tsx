import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from 'next-themes';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from '@/components/ui/error-boundary';
import Layout from '@/components/Layout';
import InstallPrompt from '@/components/pwa/InstallPrompt';

// Pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import ModernDashboard from '@/pages/ModernDashboard';
import DashboardProfile from '@/pages/DashboardProfile';
import DashboardSettings from '@/pages/DashboardSettings';
import DashboardSecurity from '@/pages/DashboardSecurity';
import DashboardAccountSettings from '@/pages/DashboardAccountSettings';
import DashboardPasswordChange from '@/pages/DashboardPasswordChange';
import DashboardTasks from '@/pages/DashboardTasks';
import DashboardTaskHistory from '@/pages/DashboardTaskHistory';
import DashboardTeam from '@/pages/DashboardTeam';
import DashboardPoints from '@/pages/DashboardPoints';
import Tasks from '@/pages/Tasks';
import TaskDetail from '@/pages/TaskDetail';
import Task2Earn from '@/pages/Task2Earn';
import Profiles from '@/pages/Profiles';
import ProfileDetail from '@/pages/ProfileDetail';
import ProfileEditPage from '@/pages/ProfileEditPage';
import Packages from '@/pages/Packages';
import ReferralDashboard from '@/pages/ReferralDashboard';
import Wallet from '@/pages/Wallet';
import SocialConnect from '@/pages/SocialConnect';
import Leaderboard from '@/pages/Leaderboard';
import AdminIndex from '@/pages/AdminIndex';
import AdminPanel from '@/pages/AdminPanel';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminHome from '@/pages/AdminHome';
import AdminUsers from '@/pages/AdminUsers';
import AdminPosts from '@/pages/AdminPosts';
import AdminComments from '@/pages/AdminComments';
import AdminActivityLog from '@/pages/AdminActivityLog';
import AdminEarnings from '@/pages/AdminEarnings';
import AdminReports from '@/pages/AdminReports';
import AdminReferrals from '@/pages/AdminReferrals';
import AdminTasks from '@/pages/AdminTasks';
import AdminTeams from '@/pages/AdminTeams';
import AdminWithdrawals from '@/pages/AdminWithdrawals';
import AdminCampaigns from '@/pages/AdminCampaigns';
import ManageRoles from '@/pages/ManageRoles';
import DashboardWithdrawal from '@/pages/DashboardWithdrawal';
import ClientDashboard from '@/pages/ClientDashboard';
import CreateCampaign from '@/pages/CreateCampaign';
import CampaignBoard from '@/pages/CampaignBoard';
import CampaignDetail from '@/pages/CampaignDetail';
import CampaignDetailNew from '@/pages/CampaignDetailNew';
import About from '@/pages/About';
import Help from '@/pages/Help';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import NotFound from '@/pages/NotFound';

// Dashboard routes for new sections
import DashboardRankProgress from '@/components/dashboard/DashboardRankProgress';
import DashboardRoyalty from '@/components/dashboard/DashboardRoyalty';
import DashboardBalancedVolume from '@/components/dashboard/DashboardBalancedVolume';
import DashboardCampaignAnalytics from '@/components/dashboard/DashboardCampaignAnalytics';
import DashboardLeadership from '@/components/dashboard/DashboardLeadership';
import DashboardPayouts from '@/components/dashboard/DashboardPayouts';

// Layout components
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';

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

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <AuthProvider>
              <Router>
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
                  
                  {/* Profiles Routes */}
                  <Route path="profiles" element={<Layout><Profiles /></Layout>} />
                  <Route path="profiles/:id" element={<Layout><ProfileDetail /></Layout>} />
                  <Route path="profile/edit" element={<Layout><ProfileEditPage /></Layout>} />
                  
                  {/* Other Routes */}
                  <Route path="packages" element={<Layout><Packages /></Layout>} />
                  <Route path="referrals" element={<Layout><ReferralDashboard /></Layout>} />
                  <Route path="wallet" element={<Layout><Wallet /></Layout>} />
                  <Route path="social-connect" element={<Layout><SocialConnect /></Layout>} />
                  <Route path="leaderboard" element={<Layout><Leaderboard /></Layout>} />
                  
                  {/* Admin Routes */}
                  <Route path="admin" element={<Layout><AdminIndex /></Layout>} />
                  <Route path="admin/panel" element={<Layout><AdminPanel /></Layout>} />
                  <Route path="admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />
                  <Route path="admin/home" element={<Layout><AdminHome /></Layout>} />
                  <Route path="admin/users" element={<Layout><AdminUsers /></Layout>} />
                  <Route path="admin/posts" element={<Layout><AdminPosts /></Layout>} />
                  <Route path="admin/comments" element={<Layout><AdminComments /></Layout>} />
                  <Route path="admin/activity" element={<Layout><AdminActivityLog /></Layout>} />
                  <Route path="admin/earnings" element={<Layout><AdminEarnings /></Layout>} />
                  <Route path="admin/reports" element={<Layout><AdminReports /></Layout>} />
                  <Route path="admin/referrals" element={<Layout><AdminReferrals /></Layout>} />
                  <Route path="admin/tasks" element={<Layout><AdminTasks /></Layout>} />
                  <Route path="admin/teams" element={<Layout><AdminTeams /></Layout>} />
                  <Route path="admin/withdrawals" element={<Layout><AdminWithdrawals /></Layout>} />
                  <Route path="admin/campaigns" element={<Layout><AdminCampaigns /></Layout>} />
                  <Route path="dashboard/withdrawal" element={<Layout><DashboardWithdrawal /></Layout>} />
                  <Route path="admin/roles" element={<Layout><ManageRoles /></Layout>} />
                  
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


import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard, 
  Target, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Calendar,
  CheckSquare,
  Trophy,
  Home,
  Wallet,
  BarChart3,
  Package,
  TrendingUp,
  Award,
  FileText,
  Settings,
  Eye,
  Search,
  Building,
  Megaphone,
  UserPlus,
  Crown,
  Zap,
  Calculator,
  Star,
  DollarSign,
  Sparkles,
  Diamond,
  Shield,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navigationGroups = [
  {
    label: "Command Center",
    items: [
      { label: "Overview", to: "/dashboard", icon: LayoutDashboard, end: true },
    ]
  },
  {
    label: "Portfolio & Earnings",
    items: [
      { label: "Digital Wallet", to: "/wallet", icon: Wallet, badge: "Premium" },
      { label: "Rewards Hub", to: "/dashboard/points", icon: Trophy },
      { label: "Analytics Dashboard", to: "/dashboard/earnings", icon: TrendingUp },
      { label: "Performance Metrics", to: "/dashboard/packages", icon: Package },
      { label: "Transaction Log", to: "/dashboard/transactions", icon: FileText },
      { label: "Auto Payouts", to: "/dashboard/payouts", icon: DollarSign, badge: "Pro" },
    ]
  },
  {
    label: "Activities & Opportunities",
    items: [
      { label: "Task Portfolio", to: "/dashboard/tasks", icon: Target },
      { label: "Activity History", to: "/dashboard/task-history", icon: BarChart3 },
      { label: "Opportunity Board", to: "/dashboard/classifieds", icon: Briefcase },
      { label: "Content Viewing", to: "/dashboard/ad-viewing", icon: Eye },
      { label: "Onboarding Path", to: "/dashboard/onboarding", icon: CheckSquare },
    ]
  },
  {
    label: "Campaign Management",
    items: [
      { label: "Campaign Studio", to: "/dashboard/campaigns", icon: Megaphone, badge: "Elite" },
      { label: "Campaign Hub", to: "/campaigns", icon: Target },
      { label: "Performance Analytics", to: "/dashboard/campaign-analytics", icon: BarChart3, badge: "New" },
    ]
  },
  {
    label: "Network & Community",
    items: [
      { label: "Team Management", to: "/dashboard/team", icon: Users },
      { label: "Team Analytics", to: "/dashboard/team-performance", icon: Award },
      { label: "Referral System", to: "/referral-dashboard", icon: UserPlus },
      { label: "Volume Tracker", to: "/dashboard/balanced-volume", icon: Calculator, badge: "Commission" },
      // Removed: Communications, Discover Professionals, Explore Companies
    ]
  },
  {
    label: "Rankings & Recognition",
    items: [
      { label: "Global Leaderboard", to: "/leaderboard", icon: Trophy },
      { label: "Rank Progression", to: "/dashboard/rank-progress", icon: Crown, badge: "Elite" },
      { label: "Royalty Center", to: "/dashboard/royalty", icon: Zap, badge: "Exclusive" },
      { label: "Leadership Portal", to: "/dashboard/leadership", icon: Star, badge: "VIP" },
      { label: "Events Calendar", to: "/dashboard/events", icon: Calendar },
    ]
  },
  {
    label: "Settings & Security",
    items: [
      { label: "Profile Management", to: "/dashboard/profile", icon: Settings },
      { label: "Account Security", to: "/dashboard/account-settings", icon: Shield },
    ]
  }
];

export default function RefinedDashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const isActiveRoute = (path: string, end?: boolean) => {
    if (end) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className={`${collapsed ? "w-20" : "w-80"} bg-slate-900/95 backdrop-blur-2xl border-r border-white/10 shadow-2xl`} collapsible="icon">
      <div className="flex items-center justify-center p-6 border-b border-white/10">
        {!collapsed ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-white">SmartClicks</h2>
              <p className="text-xs text-slate-400 font-medium">Professional Hub</p>
            </div>
          </div>
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      <SidebarContent className="px-4 py-6 bg-slate-900/60 backdrop-blur-lg overflow-y-auto">
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label} className="mb-8">
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-bold text-slate-500 px-4 py-3 uppercase tracking-wider mb-3">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {group.items.map(({ label, to, icon: Icon, end, badge }) => {
                  const isActive = isActiveRoute(to, end);
                  
                  return (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={to}
                          end={!!end}
                          className={() =>
                            cn(
                              "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative text-sm font-semibold",
                              "hover:bg-white/10 hover:shadow-lg",
                              isActive
                                ? "bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white font-bold shadow-lg shadow-purple-500/20 border border-purple-500/30 backdrop-blur-sm"
                                : "text-slate-400 hover:text-white"
                            )
                          }
                        >
                          <div className={cn(
                            "p-2 rounded-xl transition-all duration-300",
                            isActive 
                              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50" 
                              : "bg-white/10 text-slate-400 group-hover:bg-white/20 group-hover:text-white"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          {!collapsed && (
                            <>
                              <span className="flex-1 text-left truncate">{label}</span>
                              {badge && (
                                <Badge variant="secondary" className={cn(
                                  "text-xs font-bold px-3 py-1 border",
                                  isActive 
                                    ? "bg-purple-500/20 text-purple-300 border-purple-400/30" 
                                    : "bg-white/10 text-slate-400 border-white/20"
                                )}>
                                  {badge}
                                </Badge>
                              )}
                              {isActive && (
                                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full shadow-lg shadow-purple-400/50 animate-pulse" />
                              )}
                            </>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

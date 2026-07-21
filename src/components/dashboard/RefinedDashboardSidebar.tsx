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
  Trophy,
  Wallet,
  BarChart3,
  Package,
  Award,
  Settings,
  Megaphone,
  UserPlus,
  Crown,
  Zap,
  Calculator,
  Star,
  DollarSign,
  Sparkles,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Every `to` resolves to a real route in App.tsx.
const navigationGroups = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Earnings",
    items: [
      { label: "Wallet", to: "/wallet", icon: Wallet },
      { label: "Packages", to: "/packages", icon: Package },
      { label: "Auto Payouts", to: "/dashboard/payouts", icon: DollarSign },
    ],
  },
  {
    label: "Activities",
    items: [
      { label: "Tasks", to: "/tasks", icon: Target },
      { label: "Activity History", to: "/dashboard/task-history", icon: BarChart3 },
    ],
  },
  {
    label: "Campaigns",
    items: [
      { label: "Create Campaign", to: "/create-campaign", icon: Megaphone },
      { label: "Campaign Board", to: "/campaigns", icon: Target },
      { label: "Analytics", to: "/dashboard/campaign-analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Network",
    items: [
      { label: "Team & Referrals", to: "/dashboard/team", icon: Users },
      { label: "Volume", to: "/dashboard/balanced-volume", icon: Calculator },
    ],
  },
  {
    label: "Rankings",
    items: [
      { label: "Leaderboard", to: "/leaderboard", icon: Trophy },
      { label: "Rank Progress", to: "/dashboard/rank-progress", icon: Crown },
      { label: "Royalty", to: "/dashboard/royalty", icon: Zap },
      { label: "Leadership", to: "/dashboard/leadership", icon: Star },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", to: "/dashboard/profile", icon: Settings },
      { label: "Security", to: "/dashboard/account", icon: Shield },
    ],
  },
];

export default function RefinedDashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const isActive = (path: string, end?: boolean) =>
    end ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <Sidebar className={cn(collapsed ? "w-[76px]" : "w-72", "bg-slate-950 border-r border-white/10")} collapsible="icon">
      {/* Brand */}
      <div className="flex items-center gap-3 h-16 px-5 border-b border-white/10">
        <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/30">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        {!collapsed && <span className="text-lg font-bold tracking-tight text-white">SmartClicks</span>}
      </div>

      <SidebarContent className="px-3 py-4 overflow-y-auto">
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label} className="mb-4">
            {!collapsed && (
              <SidebarGroupLabel className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">
                {group.items.map(({ label, to, icon: Icon, end }) => {
                  const active = isActive(to, end);
                  return (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={to}
                          end={!!end}
                          title={label}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                            active ? "bg-violet-600/15 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <Icon className={cn("h-5 w-5 shrink-0", active && "text-violet-400")} />
                          {!collapsed && <span className="truncate">{label}</span>}
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

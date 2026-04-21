
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Users,
  Award,
  Wallet,
  TrendingUp,
  Calendar,
  Shield,
  FileText,
  UserPlus,
  PieChart,
  ChevronsRight,
} from "lucide-react";

const navItems = [
  {
    to: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    to: "/admin/referrals",
    label: "Referrals",
    icon: UserPlus,
  },
  {
    to: "/admin/earnings",
    label: "Points & Earnings",
    icon: Wallet,
  },
  {
    to: "/admin/withdrawals",
    label: "Withdrawals",
    icon: TrendingUp,
  },
  {
    to: "/admin/tasks",
    label: "Tasks",
    icon: FileText,
  },
  {
    to: "/admin/teams",
    label: "Teams/Downlines",
    icon: Shield,
  },
  {
    to: "/admin/reports",
    label: "Reports",
    icon: PieChart,
  },
];

export default function AdminSidebar() {
  return (
    <Sidebar className="w-64 min-h-screen border-r bg-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded transition hover:bg-violet-100 ${
                          isActive ? "bg-violet-200 font-bold text-violet-700" : ""
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}


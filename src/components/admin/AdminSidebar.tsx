
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
  LayoutDashboard,
  Megaphone,
  Building2,
  FileText,
  TrendingUp,
  CreditCard,
  BookOpen,
  Crown,
  Shield,
} from "lucide-react";

// Only functional admin pages are linked here.
const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  { to: "/admin/clients", label: "Advertisers", icon: Building2 },
  { to: "/admin/tasks", label: "Tasks", icon: FileText },
  { to: "/admin/withdrawals", label: "Withdrawals", icon: TrendingUp },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/admin/ledger", label: "Ledger", icon: BookOpen },
  { to: "/admin/pro-upgrades", label: "Pro Upgrades", icon: Crown },
  { to: "/admin/roles", label: "Roles", icon: Shield },
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
                      end={(item as any).end}
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


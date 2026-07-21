import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Target, Users, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Home", to: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Tasks", to: "/tasks", icon: Target },
  { label: "Team", to: "/referrals", icon: Users },
  { label: "Wallet", to: "/wallet", icon: Wallet },
];

export default function MobileDashboardNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 safe-area-pb">
      <div className="mx-auto grid max-w-md grid-cols-4 px-2 py-2">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              cn(
                "mx-1 flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-2xl transition-all active:scale-95",
                isActive
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                  : "text-slate-400 hover:text-slate-200"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

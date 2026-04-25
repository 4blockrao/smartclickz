
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MobileDashboardNavigation() {
  const location = useLocation();
  
  const navigationItems = [
    { label: "Home", to: "/dashboard", icon: LayoutDashboard, exact: true },
    { label: "Tasks", to: "/dashboard/tasks", icon: Target },
    { label: "Team", to: "/dashboard/team", icon: Users },
    { label: "Wallet", to: "/wallet", icon: Wallet },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border z-40 h-16 safe-area-pb">
      <div className="grid grid-cols-4 h-full">
        {navigationItems.map((item) => (
          <NavLink 
            key={item.label}
            to={item.to}
            end={item.exact}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center space-y-1 transition-colors",
              isActive 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

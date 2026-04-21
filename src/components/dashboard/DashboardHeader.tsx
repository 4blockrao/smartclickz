
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Settings, 
  Menu,
  Home,
  ArrowLeft,
  LogOut,
  User
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  userProfile: any;
  onMenuToggle?: () => void;
  showBackButton?: boolean;
}

export default function DashboardHeader({ userProfile, onMenuToggle, showBackButton }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const isHomePage = location.pathname === '/dashboard';
  
  const displayName = userProfile?.display_name || "Networker";
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/auth", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {showBackButton && !isHomePage ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
              className="md:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMenuToggle}
              className="md:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          
          <div className="hidden md:flex items-center gap-2">
            <Home className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold">
              {isHomePage ? "Dashboard" : "Network Hub"}
            </h1>
          </div>
          
          {!isHomePage && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="hidden md:flex"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          )}
        </div>

        {/* Center - Welcome message on mobile */}
        <div className="flex-1 text-center md:hidden">
          <h1 className="text-lg font-semibold">
            {isHomePage ? `Welcome, ${displayName.split(' ')[0]}` : "Network Hub"}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Points badge */}
          <Badge variant="secondary" className="hidden sm:flex bg-success-50 text-success-700 border-success-200">
            {userProfile?.points || 0} pts
          </Badge>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </Button>
          
          {/* User menu dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-10">
                <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                  <AvatarImage src={userProfile?.profile_image_url} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">Professional Networker</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/dashboard/account')}>
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

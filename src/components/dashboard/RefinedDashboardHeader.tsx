
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Settings, 
  LogOut,
  User,
  Home,
  Search,
  Sparkles,
  Crown,
  Diamond
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
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function RefinedDashboardHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isDashboardHome = location.pathname === '/dashboard';
  
  const handleLogout = async () => {
    await logout();
    navigate("/auth", { replace: true });
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Command Center';
    if (path.includes('/team')) return 'Team Management';
    if (path.includes('/tasks')) return 'Task Portfolio';
    if (path.includes('/points')) return 'Rewards Center';
    if (path.includes('/onboarding')) return 'Getting Started';
    return 'Dashboard';
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
      <div className="flex items-center justify-between h-20 px-8">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          {/* Sidebar Toggle - Desktop Only */}
          <SidebarTrigger className="h-12 w-12 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-colors" />
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-slate-400 hidden sm:block font-medium">
                Welcome back, {user?.email?.split('@')[0] || 'Professional'}
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Enhanced Search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-12">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Search tasks and campaigns..."
              className="pl-12 pr-4 h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/50 rounded-2xl text-base font-medium shadow-sm backdrop-blur-xl"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Enhanced Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-white/10 rounded-2xl h-12 w-12 text-slate-300 hover:text-white"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center shadow-lg shadow-red-500/50">
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </span>
          </Button>

          {/* Enhanced Points Badge */}
          <Badge className="hidden sm:flex bg-gradient-to-r from-emerald-600 to-green-600 text-white border-0 font-bold px-4 py-2 text-sm shadow-lg shadow-green-500/30 hover:shadow-xl transition-all hover:scale-105">
            <Diamond className="w-4 h-4 mr-2" />
            1,250 pts
          </Badge>

          {/* Back to Public Site */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
            className="hidden lg:flex border-white/20 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl px-4 py-2 h-10 font-medium backdrop-blur-xl"
          >
            <Home className="w-4 h-4 mr-2" />
            Public Site
          </Button>
          
          {/* Enhanced User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 h-12 hover:bg-white/10 rounded-2xl px-3">
                <Avatar className="h-10 w-10 ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/30">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold text-base">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-bold text-white">{user?.email?.split('@')[0] || 'User'}</p>
                  <div className="flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" />
                    <p className="text-xs text-slate-400 font-medium">Elite Member</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-slate-900/95 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-2xl p-2">
              <DropdownMenuItem onClick={() => navigate('/dashboard/profile')} className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl p-3 cursor-pointer">
                <User className="w-5 h-5 mr-3" />
                <span className="font-medium">Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings')} className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl p-3 cursor-pointer">
                <Settings className="w-5 h-5 mr-3" />
                <span className="font-medium">Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10 my-2" />
              <DropdownMenuItem onClick={() => navigate('/')} className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl p-3 cursor-pointer">
                <Home className="w-5 h-5 mr-3" />
                <span className="font-medium">Public Site</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10 my-2" />
              <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl p-3 cursor-pointer">
                <LogOut className="w-5 h-5 mr-3" />
                <span className="font-medium">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

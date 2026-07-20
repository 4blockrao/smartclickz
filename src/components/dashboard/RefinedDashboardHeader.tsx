import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Settings, Home, Diamond } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePointsWallet } from "@/hooks/usePointsWallet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";

/**
 * Minimal top bar for the app shell: sidebar toggle on the left, points + user
 * menu (with Logout) on the right. Deliberately lightweight — page titles and
 * greetings live in each page's own content, so this doesn't read as a second
 * header competing with the page.
 */
export default function RefinedDashboardHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { pointsBalance } = usePointsWallet(user?.id);

  const handleLogout = async () => {
    await logout();
    navigate("/auth", { replace: true });
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-2xl border-b border-white/10">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <SidebarTrigger className="h-10 w-10 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors" />

        <div className="flex items-center gap-3">
          <Badge className="hidden sm:flex bg-gradient-to-r from-emerald-600 to-green-600 text-white border-0 font-bold px-3 py-1.5 text-sm">
            <Diamond className="w-4 h-4 mr-1.5" />
            {pointsBalance.toLocaleString()} pts
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-10 hover:bg-white/10 rounded-xl px-2">
                <Avatar className="h-8 w-8 ring-2 ring-purple-500/50">
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold text-sm">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium text-white">
                  {user?.email?.split("@")[0] || "User"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-2">
              <DropdownMenuItem onClick={() => navigate("/dashboard/profile")} className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl p-2.5 cursor-pointer">
                <User className="w-4 h-4 mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl p-2.5 cursor-pointer">
                <Settings className="w-4 h-4 mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/")} className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl p-2.5 cursor-pointer">
                <Home className="w-4 h-4 mr-2" /> Public Site
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10 my-1" />
              <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl p-2.5 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

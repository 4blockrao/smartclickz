
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, Settings, LogOut, Target, TrendingUp, Wallet, Plus, ChevronDown, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  { name: "Campaigns", path: "/campaigns", icon: Target },
  { name: "Leaderboard", path: "/leaderboard", icon: TrendingUp },
  { name: "How it Works", path: "/about", icon: Target },
];

const Header: React.FC = () => {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-800/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Enhanced Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-white group-hover:text-purple-300 transition-colors">
              SmartClicks
            </span>
            <span className="text-xs text-slate-400 -mt-1">Earn • Connect • Grow</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="group flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-all duration-200 relative"
            >
              <item.icon className="h-4 w-4 group-hover:text-purple-400 transition-colors" />
              {item.name}
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
          ))}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Enhanced Wallet Balance */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/wallet")}
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/50 transition-all duration-200"
              >
                <Wallet className="h-4 w-4" />
                <span className="font-semibold">${userProfile?.wallet_balance?.toFixed(2) || "0.00"}</span>
              </Button>

              {/* Points Badge */}
              <Badge className="hidden sm:flex bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border-purple-500/30">
                <Sparkles className="w-3 h-3 mr-1" />
                {userProfile?.points || 0} pts
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 h-12 px-3 text-white hover:bg-slate-800/50 rounded-xl border border-transparent hover:border-slate-700/50 transition-all duration-200">
                    <div className="relative">
                      <Avatar className="h-9 w-9 border-2 border-purple-500/30">
                        <AvatarImage 
                          src={userProfile?.profile_image_url} 
                          alt={userProfile?.display_name || "User"} 
                        />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                          {userProfile?.display_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium">{userProfile?.display_name || "User"}</div>
                      <div className="text-xs text-slate-400">Level {userProfile?.xp_level || 1}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-slate-800/95 backdrop-blur-lg border-slate-700 shadow-xl" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={userProfile?.profile_image_url} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            {userProfile?.display_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none text-white">
                            {userProfile?.display_name || "SmartClicker"}
                          </p>
                          <p className="text-xs leading-none text-slate-400 mt-1">
                            {userProfile?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pt-2 border-t border-slate-700">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-white">{userProfile?.points || 0}</div>
                          <div className="text-xs text-slate-400">Points</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-white">Lv.{userProfile?.xp_level || 1}</div>
                          <div className="text-xs text-slate-400">Level</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-green-400">${userProfile?.wallet_balance?.toFixed(2) || "0.00"}</div>
                          <div className="text-xs text-slate-400">Balance</div>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="text-white hover:bg-slate-700 cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/wallet")} className="text-white hover:bg-slate-700 cursor-pointer">
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>Wallet</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/social-connect")} className="text-white hover:bg-slate-700 cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Connect Accounts</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile/edit")} className="text-white hover:bg-slate-700 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:bg-slate-700 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate("/auth")} className="text-white hover:bg-slate-800/50 rounded-lg">
                Log in
              </Button>
              <Button onClick={() => navigate("/auth")} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg border-0 shadow-lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Start Earning
              </Button>
            </div>
          )}

          {/* Enhanced Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden text-white hover:bg-slate-800/50 rounded-lg">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-slate-900/95 backdrop-blur-lg border-slate-800">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="text-white w-4 h-4" />
                  </div>
                  <span className="font-bold text-xl text-white">SmartClicks</span>
                </div>

                <nav className="flex flex-col space-y-4 pt-6">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center space-x-3 text-lg font-medium text-white hover:text-purple-300 transition-colors py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                  
                  {!user && (
                    <div className="border-t border-slate-800 pt-6 mt-6 space-y-3">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-lg text-white hover:bg-slate-800"
                        onClick={() => {
                          navigate("/auth");
                          setIsOpen(false);
                        }}
                      >
                        Log in
                      </Button>
                      <Button 
                        className="w-full justify-start text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                        onClick={() => {
                          navigate("/auth");
                          setIsOpen(false);
                        }}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Start Earning
                      </Button>
                    </div>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;

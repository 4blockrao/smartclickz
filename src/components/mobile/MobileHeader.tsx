
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, 
  Bell, 
  Wallet, 
  Settings, 
  LogOut, 
  User,
  Sparkles,
  Plus,
  ArrowLeft
} from "lucide-react";

export default function MobileHeader() {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDashboard = location.pathname.startsWith("/dashboard");
  const isNestedRoute = location.pathname.split('/').filter(Boolean).length > 1;

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  // Simplified header for nested dashboard routes
  if (isDashboard && isNestedRoute) {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const currentSection = pathSegments[1];
    const formattedTitle = currentSection.charAt(0).toUpperCase() + currentSection.slice(1);
    
    return (
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex h-14 items-center px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/dashboard")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">{formattedTitle}</h1>
          
          <div className="ml-auto flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              onClick={() => navigate("/wallet")}
            >
              <Wallet className="h-4 w-4" />
              <span className="sr-only">Wallet</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">3</Badge>
              <span className="sr-only">Notifications</span>
            </Button>
          </div>
        </div>
      </header>
    );
  }

  if (!user) {
    return (
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Sparkles className="text-primary-foreground w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-foreground">SmartClicks</span>
          </div>
          <Button 
            size="sm" 
            onClick={() => navigate("/auth")}
            className="bg-primary hover:bg-primary/90"
          >
            Sign In
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userProfile?.profile_image_url} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {userProfile?.display_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground truncate max-w-32">
              {userProfile?.display_name || "User"}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs px-1 py-0">
                Lv.{userProfile?.xp_level || 1}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {userProfile?.points || 0} pts
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative"
            onClick={() => navigate("/wallet")}
          >
            <Wallet className="h-4 w-4" />
            <span className="sr-only">Wallet</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative"
          >
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">3</Badge>
            <span className="sr-only">Notifications</span>
          </Button>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 pb-6 border-b">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={userProfile?.profile_image_url} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userProfile?.display_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{userProfile?.display_name || "User"}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        Level {userProfile?.xp_level || 1}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        ${userProfile?.wallet_balance?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>
                </div>

                <nav className="flex-1 py-6 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/dashboard");
                      setIsMenuOpen(false);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/wallet");
                      setIsMenuOpen(false);
                    }}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Wallet
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/submit-classified");
                      setIsMenuOpen(false);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Post Ad
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/profile/edit");
                      setIsMenuOpen(false);
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </nav>

                <div className="border-t pt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardNavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    // Always reload or navigate to /auth to fully reset UI and local state
    navigate("/auth", { replace: true });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full h-14 flex justify-between items-center px-4 z-40 bg-gradient-to-r from-primary to-primary/80 shadow">
      <div className="font-bold text-xl text-white tracking-wide">
        Dashboard
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate("/profile")}>
          <User />
        </Button>
        {user && (
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        )}
      </div>
    </nav>
  );
}

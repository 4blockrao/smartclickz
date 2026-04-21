
import { Home, List, Calendar, Users, Bell } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const tabs = [
  {
    label: "Home",
    icon: Home,
    to: "/",
    public: true,
  },
  {
    label: "Events",
    icon: Calendar,
    to: "/events",
    public: true,
  },
  {
    label: "Community",
    icon: Users,
    to: "/profiles",
    public: true,
  },
  {
    label: "Classifieds",
    icon: List,
    to: "/classifieds",
    public: true,
  },
  {
    label: "Notifications",
    icon: Bell,
    to: "/notifications",
    public: false,
  },
];

export default function MobileTabBar() {
  const location = useLocation();
  const { user } = useAuth();
  const [hasNotifications, setHasNotifications] = useState(false);
  
  useEffect(() => {
    // This is where we'd check for notifications from the server
    // For now, let's just simulate some notifications
    if (user) {
      setHasNotifications(true);
    }
  }, [user]);

  // Don't show on auth pages or dashboard pages
  if (location.pathname.startsWith("/auth") || location.pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border safe-area-pb"
    >
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          // Hide notifications tab if not authenticated
          if (!tab.public && !user) {
            return null;
          }

          const isActive = 
            tab.to === "/" 
              ? location.pathname === "/"
              : location.pathname.startsWith(tab.to);

          return (
            <NavLink
              to={tab.to}
              key={tab.label}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-lg transition-all duration-200",
                isActive
                  ? "text-primary bg-primary/10 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              aria-label={tab.label}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <tab.icon
                  className={cn(
                    "h-5 w-5 mb-1 transition-all duration-200",
                    isActive ? "stroke-2" : "stroke-1.5"
                  )}
                />
                {tab.label === "Notifications" && hasNotifications && (
                  <Badge className="absolute -top-1 -right-1 h-2 w-2 p-0" />
                )}
              </motion.div>
              <span
                className={cn(
                  "text-xs font-medium leading-none",
                  isActive ? "font-semibold" : "font-normal"
                )}
              >
                {tab.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </motion.nav>
  );
}

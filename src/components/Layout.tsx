
import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import ErrorBoundary from "@/components/ui/error-boundary";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import MobileLayout from "./mobile/MobileLayout";

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  showMobileNav?: boolean;
  requireAuth?: boolean;
}

const Layout = ({ 
  children, 
  showFooter = true, 
  showMobileNav = true,
  requireAuth = false
}: LayoutProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // If on mobile, use the MobileLayout component
  if (isMobile) {
    return (
      <MobileLayout
        showTabBar={showMobileNav}
        requireAuth={requireAuth}
      >
        {children}
      </MobileLayout>
    );
  }
  
  // Desktop layout - full width, no container restrictions
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background w-full">
        <Header />
        
        <main className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        
        {showFooter && <Footer />}
      </div>
    </ErrorBoundary>
  );
};

export default Layout;

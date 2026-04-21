
import { useState, useEffect } from "react";

// Define a breakpoints type
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'widescreen';

export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWidescreen: boolean;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  currentBreakpoint: Breakpoint;
}

const getBreakpoint = (width: number): Breakpoint => {
  if (width < 768) return 'mobile';
  if (width >= 768 && width < 1024) return 'tablet';
  if (width >= 1024 && width < 1536) return 'desktop';
  return 'widescreen';
};

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isWidescreen: false,
    width: 0,
    height: 0,
    orientation: 'portrait',
    currentBreakpoint: 'mobile'
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const orientation = width > height ? 'landscape' : 'portrait';
      const currentBreakpoint = getBreakpoint(width);
      
      setState({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024 && width < 1536,
        isWidescreen: width >= 1536,
        width,
        height,
        orientation,
        currentBreakpoint
      });
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return state;
}

// Convenience hooks for common screen size checks
export function useIsMobile() {
  const { isMobile } = useResponsive();
  return isMobile;
}

export function useIsTablet() {
  const { isTablet } = useResponsive();
  return isTablet;
}

export function useIsDesktop() {
  const { isDesktop, isWidescreen } = useResponsive();
  return isDesktop || isWidescreen;
}

// Hook to determine if the app is running as a PWA/standalone app
export function useIsPwa() {
  const [isPwa, setIsPwa] = useState(false);
  
  useEffect(() => {
    // Check if the app is running in standalone mode (installed as PWA)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://');
    
    setIsPwa(isStandalone);
  }, []);
  
  return isPwa;
}

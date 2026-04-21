
import { useState, useEffect } from 'react';

export interface PWAStatus {
  isInstallable: boolean;
  isInstalled: boolean;
  isSupported: boolean;
}

export function usePWA(): PWAStatus {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if PWA is supported
    const checkSupport = () => {
      const isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
      setIsSupported(isSupported);
    };

    // Check if app is installed
    const checkInstallation = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes('android-app://');
      
      setIsInstalled(isStandalone);
    };

    // Listen for beforeinstallprompt
    const handleBeforeInstall = () => {
      setIsInstallable(true);
    };

    // Listen for appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };

    checkSupport();
    checkInstallation();
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return {
    isInstallable,
    isInstalled,
    isSupported
  };
}

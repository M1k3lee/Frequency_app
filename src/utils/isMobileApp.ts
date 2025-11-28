// Detect if running in Capacitor mobile app
export const isMobileApp = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for Capacitor
  const capacitor = (window as any).Capacitor;
  if (capacitor && capacitor.isNativePlatform()) {
    return true;
  }
  
  // Check for Cordova (fallback)
  if ((window as any).cordova) {
    return true;
  }
  
  return false;
};


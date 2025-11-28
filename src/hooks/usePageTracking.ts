import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, any>) => void;
    dataLayer?: any[];
  }
}

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if gtag is available
    if (typeof window.gtag === 'function') {
      // Track pageview
      window.gtag('config', 'G-09L57HRL2K', {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location]);
};


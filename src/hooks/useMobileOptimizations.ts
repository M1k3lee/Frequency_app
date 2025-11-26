import { useEffect } from 'react';

export const useMobileOptimizations = () => {
  useEffect(() => {
    // Only apply mobile optimizations on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
      // Desktop: Allow right-click
      return;
    }

    // Mobile: Prevent double-tap zoom
    let lastTouchEnd = 0;
    const preventZoom = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchend', preventZoom, { passive: false });

    // Set viewport meta tag
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }

    // Prevent pull-to-refresh
    let touchStartY = 0;
    const preventPullToRefresh = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const checkPullToRefresh = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      if (touchY - touchStartY > 50 && window.scrollY === 0) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', preventPullToRefresh, { passive: false });
    document.addEventListener('touchmove', checkPullToRefresh, { passive: false });

    return () => {
      document.removeEventListener('touchend', preventZoom);
      document.removeEventListener('touchstart', preventPullToRefresh);
      document.removeEventListener('touchmove', checkPullToRefresh);
    };
  }, []);
};


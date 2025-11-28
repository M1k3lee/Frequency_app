import React, { useEffect, useRef, useState } from 'react';
import { AdMob } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import './AdMobNativeAd.css';

interface AdMobNativeAdProps {
  adUnitId: string;
  className?: string;
}

// Track if AdMob has been initialized
let admobInitialized = false;

const AdMobNativeAd: React.FC<AdMobNativeAdProps> = ({ adUnitId, className = '' }) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const loadAd = async () => {
      // Only load on Android native platform
      if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
        return;
      }

      try {
        // Initialize AdMob only once
        if (!admobInitialized) {
          await AdMob.initialize({
            testingDevices: [],
            initializeForTesting: false,
          });
          admobInitialized = true;
        }

        // Wait for DOM to be ready
        if (!containerRef.current) {
          return;
        }

        // Note: Native ad methods may vary by AdMob plugin version
        // This component is a placeholder for future native ad implementation
        // For now, we'll just initialize AdMob
        if (mounted) {
          setAdLoaded(true);
        }
      } catch (error: any) {
        console.error('AdMob Native Ad Error:', error);
        if (mounted) {
          setAdError(error.message || 'Failed to load ad');
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      loadAd();
    }, 800);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [adUnitId]);

  // Only render on Android native platform
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
    return null;
  }

  return (
    <div className={`admob-native-ad-container ${className}`}>
      <div
        ref={containerRef}
        id="native-ad-container"
        className="native-ad-container"
      >
        {!adLoaded && !adError && (
          <div className="ad-loading">
            <div className="ad-loading-spinner"></div>
          </div>
        )}
        {adError && (
          <div className="ad-error">
            {/* Silently fail - don't show error to users */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdMobNativeAd;


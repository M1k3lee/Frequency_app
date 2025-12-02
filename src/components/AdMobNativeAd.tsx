import React, { useEffect, useState } from 'react';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import './AdMobNativeAd.css';

/**
 * AdMob Banner Ad Component
 * 
 * Testing Mode: Currently enabled for testing before AdMob activation.
 * - With isTesting: true, test ads will be shown using your ad unit ID
 * - For production, set isTesting: false and initializeForTesting: false
 * 
 * Optional: You can also use Google's test ad unit ID for testing:
 * "ca-app-pub-3940256099942544/6300978111"
 */

interface AdMobNativeAdProps {
  adUnitId: string;
  className?: string;
}

// Track if AdMob has been initialized
let admobInitialized = false;

const AdMobNativeAd: React.FC<AdMobNativeAdProps> = ({ adUnitId, className = '' }) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let loadedListener: any = null;
    let failedListener: any = null;

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
            initializeForTesting: true, // Enable testing mode
          });
          admobInitialized = true;
        }

        // Set up event listeners for banner ad
        loadedListener = AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
          if (mounted) {
            setAdLoaded(true);
            setAdError(null);
          }
        });

        failedListener = AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (error: any) => {
          console.error('AdMob Banner Failed to Load:', error);
          if (mounted) {
            setAdError(error.message || 'Failed to load ad');
            setAdLoaded(false);
          }
        });

        // Small delay to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 500));

        // Show banner ad
        const options: BannerAdOptions = {
          adId: adUnitId,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.TOP_CENTER,
          margin: 0,
          // Enable testing mode - shows test ads before AdMob activation
          isTesting: true
        };

        await AdMob.showBanner(options);
      } catch (error: any) {
        console.error('AdMob Banner Error:', error);
        if (mounted) {
          setAdError(error.message || 'Failed to load ad');
        }
      }
    };

    // Delay to ensure DOM and AdMob are ready
    const timer = setTimeout(() => {
      loadAd();
    }, 1000);

    // Cleanup function
    return () => {
      mounted = false;
      clearTimeout(timer);
      
      // Remove listeners
      if (loadedListener) {
        loadedListener.remove();
      }
      if (failedListener) {
        failedListener.remove();
      }
      
      // Hide banner when component unmounts
      AdMob.hideBanner().catch(console.error);
    };
  }, [adUnitId]);

  // Only render on Android native platform
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
    return null;
  }

  return (
    <div className={`admob-native-ad-container ${className}`}>
      {/* This container provides spacing - the actual banner ad is overlaid by Capacitor */}
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
      {/* Banner ad will appear as an overlay at the TOP_CENTER position */}
      {adLoaded && (
        <div className="ad-loaded-indicator">
          {/* Ad is displaying - this space is reserved */}
        </div>
      )}
    </div>
  );
};

export default AdMobNativeAd;


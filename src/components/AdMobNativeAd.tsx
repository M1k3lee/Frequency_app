import React, { useEffect, useState } from 'react';
import {
  AdMob,
  BannerAdOptions,
  BannerAdPluginEvents,
  BannerAdPosition,
  BannerAdSize,
} from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { ANDROID_ADMOB_TEST_BANNER_AD_UNIT_ID } from '../config/admob';
import './AdMobNativeAd.css';

interface AdMobNativeAdProps {
  adUnitId: string;
  className?: string;
  useTestAds?: boolean;
}

let admobInitPromise: Promise<void> | null = null;

const isAndroidNative = (): boolean =>
  Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';

const ensureAdMobInitialized = async (useTestAds: boolean): Promise<void> => {
  if (!admobInitPromise) {
    admobInitPromise = AdMob.initialize({
      testingDevices: [],
      initializeForTesting: useTestAds,
    });
  }

  await admobInitPromise;
};

const AdMobNativeAd: React.FC<AdMobNativeAdProps> = ({
  adUnitId,
  className = '',
  useTestAds = false,
}) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let loadedListener: { remove: () => Promise<void> } | null = null;
    let failedListener: { remove: () => Promise<void> } | null = null;

    const loadBanner = async () => {
      if (!isAndroidNative()) {
        return;
      }

      const resolvedAdUnitId = useTestAds
        ? ANDROID_ADMOB_TEST_BANNER_AD_UNIT_ID
        : adUnitId;

      if (!resolvedAdUnitId) {
        if (mounted) {
          setAdError('Missing Android AdMob banner ad unit ID');
        }
        return;
      }

      try {
        await ensureAdMobInitialized(useTestAds);

        loadedListener = await AdMob.addListener(
          BannerAdPluginEvents.Loaded,
          () => {
            if (!mounted) return;
            setAdLoaded(true);
            setAdError(null);
          }
        );

        failedListener = await AdMob.addListener(
          BannerAdPluginEvents.FailedToLoad,
          (error: any) => {
            if (!mounted) return;
            setAdLoaded(false);
            setAdError(error?.message || error?.code || 'Failed to load ad');
            console.error('[AdMob] Banner failed to load:', error);
          }
        );

        // Ensure we do not stack banners if component remounts.
        await AdMob.hideBanner().catch(() => undefined);

        const options: BannerAdOptions = {
          adId: resolvedAdUnitId,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 84,
          isTesting: useTestAds,
        };

        await AdMob.showBanner(options);
      } catch (error: any) {
        if (mounted) {
          setAdLoaded(false);
          setAdError(error?.message || error?.code || 'Failed to initialize/show ad');
        }
        console.error('[AdMob] Banner error:', error);
      }
    };

    // Small delay helps avoid startup race conditions in WebView.
    const timer = setTimeout(() => {
      loadBanner();
    }, 500);

    return () => {
      mounted = false;
      clearTimeout(timer);

      loadedListener?.remove().catch(() => undefined);
      failedListener?.remove().catch(() => undefined);
      AdMob.hideBanner().catch(() => undefined);
    };
  }, [adUnitId, useTestAds]);

  if (!isAndroidNative()) {
    return null;
  }

  return (
    <div className={`admob-native-ad-container ${className}`}>
      {!adLoaded && !adError && (
        <div className="ad-loading">
          <div className="ad-loading-spinner"></div>
        </div>
      )}
      {adError && <div className="ad-error" />}
      {adLoaded && <div className="ad-loaded-indicator" />}
    </div>
  );
};

export default AdMobNativeAd;
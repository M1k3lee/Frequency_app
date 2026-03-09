// IMPORTANT:
// The banner flow uses AdMob.showBanner(), so this MUST be a Banner ad unit ID.
// If your AdMob unit is "Native Advanced", it will not load in this code path.
export const ANDROID_ADMOB_APP_ID =
  import.meta.env.VITE_ADMOB_ANDROID_APP_ID ||
  'ca-app-pub-1993326848971014~7211452781';

export const ANDROID_ADMOB_BANNER_AD_UNIT_ID =
  import.meta.env.VITE_ADMOB_ANDROID_BANNER_AD_UNIT_ID ||
  'ca-app-pub-1993326848971014/2440032906';

export const ANDROID_ADMOB_TEST_BANNER_AD_UNIT_ID =
  'ca-app-pub-3940256099942544/6300978111';

export const ANDROID_ADMOB_USE_TEST_ADS =
  import.meta.env.VITE_ADMOB_USE_TEST_ADS === 'true';

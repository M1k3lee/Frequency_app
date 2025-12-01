# Android Splash Screen Setup

The Android app now uses a custom fullscreen splash screen with a gradient background matching the app theme.

## Current Setup

- **Splash Screen Drawable**: `android/app/src/main/res/drawable/splash.xml`
- **Background**: Radial gradient matching app theme (`#1a1a2e` → `#0f0f1f` → `#0a0a0f`)
- **Logo**: Currently uses the app launcher icon centered
- **Configuration**: `capacitor.config.json` (SplashScreen plugin settings)

## To Add a Custom Splash Image

For an even more impressive splash screen, you can add custom splash images:

1. **Create splash images** at different densities:
   - `drawable-mdpi/splash.png` (320x480px)
   - `drawable-hdpi/splash.png` (480x800px)
   - `drawable-xhdpi/splash.png` (720x1280px)
   - `drawable-xxhdpi/splash.png` (1080x1920px)
   - `drawable-xxxhdpi/splash.png` (1440x2560px)

2. **Update splash.xml** to use your custom image:
   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <layer-list xmlns:android="http://schemas.android.com/apk/res/android">
       <item android:drawable="@drawable/splash_background" />
       <item>
           <bitmap
               android:gravity="fill"
               android:src="@drawable/splash" />
       </item>
   </layer-list>
   ```

3. **Or use the logo file directly** by copying `src/assets/zen_frequency_logo.png` to drawable folders

## Current Configuration

The splash screen is configured to:
- Show for 2.5 seconds
- Use fullscreen immersive mode
- Match the app's dark purple gradient theme
- Automatically hide when app loads

## Testing

After building the Android app, the splash screen will automatically appear when the app launches.


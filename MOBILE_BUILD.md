# Mobile App (APK) Build Guide

This document explains how to build the Android APK without affecting the website deployment files.

## Important: Website Files Protection

✅ **The website build process is completely separate and unchanged:**
- Website builds use: `npm run build` or `npm run build:gh-pages`
- These use `vite.config.ts` with GitHub Pages base path (`/Frequency_app/`)
- Website deployment to GitHub Pages is unaffected

✅ **Mobile builds use a separate configuration:**
- Mobile builds use: `npm run build:mobile`
- This uses `vite.config.mobile.ts` with relative paths (`./`)
- Mobile builds output to the same `dist/` folder but with correct paths for mobile

## Building the Android APK

### Prerequisites
- Node.js 18+ and npm installed
- Android Studio with Android SDK installed
- Java Development Kit (JDK) installed

### Build Steps

1. **Build for mobile (uses relative paths):**
   ```bash
   npm run build:mobile
   ```
   This builds the app with `./` base path (required for mobile apps).

2. **Sync with Capacitor:**
   ```bash
   npm run cap:sync
   ```
   This syncs the web build to the Android project.

3. **Build APK (Debug):**
   ```bash
   npm run cap:build:android
   ```
   This will:
   - Run `build:mobile` (with correct base path)
   - Sync to Android
   - Build the debug APK

4. **Build APK (Release):**
   ```bash
   npm run cap:build:android:release
   ```
   For production release APK (requires signing configuration).

### APK Location

After building, the APK will be located at:
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`

## Configuration Files

- **`capacitor.config.json`**: Root-level Capacitor configuration
- **`vite.config.ts`**: Website build configuration (GitHub Pages)
- **`vite.config.mobile.ts`**: Mobile build configuration (relative paths)

## Notes

- The `dist/` folder is in `.gitignore`, so builds don't affect the repository
- Website deployment continues to work as before
- Mobile builds overwrite `dist/` but this is expected and safe
- Always use `build:mobile` for APK builds, never `build` directly

## Troubleshooting

### APK shows blank screen
- Ensure you used `npm run build:mobile` (not `npm run build`)
- Check that `vite.config.mobile.ts` uses `base: './'`

### Assets not loading in APK
- Verify the build used relative paths (`./`)
- Check `capacitor.config.json` has correct `webDir: "dist"`

### Website deployment broken
- This shouldn't happen, but if it does, verify `vite.config.ts` still has the GitHub Pages base path logic
- The website build process is unchanged and separate


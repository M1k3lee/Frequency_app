# Google Analytics Setup for Android App

## Package Name
Your Android app package name is: **`com.frequencyzen.app`**

## Setup Instructions

### Option 1: Web Google Analytics (Already Added)
The web Google Analytics (gtag.js) is already added to the mobile HTML file and will work in the WebView. This tracks page views and user interactions.

**Tracking ID:** `G-09L57HRL2K`

### Option 2: Firebase Analytics (Native Android)
For more detailed native Android analytics, you can set up Firebase Analytics:

1. **Go to Firebase Console:**
   - Visit https://console.firebase.google.com/
   - Create a new project or select existing
   - Add Android app with package name: `com.frequencyzen.app`

2. **Download google-services.json:**
   - Download the `google-services.json` file from Firebase
   - Place it in: `android/app/google-services.json`

3. **Enable Firebase Analytics:**
   - The build.gradle is already configured to use google-services.json if present
   - Uncomment the Firebase dependencies in `android/app/build.gradle`:
   ```gradle
   implementation platform('com.google.firebase:firebase-bom:32.7.0')
   implementation 'com.google.firebase:firebase-analytics'
   ```

4. **Rebuild the app:**
   ```bash
   npm run cap:build:android
   ```

## Current Status
- ✅ Web Google Analytics (gtag.js) is active in the mobile app
- ⚠️ Firebase Analytics is ready but requires google-services.json file

The web analytics will track all user interactions in the app through the WebView.


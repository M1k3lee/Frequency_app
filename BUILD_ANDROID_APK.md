# Building the Android Release APK

## Prerequisites

1. **Java 11 or newer** - Required for Android Gradle Plugin 8.2.2
   - Check your Java version: `java -version`
   - Download Java 11+ from: https://adoptium.net/

2. **Android SDK** - Should already be configured if you've built before

## Build Steps

### Option 1: Using npm script (Recommended)
```bash
npm run cap:build:android:release
```

### Option 2: Manual build
```bash
# 1. Build the mobile web assets
npm run build:mobile

# 2. Sync with Capacitor
npx cap sync android

# 3. Build the release APK
cd android
.\gradlew.bat assembleRelease  # Windows
# OR
./gradlew assembleRelease       # Mac/Linux
```

## APK Location

After successful build, the APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Upload to Website

1. Copy the APK to the downloads folder:
   ```bash
   copy android\app\build\outputs\apk\release\app-release.apk public\downloads\frequency-zen.apk
   ```

2. Commit and push:
   ```bash
   git add public/downloads/frequency-zen.apk
   git commit -m "Add Android APK for download"
   git push origin main
   ```

3. The APK will be available at: `https://zoneout.space/downloads/frequency-zen.apk`

## Troubleshooting

### Java Version Error
If you see: "Dependency requires at least JVM runtime version 11"
- Install Java 11 or newer
- Set JAVA_HOME environment variable
- Restart terminal/IDE

### Signing Issues
For release builds, you need a signing key. The current setup uses:
- `android/app/key.properties` (if exists)
- Or debug signing for testing

For production, create a proper signing key:
```bash
keytool -genkey -v -keystore android/app/release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
```


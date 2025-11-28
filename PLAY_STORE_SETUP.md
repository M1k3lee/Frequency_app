# Play Store Submission Guide

This guide will help you build a release version of your app for Google Play Store submission.

## Step 1: Create a Release Keystore

You need to create a keystore file to sign your app. **Keep this file secure and backed up!**

### Option A: Using Android Studio (Recommended)

1. In Android Studio, go to **Build → Generate Signed Bundle / APK**
2. Select **Android App Bundle** (preferred) or **APK**
3. Click **Create new...** to create a new keystore
4. Fill in the keystore information:
   - **Key store path**: Choose a location (e.g., `android/app/release.keystore`)
   - **Password**: Create a strong password (save this!)
   - **Key alias**: e.g., `frequency-zen-key`
   - **Key password**: Create a strong password (save this!)
   - **Validity**: 25 years (recommended)
   - **Certificate information**: Fill in your details
5. Click **OK** to create the keystore

### Option B: Using Command Line

Run this command in the `android/app` directory:

```bash
keytool -genkey -v -keystore release.keystore -alias frequency-zen-key -keyalg RSA -keysize 2048 -validity 10000
```

You'll be prompted for:
- Keystore password
- Key password
- Your name, organization, etc.

## Step 2: Create key.properties File

Create a file called `key.properties` in the `android/` directory with:

```properties
storeFile=app/release.keystore
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=frequency-zen-key
keyPassword=YOUR_KEY_PASSWORD
```

**IMPORTANT**: 
- This file is in `.gitignore` - it won't be committed to git
- Keep this file secure and backed up
- Never share your keystore or passwords

## Step 3: Build Release APK or AAB

### Build Android App Bundle (AAB) - Recommended for Play Store

In Android Studio:
1. **Build → Generate Signed Bundle / APK**
2. Select **Android App Bundle**
3. Select your release keystore
4. Choose **release** build variant
5. Click **Create**

The AAB will be at: `android/app/build/outputs/bundle/release/app-release.aab`

### Build Release APK

In Android Studio:
1. **Build → Generate Signed Bundle / APK**
2. Select **APK**
3. Select your release keystore
4. Choose **release** build variant
5. Click **Create**

Or use command line:
```bash
npm run build:mobile
npx cap sync android
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## Step 4: Prepare for Play Store

Before submitting, make sure you have:

1. **App Icon**: At least 512x512px PNG
2. **Screenshots**: 
   - Phone: At least 2 screenshots (1080x1920px or higher)
   - Tablet (if supported): At least 2 screenshots
3. **Feature Graphic**: 1024x500px PNG
4. **App Description**: Up to 4000 characters
5. **Short Description**: Up to 80 characters
6. **Privacy Policy URL**: Required for apps that collect data
7. **Content Rating**: Complete the questionnaire

## Step 5: Upload to Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app or select existing
3. Go to **Production** → **Create new release**
4. Upload your AAB (or APK)
5. Fill in release notes
6. Review and publish

## Important Notes

- **Keep your keystore safe!** If you lose it, you cannot update your app
- **Backup your keystore** to a secure location
- The first upload must be an AAB or APK, but Google prefers AAB
- You'll need to increment `versionCode` for each update
- Update `versionName` for user-visible version numbers

## Troubleshooting

### "App not installed" error
- Make sure you're using a release build, not debug
- Uninstall any previous debug versions first

### Signing errors
- Verify your `key.properties` file is correct
- Make sure the keystore file path is correct
- Check that passwords match


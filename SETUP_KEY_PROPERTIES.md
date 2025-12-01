# Quick Setup: key.properties File

## 🚨 Error: Missing Signing Configuration

You're seeing this error because `key.properties` doesn't exist yet. This file is required for release APK signing.

## ✅ Quick Fix

### Option 1: Create key.properties (For Release Builds)

1. **Create file**: `key.properties` in project root (same folder as `package.json`)

2. **Add this content** (replace with your actual values):
```properties
storeFile=../freq.jks
storePassword=YOUR_PASSWORD_HERE
keyAlias=YOUR_ALIAS_HERE
keyPassword=YOUR_PASSWORD_HERE
```

3. **Find your values**:
   - 📖 **See `HOW_TO_FIND_KEYSTORE_VALUES.md` for detailed instructions on finding values in Android Studio**
   - If you already have `freq.jks`, check Android Studio's signing config or use the helper script
   - Run `node scripts/check-keystore.js` to list keystore information (if you know the password)
   - If you don't have the password, check with whoever set up the keystore
   - Or create a new keystore (see below) - ⚠️ **This breaks app updates!**

### Option 2: Build Debug APK (For Testing)

In Android Studio:
- Change **Build Variant** to "debug" (bottom left)
- Build → Build APK(s)
- Uses debug signing automatically

## 🔧 If You Need to Create a New Keystore

```bash
keytool -genkey -v -keystore freq.jks -keyalg RSA -keysize 2048 -validity 10000 -alias freq
```

This will ask for:
- Password (remember this!)
- Your name/organization
- etc.

Then create `key.properties`:
```properties
storeFile=../freq.jks
storePassword=THE_PASSWORD_YOU_ENTERED
keyAlias=freq
keyPassword=THE_PASSWORD_YOU_ENTERED
```

## 📁 File Location

```
Frequency/
├── package.json
├── freq.jks          ← Keystore file (should exist)
├── key.properties    ← Create this file
└── android/
```

## ⚠️ Important

- `key.properties` is in `.gitignore` (won't be committed)
- Keep passwords secure
- **Never lose the keystore file** - you can't update apps without it!

## 🎯 After Creating key.properties

1. Sync Gradle in Android Studio
2. Build → Build APK(s) → Select "release"
3. Build should now succeed!

---

**Need help finding the values?** See `HOW_TO_FIND_KEYSTORE_VALUES.md` for step-by-step instructions on finding keystore values in Android Studio.

**For more details:** See `ANDROID_SIGNING_SETUP.md` for comprehensive signing setup instructions.


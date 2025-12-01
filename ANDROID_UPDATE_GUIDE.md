# Android App Update Guide

## 🚨 Quick Fix for Install Conflicts

**Problem**: Getting "App not installed" or "Installation conflict" when trying to install an updated APK?

**Solution**: All APK versions must use the **same signing key**. 

### Immediate Fix:

1. **For Release/Production APKs**: 
   - Always build with: `npm run cap:build:android:release`
   - Uses your keystore (`freq.jks`) - same key every time ✅

2. **For Debug/Testing APKs**:
   - Either use release build above, OR
   - Uninstall old version first: `adb uninstall com.frequencyzen.app`

### Before Each Update:
- Increment `versionCode` in `android/app/build.gradle` (current: 2)
- Use same keystore for signing
- Build release APK

---

## 🔄 Ensuring Updates Work Properly

To allow users to update from older versions without conflicts, all APKs must be signed with the **same signing key**. This guide explains how to ensure smooth updates.

## ⚠️ Common Install Conflict Issues

### Problem: "App not installed" or "Installation conflict"

This happens when:
1. **Different signing keys**: Old APK and new APK use different keys
2. **Unsigned debug builds**: Debug builds use a temporary key that changes
3. **Package name mismatch**: Different application IDs

### Solution: Consistent Signing Configuration

## 📝 Signing Configuration

### For Release APKs (Play Store or Direct Distribution)

1. **Create or use existing keystore**:
   - Keystore file: `freq.jks` (already exists in project root)
   - **IMPORTANT**: Keep this file safe and backed up!
   - **NEVER** lose this file - you cannot update apps signed with a lost key

2. **Create `key.properties` file** in project root (if not exists):
   ```properties
   storeFile=../freq.jks
   storePassword=YOUR_KEYSTORE_PASSWORD
   keyAlias=YOUR_KEY_ALIAS
   keyPassword=YOUR_KEY_PASSWORD
   ```

3. **Build release APK**:
   ```bash
   npm run cap:build:android:release
   ```

### For Debug/Development APKs

**Problem**: Debug builds use a temporary debug key that changes, causing install conflicts.

**Solution**: Use a consistent debug signing config OR uninstall old version first.

#### Option 1: Use Release Build for Testing (Recommended)
Use the release build with your keystore for testing updates:
```bash
npm run cap:build:android:release
```

#### Option 2: Configure Debug Signing (Development Only)
For development, configure debug builds to use a consistent key in `android/app/build.gradle`:

```gradle
signingConfigs {
    debug {
        storeFile file('../freq.jks')
        storePassword 'YOUR_PASSWORD'
        keyAlias 'YOUR_ALIAS'
        keyPassword 'YOUR_PASSWORD'
    }
    release {
        // ... existing release config
    }
}
```

**Warning**: Only do this for development. Never commit passwords to git!

#### Option 3: Uninstall Before Installing (Simplest)
Before installing a new debug APK:
```bash
adb uninstall com.frequencyzen.app
```

Or manually: Settings → Apps → Frequency Zen → Uninstall

## 🔧 Current Configuration

### Version Information
- **Package Name**: `com.frequencyzen.app` (same for all versions)
- **Current Version Code**: 2
- **Current Version Name**: 1.1.0

### Signing Status
- **Release builds**: Configured to use `freq.jks` keystore (via `key.properties`)
- **Debug builds**: Use temporary debug key (may cause conflicts)

## ✅ Update Checklist

Before releasing an update:

1. **✅ Version Code Incremented**: Always increment `versionCode` in `android/app/build.gradle`
   - Current: 2
   - Next: 3, 4, 5, etc.

2. **✅ Version Name Updated**: Update `versionName` for display
   - Current: "1.1.0"
   - Follow semantic versioning: "1.2.0", "1.2.1", "2.0.0"

3. **✅ Same Signing Key**: All APKs must use the same keystore
   - Use `freq.jks` for all release builds
   - Document the keystore location and backup

4. **✅ Same Package Name**: Keep `applicationId` as `com.frequencyzen.app`

## 📦 Building Update-Ready APKs

### For Production (Users Installing Updates)

```bash
# 1. Build mobile version
npm run build:mobile

# 2. Sync to Android
npm run cap:sync

# 3. Build release APK (signed with your keystore)
npm run cap:build:android:release
```

**Result**: `android/app/build/outputs/apk/release/app-release.apk`

This APK will:
- ✅ Update existing installations automatically
- ✅ Work on all devices with the app installed
- ✅ Maintain user data (no uninstall needed)

### For Development/Testing

**If testing updates**:
```bash
# Use release build even for testing
npm run cap:build:android:release
```

**If just testing features** (don't need to update):
```bash
# Debug build is fine
npm run cap:build:android
```

## 🔐 Keystore Management

### Backup Your Keystore

Your `freq.jks` file is **critical**:
- **Back it up** to multiple secure locations
- **Never commit it** to git (already in `.gitignore`)
- **Document the passwords** in a secure password manager
- **If you lose it**, you cannot update existing app installations

### Creating a New Keystore (If Needed)

If you need to create a new keystore:

```bash
keytool -genkey -v -keystore freq.jks -keyalg RSA -keysize 2048 -validity 10000 -alias freq
```

Then create `key.properties`:
```properties
storeFile=../freq.jks
storePassword=YOUR_PASSWORD
keyAlias=freq
keyPassword=YOUR_PASSWORD
```

## 🚨 Troubleshooting Install Conflicts

### Scenario: User gets "App not installed" error

**Cause**: New APK signed with different key than installed version

**Solutions**:

1. **For release builds**: Ensure using same keystore (`freq.jks`)
2. **For debug builds**: Uninstall old version first:
   ```bash
   adb uninstall com.frequencyzen.app
   ```

3. **Manual uninstall**: Settings → Apps → Frequency Zen → Uninstall

### Scenario: "Installation conflict" error

**Cause**: Package signature mismatch

**Solution**: Same as above - ensure consistent signing or uninstall first

### Scenario: Update works but loses data

**Cause**: Not actually an update (new install)

**Solution**: Ensure same package name and signing key

## 📋 Version Management Strategy

### Recommended Versioning

- **Major updates** (new features): Increment major version (1.0.0 → 2.0.0)
- **Minor updates** (new features): Increment minor version (1.0.0 → 1.1.0)
- **Patch updates** (bug fixes): Increment patch version (1.0.0 → 1.0.1)

**Version Code** (must always increase):
- Each release: Increment by 1 (1 → 2 → 3 → 4...)
- Play Store requires version codes to always increase

### Example Update Path

```
v1.0.0 (versionCode: 1) → Initial release
v1.1.0 (versionCode: 2) → Gateway improvements (current)
v1.2.0 (versionCode: 3) → Future features
v2.0.0 (versionCode: 4) → Major update
```

## 🔄 Update Process Summary

### For Each Update:

1. ✅ Make code changes in `src/` folder
2. ✅ Test on web version first
3. ✅ Increment `versionCode` in `android/app/build.gradle`
4. ✅ Update `versionName` in `android/app/build.gradle`
5. ✅ Build mobile version: `npm run build:mobile`
6. ✅ Sync to Android: `npm run cap:sync`
7. ✅ Build release APK: `npm run cap:build:android:release`
8. ✅ Test update on device with old version installed
9. ✅ Distribute APK

## 📝 Quick Reference

**Files to update for each release**:
- `android/app/build.gradle` - versionCode and versionName

**Files that must stay the same**:
- `android/app/build.gradle` - applicationId (com.frequencyzen.app)
- Keystore file (`freq.jks`) - same for all releases

**Build commands**:
```bash
npm run build:mobile                    # Build web assets for mobile
npm run cap:sync                        # Sync to Android/iOS
npm run cap:build:android:release       # Build signed release APK
```

---

**Remember**: Always use the same signing key for all release builds to ensure seamless updates!


# Android SDK 34 Compatibility Fix

## 🐛 Issue

**Error**: "Dependency 'androidx.core:core-ktx:1.15.0' requires libraries and applications that depend on it to compile against version 35 or later of the Android APIs."

**Cause**: Some dependencies are pulling in `androidx.core:core:1.15.0` and `androidx.core:core-ktx:1.15.0` which require SDK 35, but we're compiling against SDK 34.

## ✅ Fix Applied

Added dependency resolution strategy to force SDK 34 compatible versions:

```gradle
force 'androidx.core:core:1.12.0'      // Latest compatible with SDK 34
force 'androidx.core:core-ktx:1.12.0'  // Latest compatible with SDK 34
```

These versions (1.12.0) are the latest that support SDK 34, while 1.15.0+ requires SDK 35.

## 📝 What Changed

**File**: `android/build.gradle`

Added to the `resolutionStrategy` block in `allprojects`:

```gradle
force 'androidx.core:core:1.12.0'
force 'androidx.core:core-ktx:1.12.0'
```

This forces all dependencies to use SDK 34 compatible versions of androidx.core libraries.

## 🔄 Next Steps

1. **Sync Gradle** in Android Studio:
   - File → Sync Project with Gradle Files
   - Or click "Sync Now" if prompted

2. **Clean and Rebuild**:
   - Build → Clean Project
   - Build → Rebuild Project

3. **Build APK**:
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - Select "release" variant

## ⚠️ Important Notes

- **SDK 34 Compatibility**: We're staying on SDK 34 for stability
- **Version Forcing**: The resolution strategy forces compatible versions
- **Future Updates**: If you upgrade to SDK 35, you can remove these force directives

## 📚 Related Fixes

- `ANDROID_ADMOB_FIX.md` - Fixed VANILLA_ICE_CREAM error
- `ANDROID_BUILD_FIXES.md` - General build fixes

---

**Status**: ✅ Fixed - androidx.core versions forced to SDK 34 compatible versions





# AdMob Plugin Fix - VANILLA_ICE_CREAM Error

## 🐛 Issue

**Error**: `cannot find symbol variable VANILLA_ICE_CREAM`

**Location**: `BannerExecutor.java` line 107 in `@capacitor-community/admob` plugin

**Cause**: The plugin uses `Build.VERSION_CODES.VANILLA_ICE_CREAM` (Android 15, API 35), but we're compiling against SDK 34 where this constant doesn't exist yet.

## ✅ Fix Applied

Changed the version check from using the named constant to using the numeric API level:

**Before**:
```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.VANILLA_ICE_CREAM) {
```

**After**:
```java
if (Build.VERSION.SDK_INT >= 35) {
```

This allows the code to compile with SDK 34 while still checking for Android 15+ features.

## 📝 Note

This fix is applied directly to the plugin's source code in `node_modules`. If you:
- Delete `node_modules` and reinstall
- Update the `@capacitor-community/admob` package

You may need to reapply this fix. 

**Alternative**: Update to SDK 35 (Android 15) in `android/app/build.gradle`:
```gradle
compileSdkVersion 35
targetSdkVersion 34  // Keep target at 34 until ready for Android 15
```

## 🔄 If You Need to Reapply

If the fix gets overwritten, edit:
```
node_modules/@capacitor-community/admob/android/src/main/java/com/getcapacitor/community/admob/banner/BannerExecutor.java
```

Change line 107 from:
```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.VANILLA_ICE_CREAM) {
```

To:
```java
if (Build.VERSION.SDK_INT >= 35) {
```

---

**Status**: ✅ Fixed - Build should now succeed!





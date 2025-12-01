# Android Build Troubleshooting Guide

## 🔍 Common Build Errors and Fixes

### 1. AAR Metadata Errors

**Error**: "2 issues were found when checking AAR metadata"

**Causes**:
- Dependency version conflicts
- Missing transitive dependencies
- SDK version mismatches

**Fix Applied**:
- ✅ Set consistent SDK versions globally (SDK 34)
- ✅ Added dependency resolution strategy
- ✅ Force consistent androidx.appcompat version

**If still failing**:
1. Check the exact error message in Build Output
2. Look for specific library conflicts mentioned
3. Add to `android/build.gradle` resolutionStrategy:
   ```gradle
   force 'library:name:version'
   ```

### 2. SDK Version Mismatch

**Warning**: "compileSdk version mismatch"

**Fix Applied**:
- ✅ Added global SDK version properties in `gradle.properties`
- ✅ Set SDK versions in `build.gradle` ext block
- ✅ All modules now use SDK 34

### 3. flatDir Warning

**Warning**: "Using flatDir should be avoided"

**Status**: This is a warning only, not an error. It's from Capacitor's generated files and can be safely ignored.

**Note**: The file `capacitor-cordova-android-plugins/build.gradle` is auto-generated and should not be edited manually.

### 4. Java Version Issues

**Error**: "Android Gradle plugin requires Java 17"

**Solution**:
- Use Android Studio (bundles Java 17)
- OR install Java 17 and set JAVA_HOME
- See `ANDROID_BUILD_SETUP.md` for details

### 5. Signing Configuration Issues

**Error**: "Signing config not found" or build succeeds but APK won't install

**Fix**:
- Ensure `key.properties` file exists in project root
- Contains correct paths and passwords
- Keystore file (`freq.jks`) exists

## 🔧 Step-by-Step Build Process

### Clean Build (Recommended after fixes):

1. **Sync Gradle**:
   - In Android Studio: File → Sync Project with Gradle Files
   - Or click "Sync Now" if prompted

2. **Clean Project**:
   - Build → Clean Project

3. **Invalidate Caches** (if issues persist):
   - File → Invalidate Caches → Invalidate and Restart

4. **Rebuild**:
   - Build → Rebuild Project

5. **Build APK**:
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - Select "release" variant

## 📋 Pre-Build Checklist

Before building:
- [ ] Java 17 installed and configured
- [ ] Android Studio updated to latest
- [ ] Gradle sync completed successfully
- [ ] No red errors in Project view
- [ ] `key.properties` exists (for release builds)
- [ ] `freq.jks` keystore exists (for release builds)

## 🐛 Debugging Build Errors

### View Detailed Error:

1. Open **Build Output** panel (bottom of Android Studio)
2. Look for red error messages
3. Expand error details
4. Check for:
   - Specific library conflicts
   - Missing dependencies
   - Version mismatches

### Common Error Patterns:

**Pattern**: `Could not resolve dependency 'library:name:version'`
- **Fix**: Check repository configuration or update version

**Pattern**: `AAR metadata conflicts`
- **Fix**: Add to resolutionStrategy in `build.gradle`

**Pattern**: `compileSdk version X doesn't match`
- **Fix**: Set consistent SDK versions (already done)

**Pattern**: `Missing signing config`
- **Fix**: Create `key.properties` file

## 🔄 If Build Still Fails

1. **Check Build Output**:
   - Look for the specific error message
   - Note which module/library is causing issues

2. **Check Gradle Sync**:
   - File → Sync Project with Gradle Files
   - Wait for completion

3. **Check Dependencies**:
   - Open `android/app/build.gradle`
   - Check `dependencies` block for conflicts

4. **Try Debug Build First**:
   - Build → Build APK(s)
   - Select "debug" variant
   - If debug works, issue is likely with signing config

5. **Check Capacitor Sync**:
   ```bash
   npm run cap:sync
   ```
   This regenerates Capacitor config files

## 📝 Additional Resources

- `ANDROID_BUILD_FIXES.md` - Fixes applied
- `ANDROID_BUILD_SETUP.md` - Initial setup
- `ANDROID_UPDATE_GUIDE.md` - Update instructions

## ✅ What's Been Fixed

- ✅ SDK version consistency (all modules use SDK 34)
- ✅ Dependency resolution strategy added
- ✅ Global SDK version properties set
- ✅ Java 17 compatibility ensured

---

**If you're still seeing errors**, please share:
1. The exact error message from Build Output
2. Which step fails (sync, build, etc.)
3. Any warnings shown

This will help identify the specific issue!






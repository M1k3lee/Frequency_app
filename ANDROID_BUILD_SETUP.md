# Android Build Setup - Java 17 Requirement

## 🚨 Current Issue

The Android build requires **Java 17**, but the system is currently using **Java 11**.

## ✅ Solutions

### Option 1: Use Android Studio (Easiest)

Android Studio comes bundled with Java 17, so you can build directly from the IDE:

1. Open Android Studio
2. Open the `android` folder as a project
3. Wait for Gradle sync to complete
4. Build → Build Bundle(s) / APK(s) → Build APK(s)
5. Choose "Release" variant
6. APK will be in `android/app/build/outputs/apk/release/`

### Option 2: Install Java 17

1. **Download Java 17**:
   - [Eclipse Adoptium JDK 17](https://adoptium.net/temurin/releases/?version=17)
   - Or use [Oracle JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)

2. **Install Java 17**

3. **Set JAVA_HOME** (Windows):
   ```powershell
   # In PowerShell (run as Administrator):
   [System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Java\jdk-17', 'Machine')
   ```

   Or manually:
   - System Properties → Environment Variables
   - Set `JAVA_HOME` to Java 17 installation path
   - Update `Path` to include `%JAVA_HOME%\bin`

4. **Configure Gradle** (Alternative):
   Edit `android/gradle.properties` and add:
   ```properties
   org.gradle.java.home=C:\\Program Files\\Java\\jdk-17
   ```
   (Update path to your Java 17 installation)

5. **Verify**:
   ```powershell
   java -version
   # Should show: openjdk version "17.x.x"
   ```

### Option 3: Build Debug APK (For Testing)

Debug APKs don't require signing and might work with current setup:

```powershell
# From project root:
npm run build:mobile
npm run cap:sync
cd android
.\gradlew.bat assembleDebug
```

**Note**: Debug APKs use temporary signing keys and may cause install conflicts if updating over a release APK.

## 🔧 Updating Build Scripts for Windows

The package.json scripts use Unix-style paths. For Windows compatibility:

### Current Scripts (Need Windows Fix):
```json
"cap:build:android": "npm run build:mobile && cap sync android && cd android && ./gradlew assembleDebug"
```

### Windows-Compatible Alternative:

Create platform-specific scripts or use:
```json
"cap:build:android:win": "npm run build:mobile && cap sync android && cd android && .\\gradlew.bat assembleDebug"
```

## 📝 Quick Build Instructions

### Using Android Studio (Recommended):

1. Open `android` folder in Android Studio
2. Wait for Gradle sync
3. Build → Build Bundle(s) / APK(s) → Build APK(s)
4. Select "release" variant
5. APK location: `android/app/build/outputs/apk/release/app-release.apk`

### Using Command Line (After Java 17 Setup):

```powershell
# 1. Build mobile assets
npm run build:mobile

# 2. Sync to Android
npm run cap:sync

# 3. Build release APK
cd android
.\gradlew.bat assembleRelease
```

## ✅ Verification

After setting up Java 17:

```powershell
java -version
# Should show: openjdk version "17.x.x"

cd android
.\gradlew.bat --version
# Should work without errors
```

## 🔑 Important Notes

- **Release APKs** require signing - ensure `key.properties` is configured
- **Debug APKs** use temporary keys - may cause install conflicts
- **Java 17** is required by Android Gradle Plugin 8.0+
- **Android Studio** is the easiest option (bundles Java 17)

## 🚀 Next Steps

1. **Set up Java 17** (Option 2 above) OR
2. **Use Android Studio** (Option 1 above)
3. **Build release APK**
4. **Test update** on device with old version installed

---

**Status**: ⚠️ **Java 17 Required**

Choose one of the options above to proceed with building the release APK.





# Fix Gradle Cache Corruption

The build is failing due to corrupted Gradle cache files. Here's how to fix it:

## Option 1: Clean Gradle Cache in Android Studio (Recommended)

1. **Close Android Studio** (if open)

2. **Delete Gradle Cache:**
   - Open File Explorer
   - Navigate to: `C:\Users\mike\.gradle\caches\`
   - Delete the `8.9` folder (or the entire `caches` folder if you want a complete clean)
   - This will force Gradle to re-download dependencies

3. **Clean Project Build:**
   - Delete the `android/build` folder (if it exists)
   - Delete the `android/app/build` folder (if it exists)

4. **Reopen Android Studio:**
   - Open the project
   - Let Gradle sync (it will re-download dependencies)
   - This may take a few minutes

## Option 2: Use Gradle Clean Command

If you have Gradle installed, you can run:
```bash
cd android
gradle clean
```

## Option 3: Manual Cache Clean (PowerShell)

Run this in PowerShell:
```powershell
# Clean Gradle cache
Remove-Item -Path "$env:USERPROFILE\.gradle\caches" -Recurse -Force

# Clean local build folders
cd android
Remove-Item -Path "build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "app\build" -Recurse -Force -ErrorAction SilentlyContinue
```

Then reopen Android Studio and let it sync.

## After Cleaning

1. **Sync Project:** File → Sync Project with Gradle Files
2. **Wait for sync to complete** (may take 5-10 minutes first time)
3. **Build APK:** Build → Build Bundle(s) / APK(s) → Build APK(s)

The cache corruption was caused by missing metadata files in the Gradle transform cache. Cleaning the cache will force Gradle to regenerate them.


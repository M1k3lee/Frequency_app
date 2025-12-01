# Android Signing Configuration Setup

## 🔐 Current Status

The release build requires a signing configuration, but `key.properties` is not set up yet.

**Options**:
1. **Set up signing** (recommended for release builds)
2. **Build debug APK** (uses debug signing automatically)

## ✅ Option 1: Set Up Signing for Release Builds

### Step 1: Create `key.properties` file

Create a file named `key.properties` in the **project root** (same directory as `package.json`):

```properties
storeFile=../freq.jks
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=YOUR_KEY_ALIAS
keyPassword=YOUR_KEY_PASSWORD
```

**Important**: 
- Replace `YOUR_KEYSTORE_PASSWORD`, `YOUR_KEY_ALIAS`, and `YOUR_KEY_PASSWORD` with your actual values
- The `freq.jks` keystore file should be in the project root
- This file is in `.gitignore` and won't be committed to git

### Step 2: Verify Keystore File

Check that `freq.jks` exists in the project root. If you need to create a new keystore:

```bash
keytool -genkey -v -keystore freq.jks -keyalg RSA -keysize 2048 -validity 10000 -alias freq
```

### Step 3: Test the Configuration

After creating `key.properties`, sync Gradle and try building again.

## 🔧 Option 2: Build Debug APK (No Signing Needed)

If you just want to test the build without signing:

1. In Android Studio, change Build Variant to "debug"
2. Build → Build APK(s)
3. Debug APK will use automatic debug signing

**Note**: Debug APKs can't be published to Play Store or used for updates.

## ⚠️ Important Notes

### For App Updates:
- **Release APKs must use the SAME signing key** for updates to work
- If you lose the keystore file, you cannot update existing installations
- **Backup `freq.jks` securely!**

### File Locations:
- `freq.jks` → Project root (should already exist)
- `key.properties` → Project root (needs to be created)

### Security:
- `key.properties` is in `.gitignore` (not committed to git)
- `freq.jks` is in `.gitignore` (not committed to git)
- Keep these files secure and backed up!

## 📝 Template File

A template file `key.properties.example` has been created. Copy it to `key.properties` and fill in your values:

```bash
# Windows PowerShell:
Copy-Item key.properties.example key.properties

# Then edit key.properties with your actual passwords
```

## 🔄 After Setting Up

1. Create `key.properties` with your values
2. Sync Gradle in Android Studio
3. Build release APK

The build will now use your signing configuration automatically.

## 📚 Related Documentation

- `ANDROID_UPDATE_GUIDE.md` - Information about signing keys and updates
- `ANDROID_BUILD_SETUP.md` - Build setup instructions

---

**Next Step**: Create `key.properties` file with your keystore information, or build a debug APK for testing.






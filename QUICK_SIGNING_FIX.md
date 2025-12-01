# Quick Fix: Signing Configuration Error

## 🚨 Error: "SigningConfig 'release' is missing required property 'storeFile'"

This means `key.properties` file doesn't exist yet. You have two options:

## ✅ Option 1: Create key.properties (Recommended for Release)

1. **Create file**: `key.properties` in project root (same folder as `package.json`)

2. **Add this content**:
```properties
storeFile=../freq.jks
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=YOUR_KEY_ALIAS
keyPassword=YOUR_KEY_PASSWORD
```

3. **Replace**:
   - `YOUR_KEYSTORE_PASSWORD` - Password for freq.jks
   - `YOUR_KEY_ALIAS` - Key alias (usually "freq")
   - `YOUR_KEY_PASSWORD` - Key password (usually same as keystore password)

4. **If you don't know the password**: Check with whoever created the keystore, or create a new one (see below)

## ✅ Option 2: Build Debug APK (For Testing)

In Android Studio:
1. Change **Build Variant** to "debug" (bottom left panel)
2. Build → Build APK(s)
3. Uses debug signing automatically

**Note**: Debug APKs can't be published or used for updates.

## 🔧 If You Need to Create a New Keystore

```bash
keytool -genkey -v -keystore freq.jks -keyalg RSA -keysize 2048 -validity 10000 -alias freq
```

Then create `key.properties` with the password you entered.

## 📝 Template

See `key.properties.example` for a template file.

---

**Quickest Fix**: Create `key.properties` file with your keystore information.






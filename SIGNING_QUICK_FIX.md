# Quick Fix: Signing Configuration Error

## 🚨 Error: "SigningConfig 'release' is missing required property 'storeFile'"

The release build requires signing configuration, but `key.properties` is missing.

## ✅ Quick Solution

### Create `key.properties` file

1. **Create file**: `key.properties` in project root (same folder as `package.json`)

2. **Copy this template** and fill in your values:

```properties
storeFile=../freq.jks
storePassword=YOUR_KEYSTORE_PASSWORD_HERE
keyAlias=YOUR_KEY_ALIAS_HERE
keyPassword=YOUR_KEY_PASSWORD_HERE
```

3. **Replace the placeholders**:
   - `YOUR_KEYSTORE_PASSWORD_HERE` - The password for `freq.jks`
   - `YOUR_KEY_ALIAS_HERE` - Usually "freq" 
   - `YOUR_KEY_PASSWORD_HERE` - Usually same as keystore password

4. **Save the file**

5. **Sync Gradle** in Android Studio and rebuild

## 🔄 Alternative: Build Debug APK

If you just want to test without setting up signing:

1. In Android Studio, change **Build Variant** to "debug" (bottom left)
2. Build → Build APK(s)
3. Uses debug signing automatically

**Note**: Debug APKs can't be published or used for updates.

## ❓ If You Don't Have the Password

- Check if you created `freq.jks` before - you would have set the password then
- Or create a new keystore (see below)

## 🔧 Create New Keystore

If you need to create a new keystore:

```bash
keytool -genkey -v -keystore freq.jks -keyalg RSA -keysize 2048 -validity 10000 -alias freq
```

It will ask for:
- Password (remember this!)
- Your name/organization
- etc.

Then use that password in `key.properties`.

---

**Once `key.properties` is created, the build error will be resolved!**





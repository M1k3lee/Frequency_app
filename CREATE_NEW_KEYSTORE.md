# Creating a New Android Keystore

## ⚠️ Important Warning

**If you create a new keystore, existing users will NOT be able to update to the new version.** They will need to:
- Uninstall the old version first
- Install the new version as a fresh install

This is because Android requires the same signing key for all updates of the same app.

---

## ✅ Step-by-Step: Create New Keystore

### Step 1: Create the Keystore File

Open PowerShell or Command Prompt in your project root (`C:\Users\mike\Frequency`) and run:

```powershell
keytool -genkey -v -keystore freq-new.jks -keyalg RSA -keysize 2048 -validity 10000 -alias freq
```

**You'll be prompted for:**

1. **Keystore password**: Enter a password (write this down!)
   - Example: `MyApp2024!`
   
2. **Re-enter password**: Enter the same password again

3. **Your name**: Enter your name or organization name
   - Example: `Mike` or `Frequency Zen`

4. **Organizational Unit**: Press Enter (optional)
   - Or enter: `Development`

5. **Organization**: Press Enter (optional)
   - Or enter: `Frequency Zen App`

6. **City**: Press Enter (optional)
   - Or enter: `Your City`

7. **State**: Press Enter (optional)
   - Or enter: `Your State`

8. **Country code**: Enter 2-letter code (e.g., `US`, `GB`, `CA`)

9. **Confirm**: Type `yes` if everything looks correct

10. **Key password**: Press Enter to use the same password as keystore
    - Or enter a different password (not recommended)

### Step 2: Rename the Old Keystore (Backup)

Before overwriting, backup the old one:

```powershell
# Backup old keystore (in case you find the password later)
move freq.jks freq-old-backup.jks

# Rename new keystore to the standard name
move freq-new.jks freq.jks
```

### Step 3: Create key.properties File

Create a file named `key.properties` in the project root with:

```properties
storeFile=../freq.jks
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=freq
keyPassword=YOUR_KEYSTORE_PASSWORD
```

**Replace `YOUR_KEYSTORE_PASSWORD`** with the password you entered in Step 1.

**Example:**
```properties
storeFile=../freq.jks
storePassword=MyApp2024!
keyAlias=freq
keyPassword=MyApp2024!
```

---

## 🚀 Quick Commands (Copy-Paste)

### Option A: Interactive (Recommended)
```powershell
keytool -genkey -v -keystore freq-new.jks -keyalg RSA -keysize 2048 -validity 10000 -alias freq
move freq.jks freq-old-backup.jks
move freq-new.jks freq.jks
```

Then create `key.properties` manually.

### Option B: Non-Interactive (Faster, Less Secure)

**⚠️ Warning:** This exposes passwords in command history!

```powershell
keytool -genkey -v -keystore freq-new.jks -keyalg RSA -keysize 2048 -validity 10000 -alias freq -storepass "YourPassword123!" -keypass "YourPassword123!" -dname "CN=Frequency Zen, OU=Development, O=Frequency Zen App, L=City, ST=State, C=US"
move freq.jks freq-old-backup.jks
move freq-new.jks freq.jks
```

---

## 📝 Complete Example

Here's a complete example with sample values:

1. **Create keystore:**
   ```powershell
   keytool -genkey -v -keystore freq-new.jks -keyalg RSA -keysize 2048 -validity 10000 -alias freq
   ```
   - Password: `Frequency2024!Secure`
   - Name: `Frequency Zen`
   - Country: `US`
   - Use same password for key

2. **Backup and rename:**
   ```powershell
   move freq.jks freq-old-backup.jks
   move freq-new.jks freq.jks
   ```

3. **Create `key.properties`:**
   ```properties
   storeFile=../freq.jks
   storePassword=Frequency2024!Secure
   keyAlias=freq
   keyPassword=Frequency2024!Secure
   ```

---

## ✅ Verify It Works

After creating `key.properties`, try building:

```powershell
npm run cap:build:android:release
```

If it builds successfully, you're all set! 🎉

---

## 🔐 Security Tips

1. **Store passwords securely**: Use a password manager
2. **Keep backups**: Don't lose your keystore file!
3. **Don't commit**: `key.properties` and `*.jks` are in `.gitignore`
4. **Write it down**: Store keystore password somewhere safe (encrypted)

---

## 🆘 Troubleshooting

**Error: "keytool is not recognized"**
- Install Java JDK (Java 17 recommended)
- Or use Android Studio's bundled JDK: `"C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe"`

**Error: "Keystore was tampered with"**
- Make sure you're using the correct password
- Check that the file wasn't corrupted

**Error: "SigningConfig release is missing required property"**
- Check that `key.properties` exists and is in the project root
- Verify all properties are filled in correctly
- Make sure the path to `freq.jks` is correct

---

## 📚 Next Steps

Once your keystore is set up:
1. Build release APK: `npm run cap:build:android:release`
2. Test on a device
3. Upload to Google Play Console (if publishing)

---

**Need to update existing users?** You must use the same keystore as before. If you've lost it, users will need to uninstall and reinstall.


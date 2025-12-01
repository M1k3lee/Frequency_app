# How to Find Keystore Values in Android Studio

You already have a keystore file (`freq.jks`) in your project root. Here's how to find or retrieve the values you need for `key.properties`.

## Option 1: Check Android Studio's Signing Configuration (If Already Set Up)

If you previously configured signing in Android Studio, you can find the values here:

### Step 1: Open Project Structure
1. Open Android Studio
2. Open your project (navigate to the `android` folder)
3. Go to **File → Project Structure** (or press `Ctrl+Alt+Shift+S` on Windows)

### Step 2: Check Signing Configs
1. In the left sidebar, select **Modules** → **app**
2. Click on the **Signing Configs** tab
3. Look for any existing signing configurations
   - If you see a "release" config, you can see the keystore path and alias
   - **Note**: Passwords are typically hidden/masked for security

### Step 3: Check build.gradle (Manual Configuration)
1. In Android Studio, open `android/app/build.gradle`
2. Look for a `signingConfigs` block
3. If you see signing config there, it might show the keystore path

## Option 2: Check Your Notes/Password Manager

The keystore values are:
- **storeFile**: `freq.jks` (file is in your project root: `C:\Users\mike\Frequency\freq.jks`)
- **storePassword**: The password you entered when creating the keystore
- **keyAlias**: Usually `freq` or similar (the alias name you gave the key)
- **keyPassword**: Usually the same as `storePassword`, unless you set it differently

**Check if you saved these values anywhere:**
- Password manager (like LastPass, 1Password, etc.)
- Notes/documentation
- Previous project files
- Email where you might have stored them

## Option 3: List Keystore Information (If You Know the Password)

If you remember the password, you can list the keystore contents to find the alias:

### In Android Studio Terminal:
```bash
cd C:\Users\mike\Frequency
keytool -list -v -keystore freq.jks
```

This will:
- Prompt for the keystore password
- Show all aliases in the keystore (look for "Alias name" in the output)
- Help you identify which alias to use

**Example output:**
```
Keystore type: PKCS12
Keystore provider: SUN

Your keystore contains 1 entry

Alias name: freq
Creation date: ...
Entry type: PrivateKeyEntry
...
```

## Option 4: Use Android Studio's Generate Signed Bundle Wizard

If you're not sure about the values, Android Studio can help you use the keystore:

1. In Android Studio, go to **Build → Generate Signed Bundle / APK**
2. Select **APK** and click **Next**
3. Click **Choose existing...** under "Key store path"
4. Navigate to and select: `C:\Users\mike\Frequency\freq.jks`
5. Enter your keystore password
6. Select the key alias from the dropdown
7. Enter the key password

**While the wizard is open, you can see:**
- The exact path to your keystore file
- The alias name (from the dropdown)
- You'll need to enter passwords (if you don't remember them, see Option 5)

## Option 5: If You Don't Remember the Passwords

Unfortunately, **keystore passwords cannot be recovered**. They are encrypted and there's no way to retrieve them.

If you truly don't remember:
- You'll need to create a new keystore
- **⚠️ IMPORTANT**: Creating a new keystore means you cannot update existing installed apps - users will need to uninstall and reinstall
- For production apps, this is a significant issue

### To Create a New Keystore (Last Resort):

1. In Android Studio Terminal, run:
```bash
cd C:\Users\mike\Frequency
keytool -genkey -v -keystore freq.jks -keyalg RSA -keysize 2048 -validity 10000 -alias freq
```

2. Follow the prompts:
   - Enter keystore password (remember this!)
   - Re-enter password
   - Enter your name, organization, etc.
   - Enter key password (press Enter to use same as keystore password)
   - Confirm (type "yes")

3. **IMPORTANT**: Save the passwords securely this time!

## Creating the key.properties File

Once you have all the values, create `key.properties` in your project root:

```properties
# Path to your keystore file (relative to project root)
storeFile=../freq.jks

# Keystore password
storePassword=YOUR_KEYSTORE_PASSWORD_HERE

# Key alias name (usually "freq")
keyAlias=freq

# Key password (usually same as storePassword)
keyPassword=YOUR_KEY_PASSWORD_HERE
```

**File location:** `C:\Users\mike\Frequency\key.properties`

## Quick Checklist

- [ ] Keystore file location: `C:\Users\mike\Frequency\freq.jks` ✅ (file exists)
- [ ] Store password: ____________________
- [ ] Key alias: ____________________ (usually "freq")
- [ ] Key password: ____________________ (usually same as store password)

## Need Help?

If you're still stuck:
1. Try Option 3 first (list keystore info) - you might remember the password when prompted
2. Check if Android Studio has the signing config saved
3. Check your notes/password manager
4. If all else fails, you may need to create a new keystore (but this breaks app updates)

---

**Remember**: The `key.properties` file will be in `.gitignore`, so your passwords won't be committed to git. Keep the passwords safe!





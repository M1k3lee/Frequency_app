# Create New Android Keystore Script
# This script helps you create a new keystore for signing Android release builds

Write-Host "=== Android Keystore Creation ===" -ForegroundColor Cyan
Write-Host ""

# Check if keytool is available
$keytoolPath = $null
if (Get-Command keytool -ErrorAction SilentlyContinue) {
    $keytoolPath = "keytool"
} elseif (Test-Path "C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe") {
    $keytoolPath = "C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe"
} elseif (Test-Path "C:\Program Files\Android\Android Studio\jre\bin\keytool.exe") {
    $keytoolPath = "C:\Program Files\Android\Android Studio\jre\bin\keytool.exe"
} else {
    Write-Host "ERROR: keytool not found!" -ForegroundColor Red
    Write-Host "Please install Java JDK or use Android Studio's bundled JDK" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You can also run this manually:" -ForegroundColor Yellow
    Write-Host '  keytool -genkey -v -keystore freq-new.jks -keyalg RSA -keysize 2048 -validity 10000 -alias freq' -ForegroundColor Gray
    exit 1
}

Write-Host "Found keytool at: $keytoolPath" -ForegroundColor Green
Write-Host ""

# Warning about existing users
Write-Host "⚠️  WARNING: Creating a new keystore means existing users will NOT be able to update!" -ForegroundColor Yellow
Write-Host "   They will need to uninstall the old version and install the new one." -ForegroundColor Yellow
Write-Host ""
$continue = Read-Host "Continue anyway? (yes/no)"
if ($continue -ne "yes") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""

# Backup old keystore if it exists
if (Test-Path "freq.jks") {
    $backupName = "freq-old-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').jks"
    Write-Host "Backing up existing keystore to: $backupName" -ForegroundColor Yellow
    Copy-Item "freq.jks" $backupName
    Write-Host "✓ Backup created" -ForegroundColor Green
    Write-Host ""
}

# Create new keystore
$newKeystoreName = "freq-new.jks"
Write-Host "Creating new keystore..." -ForegroundColor Cyan
Write-Host "You'll be prompted to enter information. The keystore password is most important!" -ForegroundColor Yellow
Write-Host ""

& $keytoolPath -genkey -v -keystore $newKeystoreName -keyalg RSA -keysize 2048 -validity 10000 -alias freq

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Keystore created successfully!" -ForegroundColor Green
    
    # Rename to standard name
    if (Test-Path "freq.jks") {
        Remove-Item "freq.jks" -Force
    }
    Rename-Item $newKeystoreName "freq.jks"
    Write-Host "✓ Renamed to freq.jks" -ForegroundColor Green
    Write-Host ""
    
    # Prompt for password to create key.properties
    Write-Host "Now let's create the key.properties file..." -ForegroundColor Cyan
    Write-Host ""
    $storePassword = Read-Host "Enter your keystore password" -AsSecureString
    $storePasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($storePassword)
    )
    
    Write-Host ""
    $samePassword = Read-Host "Use the same password for the key? (yes/no)"
    $keyPassword = if ($samePassword -eq "yes") { $storePasswordPlain } else {
        $keyPwdSecure = Read-Host "Enter your key password" -AsSecureString
        [Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [Runtime.InteropServices.Marshal]::SecureStringToBSTR($keyPwdSecure)
        )
    }
    
    # Create key.properties
    $keyPropertiesContent = @"
storeFile=../freq.jks
storePassword=$storePasswordPlain
keyAlias=freq
keyPassword=$keyPassword
"@
    
    $keyPropertiesContent | Out-File -FilePath "key.properties" -Encoding utf8 -NoNewline
    Write-Host ""
    Write-Host "✓ Created key.properties file" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== Setup Complete! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now build a release APK:" -ForegroundColor Cyan
    Write-Host "  npm run cap:build:android:release" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Save your keystore password in a secure place!" -ForegroundColor Yellow
    Write-Host "   You'll need it for all future builds." -ForegroundColor Yellow
    
} else {
    Write-Host ""
    Write-Host "✗ Failed to create keystore" -ForegroundColor Red
    Write-Host "Try running the keytool command manually" -ForegroundColor Yellow
    exit 1
}


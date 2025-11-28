# Clean Gradle cache and build folders
Write-Host "Cleaning Gradle cache..." -ForegroundColor Yellow
Remove-Item -Path "$env:USERPROFILE\.gradle\caches\8.9" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Cleaning local build folders..." -ForegroundColor Yellow
if (Test-Path "android\build") { Remove-Item -Path "android\build" -Recurse -Force }
if (Test-Path "android\app\build") { Remove-Item -Path "android\app\build" -Recurse -Force }
if (Test-Path "android\.gradle") { Remove-Item -Path "android\.gradle" -Recurse -Force }

Write-Host "Clean complete! Now reopen Android Studio and sync." -ForegroundColor Green


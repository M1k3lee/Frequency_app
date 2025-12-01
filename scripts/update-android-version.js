#!/usr/bin/env node

/**
 * Script to update Android app version before building updates
 * Usage: node scripts/update-android-version.js [versionName] [versionCode]
 * 
 * Example:
 *   node scripts/update-android-version.js 1.2.0 3
 */

const fs = require('fs');
const path = require('path');

const buildGradlePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');

if (!fs.existsSync(buildGradlePath)) {
  console.error('❌ build.gradle not found at:', buildGradlePath);
  process.exit(1);
}

let content = fs.readFileSync(buildGradlePath, 'utf8');

// Parse current version
const versionCodeMatch = content.match(/versionCode\s+(\d+)/);
const versionNameMatch = content.match(/versionName\s+"([^"]+)"/);

const currentVersionCode = versionCodeMatch ? parseInt(versionCodeMatch[1]) : null;
const currentVersionName = versionNameMatch ? versionNameMatch[1] : null;

console.log('📱 Current Android App Version:');
console.log(`   Version Code: ${currentVersionCode}`);
console.log(`   Version Name: ${currentVersionName}`);

// Get new version from command line or auto-increment
const args = process.argv.slice(2);
let newVersionCode = currentVersionCode ? currentVersionCode + 1 : 1;
let newVersionName = null;

if (args.length > 0) {
  newVersionName = args[0];
  if (args.length > 1) {
    newVersionCode = parseInt(args[1]);
  }
} else {
  // Auto-increment patch version
  if (currentVersionName) {
    const parts = currentVersionName.split('.');
    if (parts.length === 3) {
      const patch = parseInt(parts[2]) + 1;
      newVersionName = `${parts[0]}.${parts[1]}.${patch}`;
    } else {
      newVersionName = currentVersionName;
    }
  } else {
    newVersionName = '1.0.0';
  }
}

if (!newVersionName) {
  console.error('❌ Could not determine new version name');
  process.exit(1);
}

// Update version code
content = content.replace(
  /versionCode\s+\d+/,
  `versionCode ${newVersionCode}`
);

// Update version name
content = content.replace(
  /versionName\s+"[^"]+"/,
  `versionName "${newVersionName}"`
);

// Write back
fs.writeFileSync(buildGradlePath, content, 'utf8');

console.log('\n✅ Updated Android App Version:');
console.log(`   Version Code: ${newVersionCode} (was ${currentVersionCode})`);
console.log(`   Version Name: "${newVersionName}" (was "${currentVersionName}")`);
console.log('\n📦 Next steps:');
console.log('   1. Build mobile version: npm run build:mobile');
console.log('   2. Sync to Android: npm run cap:sync');
console.log('   3. Build release APK: npm run cap:build:android:release');






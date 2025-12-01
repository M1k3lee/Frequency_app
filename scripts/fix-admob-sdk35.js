#!/usr/bin/env node

/**
 * Fix for @capacitor-community/admob plugin using VANILLA_ICE_CREAM constant
 * which doesn't exist in SDK 34. This script replaces it with numeric API 35.
 * 
 * Run this after npm install if the fix gets overwritten.
 */

const fs = require('fs');
const path = require('path');

const bannerExecutorPath = path.join(
  __dirname,
  '..',
  'node_modules',
  '@capacitor-community',
  'admob',
  'android',
  'src',
  'main',
  'java',
  'com',
  'getcapacitor',
  'community',
  'admob',
  'banner',
  'BannerExecutor.java'
);

if (!fs.existsSync(bannerExecutorPath)) {
  console.log('⚠️  BannerExecutor.java not found. AdMob plugin may not be installed.');
  process.exit(0);
}

let content = fs.readFileSync(bannerExecutorPath, 'utf8');

if (content.includes('Build.VERSION_CODES.VANILLA_ICE_CREAM')) {
  console.log('🔧 Fixing VANILLA_ICE_CREAM constant...');
  
  content = content.replace(
    /Build\.VERSION_CODES\.VANILLA_ICE_CREAM/g,
    '35'
  );
  
  // Also update the comment to be clearer
  content = content.replace(
    /\/\/ set Safe Area only for Android 15\+/,
    '// set Safe Area only for Android 15+ (API 35 - using numeric constant for SDK 34 compatibility)'
  );
  
  fs.writeFileSync(bannerExecutorPath, content, 'utf8');
  console.log('✅ Fixed BannerExecutor.java');
} else if (content.includes('>= 35')) {
  console.log('✅ Already fixed - using numeric API 35');
} else {
  console.log('⚠️  No VANILLA_ICE_CREAM found - file may have changed');
}






#!/usr/bin/env node

/**
 * Helper script to create key.properties file from template
 * This helps set up Android signing configuration
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const keyPropertiesPath = path.join(__dirname, '..', 'key.properties');
const keyPropertiesExamplePath = path.join(__dirname, '..', 'key.properties.example');
const keystorePath = path.join(__dirname, '..', 'freq.jks');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('📝 Setting up Android signing configuration\n');
  
  if (fs.existsSync(keyPropertiesPath)) {
    const overwrite = await question('key.properties already exists. Overwrite? (y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Cancelled.');
      rl.close();
      return;
    }
  }
  
  if (!fs.existsSync(keystorePath)) {
    console.log('⚠️  Warning: freq.jks not found!');
    const createNew = await question('Create a new keystore? (y/n): ');
    if (createNew.toLowerCase() === 'y') {
      console.log('\nTo create a new keystore, run:');
      console.log('keytool -genkey -v -keystore freq.jks -keyalg RSA -keysize 2048 -validity 10000 -alias freq\n');
      rl.close();
      return;
    }
  }
  
  console.log('\nPlease provide the following information:\n');
  
  const storeFile = '../freq.jks'; // Default path
  const storePassword = await question('Keystore password: ');
  const keyAlias = await question('Key alias (default: freq): ') || 'freq';
  const keyPassword = await question('Key password (usually same as keystore): ') || storePassword;
  
  const content = `storeFile=${storeFile}
storePassword=${storePassword}
keyAlias=${keyAlias}
keyPassword=${keyPassword}
`;
  
  fs.writeFileSync(keyPropertiesPath, content, 'utf8');
  console.log('\n✅ key.properties created successfully!');
  console.log('\n⚠️  Important:');
  console.log('   - Keep this file secure');
  console.log('   - It is already in .gitignore');
  console.log('   - Never commit passwords to git');
  console.log('\n📦 Next: Sync Gradle in Android Studio and build release APK\n');
  
  rl.close();
}

main().catch(console.error);






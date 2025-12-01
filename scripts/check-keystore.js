/**
 * Helper script to check keystore information
 * This will help you find the alias name if you know the password
 * 
 * Usage: node scripts/check-keystore.js
 */

const { execSync } = require('child_process');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const keystorePath = path.join(__dirname, '..', 'freq.jks');

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function checkKeystore() {
  console.log('🔍 Keystore Information Checker\n');
  console.log(`Keystore file: ${keystorePath}\n`);

  const fs = require('fs');
  if (!fs.existsSync(keystorePath)) {
    console.error(`❌ Error: Keystore file not found at: ${keystorePath}`);
    console.log('\nMake sure freq.jks exists in your project root.');
    rl.close();
    return;
  }

  console.log('✅ Keystore file found!\n');
  console.log('To list keystore information, you need to enter the keystore password.');
  console.log('This will show you the alias name and help you verify your setup.\n');

  const password = await question('Enter keystore password (or press Enter to skip): ');
  
  if (!password) {
    console.log('\n⚠️  Skipped. You can run this command manually in your terminal:');
    console.log(`\n   keytool -list -v -keystore "${keystorePath}"\n`);
    rl.close();
    return;
  }

  try {
    console.log('\n🔐 Checking keystore...\n');
    const output = execSync(
      `keytool -list -v -keystore "${keystorePath}" -storepass "${password}"`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );

    console.log(output);
    
    // Extract alias name
    const aliasMatch = output.match(/Alias name:\s*(\S+)/i);
    if (aliasMatch) {
      console.log('\n✅ Found alias:', aliasMatch[1]);
      console.log('\nYou can use this information in key.properties:');
      console.log(`\nstoreFile=../freq.jks`);
      console.log(`storePassword=${'*'.repeat(password.length)}`);
      console.log(`keyAlias=${aliasMatch[1]}`);
      console.log(`keyPassword=${'*'.repeat(password.length)}`);
    }
  } catch (error) {
    if (error.message.includes('keystore was tampered with') || 
        error.message.includes('password was incorrect')) {
      console.error('\n❌ Error: Incorrect password. Please try again.');
    } else {
      console.error('\n❌ Error checking keystore:', error.message);
    }
  }

  rl.close();
}

checkKeystore().catch(console.error);





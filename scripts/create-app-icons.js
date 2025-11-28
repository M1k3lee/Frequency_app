import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Android icon sizes for different densities
const iconSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

// Paths
const sourceImage = path.join(__dirname, '..', 'APP-Main-p.png');
const androidResPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

async function createAppIcons() {
  try {
    // Check if source image exists
    if (!fs.existsSync(sourceImage)) {
      console.error(`❌ Source image not found: ${sourceImage}`);
      process.exit(1);
    }

    console.log('🎨 Creating app icons from:', sourceImage);
    console.log('📱 Generating icons for all Android densities...\n');

    // Create icons for each density
    for (const [folder, size] of Object.entries(iconSizes)) {
      const folderPath = path.join(androidResPath, folder);
      
      // Ensure folder exists
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // Generate square icon
      const squareIconPath = path.join(folderPath, 'ic_launcher.png');
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .toFile(squareIconPath);
      console.log(`✅ Created ${folder}/ic_launcher.png (${size}x${size})`);

      // Generate round icon (same as square for now, Android will apply mask)
      const roundIconPath = path.join(folderPath, 'ic_launcher_round.png');
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .toFile(roundIconPath);
      console.log(`✅ Created ${folder}/ic_launcher_round.png (${size}x${size})`);
    }

    console.log('\n✨ All app icons created successfully!');
    console.log('📦 Icons are ready for your Android app build.');
    
  } catch (error) {
    console.error('❌ Error creating app icons:', error);
    process.exit(1);
  }
}

createAppIcons();


import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), '.output', 'public');
const destDir = path.join(process.cwd(), 'extension', 'dist');

console.log('Building extension bundle...');
console.log(`Source: ${srcDir}`);
console.log(`Destination: ${destDir}`);

try {
  // Clear destination directory
  if (fs.existsSync(destDir)) {
    console.log('Cleaning old extension build...');
    fs.rmSync(destDir, { recursive: true, force: true });
  }

  fs.mkdirSync(destDir, { recursive: true });

  // Copy files recursively
  if (fs.existsSync(srcDir)) {
    console.log('Copying static build to extension/dist...');
    fs.cpSync(srcDir, destDir, { recursive: true });
    console.log('Extension bundle built successfully!');
  } else {
    console.error('Error: Nuxt output directory not found. Please run "pnpm run generate" first.');
    process.exit(1);
  }
} catch (e) {
  console.error('Failed to copy build to extension directory:', e.message);
  process.exit(1);
}

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

const iconSvg = readFileSync(join(process.cwd(), 'public', 'icons', 'icon.svg'));

async function generateIcons() {
  const sizes = [192, 512];

  for (const size of sizes) {
    await sharp(iconSvg)
      .resize(size, size)
      .png()
      .toFile(join(process.cwd(), 'public', 'icons', `icon-${size}x${size}.png`));

    console.log(`Generated icon-${size}x${size}.png`);
  }
}

generateIcons().catch(console.error);
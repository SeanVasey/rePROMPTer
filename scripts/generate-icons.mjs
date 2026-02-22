#!/usr/bin/env node
/**
 * Generate PWA icon set from favicon.svg using sharp.
 * Run with: node scripts/generate-icons.mjs
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '..', 'public');
const svgPath = resolve(publicDir, 'favicon.svg');
const svgBuffer = readFileSync(svgPath);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generate() {
  // Standard icons
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(resolve(publicDir, `icon-${size}x${size}.png`));
    console.log(`  icon-${size}x${size}.png`);
  }

  // Maskable icons (with 10% safe-zone padding, solid background)
  for (const size of [192, 512]) {
    const padding = Math.round(size * 0.1);
    const inner = size - padding * 2;
    const bg = sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 10, g: 10, b: 12, alpha: 1 }, // #0A0A0C
      },
    }).png();

    const innerIcon = await sharp(svgBuffer).resize(inner, inner).png().toBuffer();

    await bg
      .composite([{ input: innerIcon, left: padding, top: padding }])
      .toFile(resolve(publicDir, `icon-${size}x${size}-maskable.png`));
    console.log(`  icon-${size}x${size}-maskable.png`);
  }

  // Apple touch icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(resolve(publicDir, 'apple-touch-icon.png'));
  console.log('  apple-touch-icon.png');

  console.log('Done.');
}

generate().catch((err) => {
  console.error('Icon generation failed:', err);
  process.exit(1);
});

#!/usr/bin/env node
// Generates PWA icon PNGs from the source SVG at required sizes.
// Usage: node scripts/generate-icons.mjs

import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');
const SVG_PATH = join(PUBLIC, 'favicon.svg');

const svgBuffer = readFileSync(SVG_PATH);

// Standard PWA icon sizes
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Ensure public directory exists
mkdirSync(PUBLIC, { recursive: true });

async function generateIcon(size, filename, options = {}) {
  const { padding = 0, background = { r: 0, g: 0, b: 0, alpha: 0 } } = options;
  const innerSize = Math.round(size * (1 - padding));

  let pipeline = sharp(svgBuffer).resize(innerSize, innerSize, { fit: 'contain', background });

  if (padding > 0) {
    const offset = Math.round((size - innerSize) / 2);
    pipeline = pipeline.extend({
      top: offset,
      bottom: size - innerSize - offset,
      left: offset,
      right: size - innerSize - offset,
      background,
    });
  }

  await pipeline.png().toFile(join(PUBLIC, filename));
  console.log(`  Generated ${filename} (${size}x${size})`);
}

async function main() {
  console.log('Generating PWA icons from favicon.svg...\n');

  // Standard icons (transparent background)
  for (const size of SIZES) {
    await generateIcon(size, `icon-${size}x${size}.png`);
  }

  // Maskable icons (with safe-zone padding and themed background)
  // Maskable icons need 10% padding on each side (80% safe zone)
  const maskableBg = { r: 26, g: 26, b: 30, alpha: 255 }; // #1A1A1E
  for (const size of [192, 512]) {
    await generateIcon(size, `icon-${size}x${size}-maskable.png`, {
      padding: 0.2,
      background: maskableBg,
    });
  }

  // Apple touch icon (180x180, solid background for iOS)
  await generateIcon(180, 'apple-touch-icon.png', {
    padding: 0.1,
    background: maskableBg,
  });

  console.log('\nAll icons generated successfully.');
}

main().catch((err) => {
  console.error('Icon generation failed:', err);
  process.exit(1);
});

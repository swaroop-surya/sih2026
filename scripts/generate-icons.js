import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const publicDir = path.resolve('public');
  const svgPath = path.join(publicDir, 'icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // 1. Standard 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  // 2. Standard 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  // 3. Apple Touch Icon 180x180
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // 4. Maskable 512x512 (with 15% safe margin on all sides, solid bleed background)
  const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <rect width="512" height="512" fill="#0f172a"/>
    <g transform="translate(64, 64) scale(0.75)">
      <path d="M256 72L120 132V248C120 338.4 178 421.2 256 444C334 421.2 392 338.4 392 248V132L256 72Z" fill="#1e293b" stroke="#38bdf8" stroke-width="16" stroke-linejoin="round"/>
      <path d="M256 128L156 172V254C156 322 198.8 384.6 256 402C313.2 384.6 356 322 356 254V172L256 128Z" fill="#0369a1" fill-opacity="0.25"/>
      <circle cx="256" cy="240" r="44" fill="#38bdf8"/>
      <path d="M256 196V240L286 270" stroke="#0f172a" stroke-width="12" stroke-linecap="round"/>
      <path d="M208 330C220 342 237 350 256 350C275 350 292 342 304 330" stroke="#38bdf8" stroke-width="12" stroke-linecap="round"/>
    </g>
  </svg>`;

  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');
}

generateIcons().catch(err => {
  console.error(err);
  process.exit(1);
});

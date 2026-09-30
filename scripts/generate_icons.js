import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgStandard = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#B8441F"/>
      <stop offset="50%" stop-color="#912F12"/>
      <stop offset="100%" stop-color="#5E1A08"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE8A3"/>
      <stop offset="45%" stop-color="#E5A32B"/>
      <stop offset="100%" stop-color="#A56805"/>
    </linearGradient>
    <linearGradient id="pothiGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFF8EE"/>
      <stop offset="50%" stop-color="#F5E4CE"/>
      <stop offset="100%" stop-color="#E2CDB2"/>
    </linearGradient>
    <linearGradient id="quillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF4D0"/>
      <stop offset="60%" stop-color="#F2BA49"/>
      <stop offset="100%" stop-color="#B7760A"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#2A0B03" flood-opacity="0.5"/>
    </filter>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background rounded squircle / canvas -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>

  <!-- Subtle ornate concentric borders -->
  <circle cx="256" cy="256" r="236" fill="none" stroke="url(#goldGrad)" stroke-width="3" stroke-opacity="0.35"/>
  <circle cx="256" cy="256" r="226" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-dasharray="6,6" stroke-opacity="0.45"/>

  <!-- Sunray radiance in background -->
  <g opacity="0.08" stroke="#FFE8A3" stroke-width="2">
    <line x1="256" y1="20" x2="256" y2="492"/>
    <line x1="20" y1="256" x2="492" y2="256"/>
    <line x1="89" y1="89" x2="423" y2="423"/>
    <line x1="89" y1="423" x2="423" y2="89"/>
  </g>

  <!-- Main emblem group with shadow -->
  <g filter="url(#shadow)">
    <!-- Palm leaf manuscripts (Talapatra Pothi) stacked -->
    <!-- Bottom leaf -->
    <rect x="106" y="278" width="300" height="42" rx="10" fill="#CCA882" transform="rotate(-4 256 299)"/>
    <!-- Middle leaf -->
    <rect x="106" y="268" width="300" height="42" rx="10" fill="#DDBE9C" transform="rotate(2 256 289)"/>
    <!-- Top leaf (Talapatra) -->
    <rect x="100" y="250" width="312" height="52" rx="12" fill="url(#pothiGrad)" stroke="#B38D66" stroke-width="2.5"/>
    
    <!-- Pothi string hole & cord -->
    <circle cx="150" cy="276" r="7" fill="#69220D"/>
    <circle cx="150" cy="276" r="4" fill="#FFE8A3"/>
    <line x1="150" y1="240" x2="150" y2="330" stroke="#912F12" stroke-width="3.5" stroke-linecap="round"/>
    
    <!-- Inscription lines on palm leaf -->
    <line x1="175" y1="266" x2="385" y2="266" stroke="#8C6E50" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="8,6"/>
    <line x1="175" y1="284" x2="375" y2="284" stroke="#8C6E50" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="10,7"/>

    <!-- Stylized Odia Letter 'ଓ' (O) in Golden Calligraphy -->
    <g transform="translate(196, 75) scale(0.68)" filter="url(#softGlow)">
      <!-- Classical Odia O Character path -->
      <path d="M 88 120 C 50 120 20 85 20 48 C 20 18 42 0 78 0 C 122 0 148 32 148 68 C 148 114 104 156 50 190 C 26 205 12 216 12 230 C 12 248 30 258 56 258 C 96 258 132 230 162 195 C 166 190 174 192 176 198 C 178 206 142 278 52 278 C 18 278 -6 252 -6 222 C -6 196 14 178 40 162 C 90 130 122 96 122 66 C 122 42 104 22 78 22 C 54 22 42 36 42 54 C 42 76 60 98 88 98 C 94 98 98 102 98 108 C 98 114 94 120 88 120 Z" fill="url(#goldGrad)" stroke="#FFE8A3" stroke-width="3"/>
    </g>

    <!-- Classical Golden Quill Feather Pen (ଲେଖନୀ) -->
    <g transform="translate(245, 140) rotate(34)">
      <!-- Feather vane -->
      <path d="M 0 0 C 22 -35 48 -95 38 -150 C 30 -190 12 -215 0 -228 C -12 -215 -30 -190 -38 -150 C -48 -95 -22 -35 0 0 Z" fill="url(#quillGrad)" stroke="#9C6203" stroke-width="2"/>
      <!-- Feather barb texture -->
      <path d="M 0 -210 Q 15 -180 28 -160 M 0 -180 Q 20 -150 34 -130 M 0 -150 Q 22 -120 35 -95 M 0 -110 Q 20 -80 28 -55" stroke="#FFE8A3" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
      <path d="M 0 -210 Q -15 -180 -28 -160 M 0 -180 Q -20 -150 -34 -130 M 0 -150 Q -22 -120 -35 -95 M 0 -110 Q -20 -80 -28 -55" stroke="#D89215" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
      <!-- Central shaft / rachis -->
      <line x1="0" y1="-228" x2="0" y2="40" stroke="#FFEAA5" stroke-width="4.5" stroke-linecap="round"/>
      <!-- Nib / Tip -->
      <polygon points="-4,38 4,38 0,65" fill="#FFEAA5" stroke="#9C6203" stroke-width="1.5"/>
      <line x1="0" y1="40" x2="0" y2="58" stroke="#521503" stroke-width="1.5"/>
    </g>

    <!-- Ink droplets / poetic spark -->
    <circle cx="340" cy="360" r="4.5" fill="url(#goldGrad)"/>
    <circle cx="362" cy="380" r="3" fill="url(#goldGrad)"/>
    <circle cx="380" cy="365" r="2" fill="url(#goldGrad)"/>

    <!-- Bottom Decorative Plaque -->
    <rect x="136" y="380" width="240" height="42" rx="21" fill="#4A1406" stroke="url(#goldGrad)" stroke-width="2"/>
    <text x="256" y="407" font-family="'Noto Sans Oriya', 'Kalinga', 'Nirmala UI', sans-serif" font-size="20" font-weight="bold" fill="url(#goldGrad)" text-anchor="middle" letter-spacing="1.5">ଓଡ଼ିଆ ସାହିତ୍ୟ</text>
  </g>
</svg>`;

// Maskable icon with 15% safe padding
const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#B8441F"/>
      <stop offset="50%" stop-color="#912F12"/>
      <stop offset="100%" stop-color="#5E1A08"/>
    </linearGradient>
    <linearGradient id="goldGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE8A3"/>
      <stop offset="45%" stop-color="#E5A32B"/>
      <stop offset="100%" stop-color="#A56805"/>
    </linearGradient>
    <linearGradient id="pothiGradM" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFF8EE"/>
      <stop offset="50%" stop-color="#F5E4CE"/>
      <stop offset="100%" stop-color="#E2CDB2"/>
    </linearGradient>
    <linearGradient id="quillGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF4D0"/>
      <stop offset="60%" stop-color="#F2BA49"/>
      <stop offset="100%" stop-color="#B7760A"/>
    </linearGradient>
    <filter id="shadowM" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#2A0B03" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Full-bleed background rectangle (mandatory for maskable) -->
  <rect width="512" height="512" fill="url(#bgGradM)"/>

  <!-- Scaled content centered within safe zone (80% circle) -->
  <g transform="translate(64, 64) scale(0.75)" filter="url(#shadowM)">
    <!-- Ornate circles -->
    <circle cx="256" cy="256" r="236" fill="none" stroke="url(#goldGradM)" stroke-width="3" stroke-opacity="0.4"/>
    <circle cx="256" cy="256" r="224" fill="none" stroke="url(#goldGradM)" stroke-width="1.5" stroke-dasharray="6,6" stroke-opacity="0.5"/>

    <!-- Pothi -->
    <rect x="106" y="278" width="300" height="42" rx="10" fill="#CCA882" transform="rotate(-4 256 299)"/>
    <rect x="106" y="268" width="300" height="42" rx="10" fill="#DDBE9C" transform="rotate(2 256 289)"/>
    <rect x="100" y="250" width="312" height="52" rx="12" fill="url(#pothiGradM)" stroke="#B38D66" stroke-width="2.5"/>
    
    <circle cx="150" cy="276" r="7" fill="#69220D"/>
    <circle cx="150" cy="276" r="4" fill="#FFE8A3"/>
    <line x1="150" y1="240" x2="150" y2="330" stroke="#912F12" stroke-width="3.5" stroke-linecap="round"/>
    
    <line x1="175" y1="266" x2="385" y2="266" stroke="#8C6E50" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="8,6"/>
    <line x1="175" y1="284" x2="375" y2="284" stroke="#8C6E50" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="10,7"/>

    <!-- Calligraphy 'ଓ' -->
    <g transform="translate(196, 75) scale(0.68)">
      <path d="M 88 120 C 50 120 20 85 20 48 C 20 18 42 0 78 0 C 122 0 148 32 148 68 C 148 114 104 156 50 190 C 26 205 12 216 12 230 C 12 248 30 258 56 258 C 96 258 132 230 162 195 C 166 190 174 192 176 198 C 178 206 142 278 52 278 C 18 278 -6 252 -6 222 C -6 196 14 178 40 162 C 90 130 122 96 122 66 C 122 42 104 22 78 22 C 54 22 42 36 42 54 C 42 76 60 98 88 98 C 94 98 98 102 98 108 C 98 114 94 120 88 120 Z" fill="url(#goldGradM)" stroke="#FFE8A3" stroke-width="3"/>
    </g>

    <!-- Quill -->
    <g transform="translate(245, 140) rotate(34)">
      <path d="M 0 0 C 22 -35 48 -95 38 -150 C 30 -190 12 -215 0 -228 C -12 -215 -30 -190 -38 -150 C -48 -95 -22 -35 0 0 Z" fill="url(#quillGradM)" stroke="#9C6203" stroke-width="2"/>
      <line x1="0" y1="-228" x2="0" y2="40" stroke="#FFEAA5" stroke-width="4.5" stroke-linecap="round"/>
      <polygon points="-4,38 4,38 0,65" fill="#FFEAA5" stroke="#9C6203" stroke-width="1.5"/>
    </g>

    <!-- Label -->
    <rect x="136" y="380" width="240" height="42" rx="21" fill="#4A1406" stroke="url(#goldGradM)" stroke-width="2"/>
    <text x="256" y="407" font-family="'Noto Sans Oriya', 'Kalinga', 'Nirmala UI', sans-serif" font-size="20" font-weight="bold" fill="url(#goldGradM)" text-anchor="middle" letter-spacing="1.5">ଓଡ଼ିଆ ସାହିତ୍ୟ</text>
  </g>
</svg>`;

async function generate() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  // Save SVGs
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgStandard, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'icon-maskable.svg'), svgMaskable, 'utf8');

  const standardBuffer = Buffer.from(svgStandard);
  const maskableBuffer = Buffer.from(svgMaskable);

  // Generate 512x512 standard
  await sharp(standardBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('✓ Generated pwa-512x512.png');

  // Generate 192x192 standard
  await sharp(standardBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('✓ Generated pwa-192x192.png');

  // Generate 512x512 maskable
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('✓ Generated pwa-maskable-512x512.png');

  // Generate 180x180 Apple touch icon
  await sharp(standardBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Generated apple-touch-icon.png');

  // Generate 64x64 favicon
  await sharp(standardBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('✓ Generated favicon.png');

  // Generate 32x32 favicon.ico equivalent / icon-32.png
  await sharp(standardBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('✓ Generated favicon-32x32.png');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});

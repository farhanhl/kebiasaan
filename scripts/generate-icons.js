const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const iconsDir = path.join(__dirname, "../public/icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG string with sunset lo-fi aesthetic
function createSvg(size, isMaskable = false) {
  const padding = isMaskable ? size * 0.15 : size * 0.08;
  const contentSize = size - padding * 2;
  const radius = size * 0.22;

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sunsetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FB923C" />
        <stop offset="50%" stop-color="#F43F5E" />
        <stop offset="100%" stop-color="#FACC15" />
      </linearGradient>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#292524" />
        <stop offset="100%" stop-color="#1C1917" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="${size * 0.04}" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Background -->
    ${
      isMaskable
        ? `<rect width="${size}" height="${size}" fill="#1C1917" />`
        : `<rect width="${size}" height="${size}" rx="${radius}" fill="url(#bgGrad)" />
           <rect width="${size}" height="${size}" rx="${radius}" fill="none" stroke="#44403C" stroke-width="${size * 0.015}" />`
    }

    <!-- Central Glowing Emblem -->
    <g transform="translate(${padding}, ${padding})">
      <!-- Glow halo -->
      <circle cx="${contentSize / 2}" cy="${contentSize / 2}" r="${contentSize * 0.38}" fill="url(#sunsetGrad)" filter="url(#glow)" opacity="0.4" />
      <!-- Main Sunset Orb -->
      <circle cx="${contentSize / 2}" cy="${contentSize / 2}" r="${contentSize * 0.35}" fill="url(#sunsetGrad)" />
      
      <!-- Seedling / Horizon stylized curve in dark background color -->
      <path d="M ${contentSize * 0.25} ${contentSize * 0.58} Q ${contentSize * 0.5} ${contentSize * 0.48} ${contentSize * 0.75} ${contentSize * 0.58} L ${contentSize * 0.75} ${contentSize * 0.78} Q ${contentSize * 0.5} ${contentSize * 0.78} ${contentSize * 0.25} ${contentSize * 0.78} Z" fill="#1C1917" opacity="0.9" />

      <!-- Sprout leaves -->
      <path d="M ${contentSize * 0.5} ${contentSize * 0.54} C ${contentSize * 0.42} ${contentSize * 0.44} ${contentSize * 0.38} ${contentSize * 0.36} ${contentSize * 0.44} ${contentSize * 0.30} C ${contentSize * 0.5} ${contentSize * 0.30} ${contentSize * 0.5} ${contentSize * 0.44} ${contentSize * 0.5} ${contentSize * 0.54} Z" fill="#FAFAF9" />
      <path d="M ${contentSize * 0.5} ${contentSize * 0.54} C ${contentSize * 0.58} ${contentSize * 0.44} ${contentSize * 0.62} ${contentSize * 0.36} ${contentSize * 0.56} ${contentSize * 0.30} C ${contentSize * 0.5} ${contentSize * 0.30} ${contentSize * 0.5} ${contentSize * 0.44} ${contentSize * 0.5} ${contentSize * 0.54} Z" fill="#FACC15" />
    </g>
  </svg>
  `;
}

async function generate() {
  const targets = [
    { name: "icon-192.png", size: 192, maskable: false },
    { name: "icon-512.png", size: 512, maskable: false },
    { name: "maskable-512.png", size: 512, maskable: true },
    { name: "apple-touch-icon.png", size: 180, maskable: false },
  ];

  for (const t of targets) {
    const svg = createSvg(t.size, t.maskable);
    const dest = path.join(iconsDir, t.name);
    await sharp(Buffer.from(svg)).png().toFile(dest);
    console.log(`Generated ${t.name} (${t.size}x${t.size})`);
  }
}

generate().catch(console.error);


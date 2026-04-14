import sharp from "sharp";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="80" fill="#e87f24"/>
  <text x="256" y="230" font-family="Arial Black, Arial, sans-serif" font-weight="900"
    font-size="112" text-anchor="middle" fill="white" letter-spacing="-2">FREI</text>
  <text x="256" y="348" font-family="Arial Black, Arial, sans-serif" font-weight="900"
    font-size="112" text-anchor="middle" fill="white" letter-spacing="-2">BURG</text>
  <text x="256" y="430" font-family="Arial Black, Arial, sans-serif" font-weight="700"
    font-size="56" text-anchor="middle" fill="rgba(255,255,255,0.75)" letter-spacing="4">FOOTBALL</text>
</svg>`;

const buf = Buffer.from(svg);

await sharp(buf).resize(512, 512).png().toFile("public/icon-512.png");
await sharp(buf).resize(192, 192).png().toFile("public/icon-192.png");
await sharp(buf).resize(180, 180).png().toFile("public/apple-touch-icon.png");

console.log("Icons generated!");

const sharp = require('sharp');
const logoLightPath = 'C:/Users/joyda/ZCodeProject/NainoForge/public/light.png';
const logoDarkPath = 'C:/Users/joyda/ZCodeProject/NainoForge/public/dark.png';

async function createVariant(inputPath, size, label) {
  const outPath = `C:/Users/joyda/ZCodeProject/NainoForge/packages/extension/icons/action/${size}/${size}-${label}.png`;
  await sharp(inputPath).resize(size, size, {
    fit: 'cover',
    background: label === 'light' ? { r: 255, g: 255, b: 255, alpha: 1 } : { r: 0, g: 0, b: 0, alpha: 1 }
  }).png({ quality: 90 }).toFile(outPath);
  console.log('Created:', outPath);
}

(async () => {
  const sizes = [16, 48, 128];
  for (const size of sizes) {
    await createVariant(logoLightPath, size, 'light');
    await createVariant(logoDarkPath, size, 'dark');
  }
  console.log('Done!');
})();
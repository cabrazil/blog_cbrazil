const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateFavicons() {
  const publicDir = path.join(process.cwd(), 'public');
  const sourceIcon = path.join(publicDir, 'web-app-manifest-512x512.png');

  // Verificar se a imagem fonte existe
  try {
    await fs.access(sourceIcon);
  } catch (error) {
    console.error('Arquivo fonte não encontrado:', sourceIcon);
    process.exit(1);
  }

  const sizes = {
    'favicon-16x16.png': 16,
    'favicon-32x32.png': 32,
    'apple-touch-icon.png': 180,
    'favicon.png': 64  // Favicon principal em PNG
  };

  for (const [filename, size] of Object.entries(sizes)) {
    try {
      await sharp(sourceIcon)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, filename));
      
      console.log(`✅ Gerado: ${filename}`);
    } catch (error) {
      console.error(`❌ Erro ao gerar ${filename}:`, error);
    }
  }
}

generateFavicons().catch(console.error); 
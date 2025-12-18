const sharp = require('sharp');
const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');

// --- Configuración ---
const config = {
  // Patrón para encontrar las imágenes originales
  sourcePattern: 'src/assets/images/src/**/*.{jpg,jpeg,png}',
  // Carpeta de destino para las imágenes procesadas
  outputDir: 'src/assets/images/gallery', // Procesamos dentro de src/assets/images
  // Anchos a los que se redimensionarán las imágenes para `srcset`
  widths: [400, 800],
  // Opciones de calidad para los formatos
  quality: {
    jpeg: 80,
    webp: 80,
  },
};

async function processImages() {
  console.log('🚀 Iniciando procesamiento de imágenes...');

  // Asegurarse de que el directorio de salida exista
  await fs.ensureDir(config.outputDir);

  // Encontrar todas las imágenes que coincidan con el patrón
  const files = glob.sync(config.sourcePattern);

  if (files.length === 0) {
    console.log('No se encontraron imágenes para procesar.');
    return;
  }

  // Procesar cada archivo encontrado
  for (const file of files) {
    const fileName = path.basename(file, path.extname(file));
    console.log(`- Procesando: ${fileName}`);

    const image = sharp(file);

    // Generar imágenes para cada ancho definido
    for (const width of config.widths) {
      const outputFileNameWebP = `${fileName}-${width}w.webp`;
      const outputFileNameJPEG = `${fileName}-${width}w.jpg`;

      // Convertir a WebP, redimensionar y guardar
      await image.resize(width).webp({ quality: config.quality.webp }).toFile(path.join(config.outputDir, outputFileNameWebP));

      // Convertir a JPEG, redimensionar y guardar
      await image.resize(width).jpeg({ quality: config.quality.jpeg }).toFile(path.join(config.outputDir, outputFileNameJPEG));
    }
  }

  console.log(`✅ ¡Procesamiento completado! ${files.length * config.widths.length * 2} imágenes generadas en '${config.outputDir}'.`);
}

processImages();
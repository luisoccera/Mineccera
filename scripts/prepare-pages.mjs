import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
const indexPath = path.join(distDir, 'index.html');
const notFoundPath = path.join(distDir, '404.html');

if (!existsSync(indexPath)) {
  throw new Error('No se encontro dist/index.html. Ejecuta el export web antes.');
}

const originalHtml = readFileSync(indexPath, 'utf8');

const fixedHtml = originalHtml
  .replace(/href="\/(?!\/)/g, 'href="./')
  .replace(/src="\/(?!\/)/g, 'src="./');

writeFileSync(indexPath, fixedHtml, 'utf8');
copyFileSync(indexPath, notFoundPath);

console.log('GitHub Pages listo: rutas relativas + 404.html generado.');

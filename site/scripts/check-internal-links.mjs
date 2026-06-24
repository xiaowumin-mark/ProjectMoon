import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, '..');
const distRoot = path.join(siteRoot, 'dist');

const linkPattern = /\b(?:href|src)="([^"]+)"/g;

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(fullPath, files);
    else files.push(fullPath);
  }
  return files;
}

function shouldCheck(url) {
  return (
    url.startsWith('/') &&
    !url.startsWith('//') &&
    !url.startsWith('/cdn-cgi/') &&
    !url.includes(':')
  );
}

function targetPath(url) {
  const clean = decodeURI(url.split(/[?#]/)[0]);
  if (!clean || clean === '/') return path.join(distRoot, 'index.html');
  if (clean.endsWith('/')) return path.join(distRoot, clean.slice(1), 'index.html');
  if (path.extname(clean)) return path.join(distRoot, clean.slice(1));
  return path.join(distRoot, clean.slice(1), 'index.html');
}

async function main() {
  if (!(await pathExists(distRoot))) {
    throw new Error('dist directory does not exist. Run `npm run build` first.');
  }

  const htmlFiles = (await walk(distRoot)).filter((file) => file.endsWith('.html'));
  const missing = [];

  for (const htmlFile of htmlFiles) {
    const html = await fs.readFile(htmlFile, 'utf8');
    for (const match of html.matchAll(linkPattern)) {
      const url = match[1];
      if (!shouldCheck(url)) continue;
      const target = targetPath(url);
      if (!(await pathExists(target))) {
        missing.push(`${path.relative(distRoot, htmlFile)} -> ${url}`);
      }
    }
  }

  if (missing.length > 0) {
    console.error('Missing internal targets:');
    for (const item of missing.slice(0, 50)) console.error(`- ${item}`);
    if (missing.length > 50) console.error(`...and ${missing.length - 50} more`);
    process.exitCode = 1;
    return;
  }

  console.log(`PASS: checked ${htmlFiles.length} HTML files for internal links`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

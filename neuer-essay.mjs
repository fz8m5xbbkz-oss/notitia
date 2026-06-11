#!/usr/bin/env node
/**
 * neuer-essay.mjs — notitia CLI
 *
 * Erstellt eine neue Essay-Datei in src/content/essays/. Eine Frage, fertig:
 *
 *   npm run neu
 *
 * Frontmatter braucht nur noch title + date — alles andere hat Defaults
 * (siehe src/content.config.ts). Wer lieber in Obsidian schreibt:
 * npm run publizieren (siehe publizieren.mjs).
 */

import { createInterface } from 'node:readline';
import { writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ü/g, 'ue')
    .replace(/ö/g, 'oe')
    .replace(/ä/g, 'ae')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
const frage = (text) => new Promise((resolve) => rl.question(text, resolve));

console.log('\n── notitia · neuer Essay ──────────────────────────────\n');

const titel = (await frage('Titel: ')).trim();
rl.close();

if (!titel) {
  console.log('\nKein Titel, kein Essay. Abgebrochen.\n');
  process.exit(1);
}

const slug = slugify(titel);
const datum = new Date().toISOString().split('T')[0];
const zielPfad = join(__dir, 'src/content/essays', `${slug}.md`);

if (existsSync(zielPfad)) {
  console.log(`\n⚠ Datei existiert bereits: src/content/essays/${slug}.md`);
  console.log('Nichts wurde überschrieben.\n');
  process.exit(1);
}

writeFileSync(
  zielPfad,
  `---\ntitle: "${titel.replace(/"/g, '\\"')}"\ndate: ${datum}\n---\n\n`,
  'utf-8'
);

console.log(`
── Fertig ─────────────────────────────────────────────────
Datei:    src/content/essays/${slug}.md
Vorschau: npm run dev → http://localhost:4321/essays/${slug}/
──────────────────────────────────────────────────────────
Schreib los. Veröffentlichen = committen (der Hook pusht).
`);

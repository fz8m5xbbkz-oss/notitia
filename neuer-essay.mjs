#!/usr/bin/env node
/**
 * neuer-essay.mjs — notitia CLI
 *
 * Erstellt eine neue Essay-Datei in src/content/essays/ mit korrektem
 * Frontmatter und Slug. Einfach ausführen mit:
 *
 *   node neuer-essay.mjs
 */

import { createInterface } from 'node:readline';
import { writeFileSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));

// ── Hilfsfunktionen ───────────────────────────────────────────────────────

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

function heutigesDatum() {
  const d = new Date();
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

function verfuegbareSlugs(ordner) {
  const pfad = join(__dir, 'src/content', ordner);
  if (!existsSync(pfad)) return [];
  return readdirSync(pfad)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace('.md', ''));
}

function frage(rl, text) {
  return new Promise((resolve) => rl.question(text, resolve));
}

// ── Hauptprogramm ─────────────────────────────────────────────────────────

const rl = createInterface({ input: process.stdin, output: process.stdout });

console.log('\n── notitia · neuer Essay ──────────────────────────────\n');

const felder         = verfuegbareSlugs('felder');
const themengebiete  = verfuegbareSlugs('themengebiete');
const unterthemen    = verfuegbareSlugs('unterthemen');

console.log('Verfügbare Felder:       ', felder.join(', ') || '(keine)');
console.log('Verfügbare Themengebiete:', themengebiete.join(', ') || '(keine)');
console.log('Verfügbare Unterthemen:  ', unterthemen.join(', ') || '(keine)');
console.log();

const titel         = await frage(rl, 'Titel des Essays: ');
const feldEingabe   = await frage(rl, `Feld [${felder[0] ?? 'philosophie-ethik'}]: `);
const themaEingabe  = await frage(rl, `Themengebiet [${themengebiete[0] ?? ''}]: `);
const unterEingabe  = await frage(rl, `Unterthema [${unterthemen[0] ?? ''}]: `);
const substackEingabe = await frage(rl, 'Substack-URL (leer lassen, falls noch keine): ');

rl.close();

// Slug aus Titel generieren
const slug = slugify(titel);
const datum = heutigesDatum();

const feld         = feldEingabe.trim()  || felder[0]       || '';
const themengebiet = themaEingabe.trim() || themengebiete[0] || '';
const unterthema   = unterEingabe.trim() || unterthemen[0]   || '';
const substack     = substackEingabe.trim();

// Frontmatter zusammenbauen
const substackZeile = substack ? `\nsubstack_url: "${substack}"` : '';

const inhalt = `---
title: "${titel}"
date: ${datum}
feld: ${feld}
themengebiet: ${themengebiet}
unterthema: ${unterthema}${substackZeile}
---

<!-- Essay beginnt hier -->
`;

const zielPfad = join(__dir, 'src/content/essays', `${slug}.md`);

// Prüfen ob Datei schon existiert
if (existsSync(zielPfad)) {
  console.log(`\n⚠ Datei existiert bereits: src/content/essays/${slug}.md`);
  console.log('Nichts wurde überschrieben. Bitte Titel anpassen oder Datei manuell bearbeiten.\n');
  process.exit(1);
}

writeFileSync(zielPfad, inhalt, 'utf-8');

console.log(`
── Fertig ─────────────────────────────────────────────────
Datei:   src/content/essays/${slug}.md
Titel:   ${titel}
Datum:   ${datum}
Slug:    ${slug}
──────────────────────────────────────────────────────────
Öffne die Datei und schreib los.
`);

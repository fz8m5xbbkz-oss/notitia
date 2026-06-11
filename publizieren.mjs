#!/usr/bin/env node
/**
 * publizieren.mjs — Essays aus Obsidian veröffentlichen
 *
 *   npm run publizieren
 *
 * Liest fertige Essays aus dem Obsidian-Vault (Ordner „notitia Essays"),
 * wandelt sie ins Repo-Format um, zeigt, was sich ändern würde, und
 * committet erst nach Bestätigung (der post-commit-Hook pusht, Vercel deployt).
 *
 * Konventionen im Vault:
 *   - Nur Notizen mit `status: fertig` im Frontmatter werden übernommen
 *   - Dateien mit `_` am Anfang werden ignoriert (z. B. _Anleitung.md)
 *   - Titel: Frontmatter `title:` > erste `# Überschrift` > Dateiname
 *   - Datum: Frontmatter `date:` > heute
 *   - Wikilinks [[so]] werden zu normalem Text, %%Kommentare%% entfernt
 */

import { createInterface } from 'node:readline';
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dir = dirname(fileURLToPath(import.meta.url));

const VAULT_ORDNER = join(
  process.env.HOME,
  'Library/Mobile Documents/iCloud~md~obsidian/Documents/Luis',
  '03 - Nebenprojekte/notitia Essays'
);
const ESSAY_ORDNER = join(__dir, 'src/content/essays');

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

/** Sehr einfaches Frontmatter-Parsing: nur `schluessel: wert`-Zeilen */
function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { daten: {}, body: text };
  const daten = {};
  for (const zeile of m[1].split(/\r?\n/)) {
    const km = zeile.match(/^([\w-]+):\s*(.*)$/);
    if (km) daten[km[1]] = km[2].trim().replace(/^["']|["']$/g, '');
  }
  return { daten, body: text.slice(m[0].length) };
}

/** Obsidian-Syntax in normales Markdown übersetzen */
function bereinige(body) {
  return body
    .replace(/%%[\s\S]*?%%/g, '') // Obsidian-Kommentare
    .replace(/!\[\[[^\]]+\]\]/g, '') // Einbettungen (Bilder etc.) — kommen nicht mit
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2') // [[Ziel|Text]] → Text
    .replace(/\[\[([^\]]+)\]\]/g, '$1') // [[Ziel]] → Ziel
    .trim();
}

// ── Vault lesen ───────────────────────────────────────────────────────────

if (!existsSync(VAULT_ORDNER)) {
  console.log(`\n⚠ Vault-Ordner nicht gefunden:\n  ${VAULT_ORDNER}\n`);
  process.exit(1);
}

const kandidaten = [];

for (const datei of readdirSync(VAULT_ORDNER)) {
  if (!datei.endsWith('.md') || datei.startsWith('_')) continue;

  const roh = readFileSync(join(VAULT_ORDNER, datei), 'utf-8');
  const { daten, body } = parseFrontmatter(roh);

  if (daten.status !== 'fertig') continue;

  // Titel: Frontmatter > erste H1 > Dateiname
  const h1 = body.match(/^\s*#\s+(.+)$/m);
  const titel = daten.title || h1?.[1].trim() || basename(datei, '.md');

  // Erste H1 aus dem Text nehmen — die Seite rendert den Titel selbst
  let text = bereinige(body.replace(/^\s*#\s+.+\r?\n+/, ''));
  if (!text) {
    console.log(`· „${titel}" ist noch leer — übersprungen.`);
    continue;
  }

  const slug = slugify(titel);
  const datum = daten.date || new Date().toISOString().split('T')[0];

  const frontmatter = [
    '---',
    `title: "${titel.replace(/"/g, '\\"')}"`,
    `date: ${datum}`,
    ...(daten.substack_url ? [`substack_url: "${daten.substack_url}"`] : []),
    '---',
  ].join('\n');

  const inhalt = `${frontmatter}\n\n${text}\n`;
  const zielPfad = join(ESSAY_ORDNER, `${slug}.md`);

  if (existsSync(zielPfad)) {
    if (readFileSync(zielPfad, 'utf-8') === inhalt) continue; // unverändert
    kandidaten.push({ titel, slug, inhalt, zielPfad, art: 'aktualisiert' });
  } else {
    kandidaten.push({ titel, slug, inhalt, zielPfad, art: 'neu' });
  }
}

if (kandidaten.length === 0) {
  console.log('\nNichts zu veröffentlichen — keine fertigen, geänderten Essays im Vault.');
  console.log('(Fertig = Notiz hat `status: fertig` in den Eigenschaften.)\n');
  process.exit(0);
}

// ── Zeigen, fragen, veröffentlichen ───────────────────────────────────────

console.log('\n── notitia · publizieren ──────────────────────────────\n');
for (const k of kandidaten) {
  console.log(`  ${k.art === 'neu' ? '＋ neu        ' : '↻ aktualisiert'}  ${k.titel}`);
  console.log(`                  → essays/${k.slug}/`);
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
const antwort = await new Promise((resolve) =>
  rl.question(`\nVeröffentlichen? Commit + Push + Vercel-Deploy folgen. [j/N] `, resolve)
);
rl.close();

if (antwort.trim().toLowerCase() !== 'j') {
  console.log('\nAbgebrochen — nichts wurde verändert.\n');
  process.exit(0);
}

for (const k of kandidaten) {
  writeFileSync(k.zielPfad, k.inhalt, 'utf-8');
}

const titelListe = kandidaten.map((k) => k.titel).join(', ');
const nachricht = `essay: ${titelListe}`;

execFileSync('git', ['add', ...kandidaten.map((k) => k.zielPfad)], { cwd: __dir });
execFileSync('git', ['commit', '-m', nachricht], { cwd: __dir, stdio: 'inherit' });

console.log('\n── Veröffentlicht ─────────────────────────────────────');
for (const k of kandidaten) {
  console.log(`  https://notitia-eta.vercel.app/essays/${k.slug}/`);
}
console.log('Vercel deployt in ~20 Sekunden.\n');

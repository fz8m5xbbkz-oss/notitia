#!/usr/bin/env node
/**
 * publizieren.mjs — Essays UND feste Seiten aus Obsidian veröffentlichen
 *
 *   npm run publizieren
 *
 * Liest aus dem Obsidian-Vault:
 *   - Essays   aus „notitia Essays" (nur `status: fertig`)
 *   - Seiten   aus „notitia Seiten" (Über, Lektüre, Quellen — ohne status)
 *
 * Zeigt, was sich ändern würde, und committet erst nach Bestätigung
 * (der post-commit-Hook pusht, Vercel deployt).
 *
 * Vault-Konventionen:
 *   - Essays: Dateien mit `_` am Anfang werden ignoriert; %%Kommentare%%
 *     entfernt; Titel: `title:` > erste `#` > Dateiname.
 *   - Wikilinks [[…]]: zeigt das Ziel auf einen Essay, der nach diesem Lauf
 *     existiert (im Repo oder in diesem Lauf mit status:fertig), wird ein
 *     interner Link /essays/<slug>/ daraus — sonst wie bisher reiner Text
 *     (nie ein 404-Link).
 *   - Seiten: feste Dateinamen Über.md / Lektüre.md / Quellen.md.
 *     Über = freies Markdown. Lektüre/Quellen = Listen unter Überschriften
 *     (siehe _Anleitung.md im Seiten-Ordner).
 */

import { createInterface } from 'node:readline';
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dir = dirname(fileURLToPath(import.meta.url));

const VAULT_BASIS = join(
  process.env.HOME,
  'Library/Mobile Documents/iCloud~md~obsidian/Documents/Luis',
  '06 - notitia'
);
const ESSAY_VAULT = join(VAULT_BASIS, 'notitia Essays');
const SEITEN_VAULT = join(VAULT_BASIS, 'notitia Seiten');
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

/** Wikilink-Ziel für den Map-Lookup normalisieren:
 *  Pfad-Präfix („notitia Essays/Titel") und #Anker abschneiden. */
function wikiZielName(ziel) {
  let t = ziel.split('#')[0];
  const slash = t.lastIndexOf('/');
  if (slash !== -1) t = t.slice(slash + 1);
  return t.trim();
}

const normKey = (s) => s.normalize('NFC').toLowerCase().trim();

/**
 * Obsidian-Syntax in normales Markdown übersetzen.
 * `slugMap` (normalisierter Titel/Dateiname → Essay-Slug) löst Wikilinks zu
 * internen Links auf; ohne Treffer bleibt das alte Verhalten: reiner Text.
 * Wichtig: %%-Blöcke fliegen ZUERST raus — Werkstatt-Wikilinks werden nie
 * zu Links, und die Mermaid-Extraktion passiert schon vor diesem Aufruf.
 */
function bereinige(body, slugMap = null) {
  const ersetzeWikilink = (_, ziel, alias) => {
    const name = wikiZielName(ziel);
    const text = (alias || name).trim();
    const slug = slugMap?.get(normKey(name));
    return slug ? `[${text}](/essays/${slug}/)` : text;
  };

  return body
    .replace(/%%[\s\S]*?%%/g, '') // Obsidian-Kommentare
    .replace(/!\[\[[^\]]+\]\]/g, '') // Einbettungen (Bilder etc.) — kommen nicht mit
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, ersetzeWikilink) // [[Ziel|Text]]
    .replace(/\[\[([^\]]+)\]\]/g, (m, ziel) => ersetzeWikilink(m, ziel, null)) // [[Ziel]]
    .trim();
}

/** Findet eine Datei im Ordner unabhängig von Unicode-Normalisierung/Groß-Klein */
function findeDatei(ordner, name) {
  if (!existsSync(ordner)) return null;
  const ziel = name.normalize('NFC').toLowerCase();
  for (const d of readdirSync(ordner)) {
    if (d.normalize('NFC').toLowerCase() === ziel) return join(ordner, d);
  }
  return null;
}

// ── Listen-Parser für Lektüre & Quellen ────────────────────────────────────

/** Eine Listenzeile „- Autor: Titel (Jahr) — Notiz {essay-slug}" → Objekt */
function parseEintrag(zeile) {
  let s = zeile.replace(/^\s*[-*]\s+/, '').trim();
  if (!s) return null;
  const e = {};

  // {essay-slug, …} ganz am Ende (nur Quellen)
  const mEss = s.match(/\{([^}]+)\}\s*$/);
  if (mEss) {
    e.essays = mEss[1].split(',').map((x) => x.trim()).filter(Boolean);
    s = s.slice(0, mEss.index).trim();
  }

  // Notiz nach Gedankenstrich „ — "
  const dash = s.indexOf(' — ');
  if (dash !== -1) {
    e.notiz = s.slice(dash + 3).trim();
    s = s.slice(0, dash).trim();
  }

  // Jahr in (…) am Ende — aber nicht, wenn das die schließende Klammer
  // eines Markdown-Links [Titel](url) ist (URLs enthalten immer „://")
  const mJahr = s.match(/\s*\(([^)]+)\)\s*$/);
  if (mJahr && !mJahr[1].includes('://')) {
    const j = mJahr[1].trim();
    e.jahr = /^\d+$/.test(j) ? Number(j) : j;
    s = s.slice(0, mJahr.index).trim();
  }

  // Autor vor dem ersten „: "
  const colon = s.indexOf(': ');
  let titel = s;
  if (colon !== -1) {
    e.autor = s.slice(0, colon).trim();
    titel = s.slice(colon + 2).trim();
  }

  // Markdown-Link [Titel](url)
  const mLink = titel.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (mLink) {
    e.titel = mLink[1].trim();
    e.url = mLink[2].trim();
  } else {
    e.titel = titel;
  }

  return e;
}

/** Body in { sektionsschlüssel: [einträge] } zerlegen, Überschriften per Map */
function parseSektionen(body, headingMap) {
  const map = {};
  for (const k in headingMap) map[k.normalize('NFC')] = headingMap[k];
  const result = {};
  let aktuell = null;
  for (const roh of body.split(/\r?\n/)) {
    const h = roh.match(/^#{1,6}\s+(.+?)\s*$/);
    if (h) {
      aktuell = map[h[1].trim().toLowerCase().normalize('NFC')] || null;
      if (aktuell && !result[aktuell]) result[aktuell] = [];
      continue;
    }
    if (aktuell && /^\s*[-*]\s+/.test(roh)) {
      const e = parseEintrag(roh);
      if (e) result[aktuell].push(e);
    }
  }
  return result;
}

function parseLektuere(body) {
  const r = parseSektionen(body, {
    gerade: 'aktuell',
    geplant: 'geplant',
    abgeschlossen: 'abgeschlossen',
    empfohlen: 'empfohlen',
  });
  return {
    aktuell: r.aktuell || [],
    geplant: r.geplant || [],
    abgeschlossen: r.abgeschlossen || [],
    empfohlen: r.empfohlen || [],
  };
}

function parseQuellen(body) {
  const r = parseSektionen(body, {
    'primärtexte': 'primaertext',
    'primärquellen': 'primaertext',
    'bücher': 'buch',
    'aufsätze': 'aufsatz',
    'online': 'online',
    'online-quellen': 'online',
  });
  const out = [];
  for (const [typ, arr] of Object.entries(r)) {
    for (const e of arr) out.push({ ...e, typ });
  }
  return out;
}

// ── Generatoren für die Datendateien ───────────────────────────────────────

const KOPF = (quelle) =>
  `// AUTOMATISCH GENERIERT aus Obsidian (notitia Seiten/${quelle})\n` +
  `// via \`npm run publizieren\`. Nicht von Hand bearbeiten — Änderungen hier\n` +
  `// werden beim nächsten Publizieren überschrieben.\n`;

function genLektuere(body) {
  const d = parseLektuere(body);
  const j = (a) => JSON.stringify(a, null, 2);
  return (
    KOPF('Lektüre.md') +
    `\nexport const aktuell = ${j(d.aktuell)};\n` +
    `\nexport const geplant = ${j(d.geplant)};\n` +
    `\nexport const abgeschlossen = ${j(d.abgeschlossen)};\n` +
    `\nexport const empfohlen = ${j(d.empfohlen)};\n`
  );
}

function genQuellen(body) {
  const q = parseQuellen(body);
  return (
    KOPF('Quellen.md') +
    `\nexport const quellen = ${JSON.stringify(q, null, 2)};\n` +
    `\nexport const typReihenfolge = ['primaertext', 'buch', 'aufsatz', 'online'];\n` +
    `\nexport const typLabel = {\n` +
    `  primaertext: 'Primärtexte',\n` +
    `  buch: 'Bücher',\n` +
    `  aufsatz: 'Aufsätze',\n` +
    `  online: 'Online',\n` +
    `};\n`
  );
}

/**
 * argumente.js aus den gesammelten ```mermaid-Blöcken der Essays bauen.
 * Reihenfolge: neuester Essay zuerst (wie in der Argumente-Übersicht).
 */
function genArgumente(liste) {
  const sortiert = [...liste].sort((a, b) =>
    String(b.datum).localeCompare(String(a.datum))
  );
  const karten = sortiert
    .map(
      (k) =>
        `  {\n` +
        `    slug: ${JSON.stringify(k.slug)},\n` +
        `    titel: ${JSON.stringify(k.titel)},\n` +
        `    diagramm: ${JSON.stringify('\n' + k.diagramm + '\n')},\n` +
        `  },`
    )
    .join('\n');
  return (
    '// AUTOMATISCH GENERIERT aus den ```mermaid-Blöcken der Essay-Notizen\n' +
    '// via `npm run publizieren`. Nicht von Hand bearbeiten — Änderungen hier\n' +
    '// werden beim nächsten Publizieren überschrieben.\n' +
    `\nexport const argumente = [\n${karten}\n];\n`
  );
}

// ── Slug-Map für Wikilink-Auflösung ────────────────────────────────────────
// Enthält nur Essays, die nach diesem Lauf wirklich eine Route haben:
// (a) Vault-Notizen mit status:fertig, (b) bereits publizierte Repo-Essays.
// Ideen/Entwürfe fehlen bewusst — deren Wikilinks bleiben Text, nie 404.

const slugMap = new Map();

function merkeSlug(schluessel, slug) {
  if (schluessel) slugMap.set(normKey(schluessel), slug);
}

if (existsSync(ESSAY_ORDNER)) {
  for (const datei of readdirSync(ESSAY_ORDNER)) {
    if (!datei.endsWith('.md')) continue;
    const slug = basename(datei, '.md');
    const { daten } = parseFrontmatter(readFileSync(join(ESSAY_ORDNER, datei), 'utf-8'));
    merkeSlug(slug, slug);
    merkeSlug(daten.title, slug);
  }
}

if (existsSync(ESSAY_VAULT)) {
  for (const datei of readdirSync(ESSAY_VAULT)) {
    if (!datei.endsWith('.md') || datei.startsWith('_')) continue;
    const { daten, body } = parseFrontmatter(readFileSync(join(ESSAY_VAULT, datei), 'utf-8'));
    if (daten.status !== 'fertig') continue;
    const h1 = body.match(/^\s*#\s+(.+)$/m);
    const titel = daten.title || h1?.[1].trim() || basename(datei, '.md');
    const slug = slugify(daten.slug || titel);
    merkeSlug(basename(datei, '.md'), slug); // Wikilinks zeigen auf den Dateinamen
    merkeSlug(titel, slug);
  }
}

// ── Essays sammeln ──────────────────────────────────────────────────────────

const kandidaten = []; // { art, label, ziel, inhalt, url }
const argumentListe = []; // { slug, titel, diagramm, datum } — für argumente.js

if (existsSync(ESSAY_VAULT)) {
  for (const datei of readdirSync(ESSAY_VAULT)) {
    if (!datei.endsWith('.md') || datei.startsWith('_')) continue;

    const roh = readFileSync(join(ESSAY_VAULT, datei), 'utf-8');
    const { daten, body } = parseFrontmatter(roh);
    if (daten.status !== 'fertig') continue;

    const h1 = body.match(/^\s*#\s+(.+)$/m);
    const titel = daten.title || h1?.[1].trim() || basename(datei, '.md');

    // Slug: Frontmatter `slug:` gewinnt (hält die URL stabil, auch wenn der
    // Titel anders lautet als der Dateiname), sonst aus dem Titel abgeleitet.
    const slug = slugify(daten.slug || titel);
    const datum = daten.date || new Date().toISOString().split('T')[0];

    // Argument-Diagramm: der erste ```mermaid-Block der Notiz wird zur
    // Argument-Karte und aus dem Essay-Text entfernt (samt einer davor
    // stehenden „## Argument"-Zeile, falls vorhanden).
    const mMermaid = body.match(/```mermaid\r?\n([\s\S]*?)```/);
    const diagramm = mMermaid ? mMermaid[1].trim() : null;
    if (diagramm) argumentListe.push({ slug, titel, diagramm, datum });

    let essayRoh = body;
    if (diagramm) {
      essayRoh = essayRoh
        .replace(/[ \t]*#{1,6}[ \t]*Argument[ \t]*\r?\n+/gi, '')
        .replace(/```mermaid\r?\n[\s\S]*?```\r?\n?/g, '');
    }

    const text = bereinige(essayRoh.replace(/^\s*#\s+.+\r?\n+/, ''), slugMap);
    if (!text) {
      console.log(`· „${titel}" ist noch leer — übersprungen.`);
      continue;
    }

    const frontmatter = [
      '---',
      `title: "${titel.replace(/"/g, '\\"')}"`,
      `date: ${datum}`,
      ...(daten.substack_url ? [`substack_url: "${daten.substack_url}"`] : []),
      '---',
    ].join('\n');

    const inhalt = `${frontmatter}\n\n${text}\n`;
    const ziel = join(ESSAY_ORDNER, `${slug}.md`);

    if (existsSync(ziel) && readFileSync(ziel, 'utf-8') === inhalt) continue;
    kandidaten.push({
      art: existsSync(ziel) ? 'aktualisiert' : 'neu',
      label: titel,
      ziel,
      inhalt,
      url: `https://notitia-eta.vercel.app/essays/${slug}/`,
    });
  }
}

// ── Argument-Karten aus den Essays generieren ───────────────────────────────
// Nur wenn mindestens ein fertiger Essay einen ```mermaid-Block hat — sonst
// bleibt eine evtl. noch von Hand gepflegte argumente.js unangetastet.
if (argumentListe.length > 0) {
  const zielArg = join(__dir, 'src/data/argumente.js');
  const inhaltArg = genArgumente(argumentListe);
  if (!(existsSync(zielArg) && readFileSync(zielArg, 'utf-8') === inhaltArg)) {
    kandidaten.push({
      art: existsSync(zielArg) ? 'aktualisiert' : 'neu',
      label: 'Argumente (aus Essays)',
      ziel: zielArg,
      inhalt: inhaltArg,
      url: 'https://notitia-eta.vercel.app/argumente/',
      seite: true,
      name: 'Argumente',
    });
  }
}

// ── Seiten sammeln (Über, Lektüre, Quellen) ─────────────────────────────────

const SEITEN = [
  {
    name: 'Über',
    vault: 'Über.md',
    ziel: join(__dir, 'src/inhalte/ueber.md'),
    pfad: '/ueber/',
    erzeuge: (body) => bereinige(body, slugMap) + '\n',
  },
  {
    name: 'Lektüre',
    vault: 'Lektüre.md',
    ziel: join(__dir, 'src/data/lektuere.js'),
    pfad: '/lektuere/',
    erzeuge: genLektuere,
  },
  {
    name: 'Quellen',
    vault: 'Quellen.md',
    ziel: join(__dir, 'src/data/quellen.js'),
    pfad: '/quellen/',
    erzeuge: genQuellen,
  },
];

for (const seite of SEITEN) {
  const quelle = findeDatei(SEITEN_VAULT, seite.vault);
  if (!quelle) continue;

  const { body } = parseFrontmatter(readFileSync(quelle, 'utf-8'));
  const inhalt = seite.erzeuge(body);

  if (existsSync(seite.ziel) && readFileSync(seite.ziel, 'utf-8') === inhalt) continue;
  kandidaten.push({
    art: existsSync(seite.ziel) ? 'aktualisiert' : 'neu',
    label: `Seite: ${seite.name}`,
    ziel: seite.ziel,
    inhalt,
    url: `https://notitia-eta.vercel.app${seite.pfad}`,
    seite: true,
    name: seite.name,
  });
}

// ── Nichts zu tun? ──────────────────────────────────────────────────────────

if (kandidaten.length === 0) {
  console.log('\nNichts zu veröffentlichen — keine fertigen, geänderten Essays');
  console.log('und keine geänderten Seiten im Vault.\n');
  process.exit(0);
}

// ── Zeigen, fragen, veröffentlichen ────────────────────────────────────────

console.log('\n── notitia · publizieren ──────────────────────────────\n');
for (const k of kandidaten) {
  const marke = k.art === 'neu' ? '＋ neu        ' : '↻ aktualisiert';
  console.log(`  ${marke}  ${k.label}`);
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
  writeFileSync(k.ziel, k.inhalt, 'utf-8');
}

const essays = kandidaten.filter((k) => !k.seite).map((k) => k.label);
const seiten = kandidaten.filter((k) => k.seite).map((k) => k.name);
const teile = [];
if (essays.length) teile.push(`essay: ${essays.join(', ')}`);
if (seiten.length) teile.push(`seiten: ${seiten.join(', ')}`);
const nachricht = teile.join(' · ');

execFileSync('git', ['add', ...kandidaten.map((k) => k.ziel)], { cwd: __dir });
execFileSync('git', ['commit', '-m', nachricht], { cwd: __dir, stdio: 'inherit' });

console.log('\n── Veröffentlicht ─────────────────────────────────────');
for (const k of kandidaten) {
  console.log(`  ${k.url}`);
}
console.log('Vercel deployt in ~20 Sekunden.\n');

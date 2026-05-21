# notitia — Projekt-Kontext für Claude

Diese Datei ist die Übergabe-Akte: Wenn Claude Code im Projekt-Ordner gestartet wird,
liest er sie automatisch und ist sofort auf Stand. Bitte vor jeder substantiellen
Änderung kurz reinschauen.

---

## Wer und was

- **Autor:** Luis Frenzel
- **Projektname:** **notitia** (lateinisch: Kenntnis, Notiz, Aktenkenntnis)
- **Positionierung:** „Philosophie aus dem Inneren der Verwaltung — ein öffentliches
  Denktagebuch."
- **Kontext:** Luis beginnt im September 2026 ein Studium der Allgemeinen Verwaltung
  an der Landesdirektion Sachsen. Die Seite ist sein Versuch, Philosophie und
  Verwaltungspraxis zusammenzudenken.
- **Produkt:** Ein monatlicher Essay. **Substack ist der primäre Kanal**,
  notitia das öffentliche Archiv.

## Adressen / Konten

| | |
|---|---|
| **Live-URL** | https://luis-notitia.netlify.app |
| **GitHub-Repo** | https://github.com/fz8m5xbbkz-oss/denkfeld *(Name noch nicht umbenannt)* |
| **Substack** | https://luisfzl.substack.com |
| **Bluesky** | https://bsky.app/profile/luis-57.bsky.social |
| **Kontakt-Mail** | denkfeld@outlook.de |
| **Git-Identität** | `Luis` / `denkfeld@outlook.de` |

## Tech-Stack

- **Astro 6.2** mit Content Collections, deployt als Static Site
- **Markdown** als primäres Schreibformat
- **GitHub** als Code-Hosting + Single Source of Truth
- **Netlify** für Build und Hosting (Free-Plan; Credit-Limits beachten — wir hatten
  schon einmal das Phänomen, dass nach vielen Pushes Builds nicht mehr automatisch
  liefen)
- **Keine Datenbank, kein CMS, keine Tracker, keine Cookie-Banner, kein
  Newsletter-Popup**
- **Eingebaute Integrationen:** `@astrojs/sitemap`, `rss-parser` (für Substack-Feed)

## Verzeichnis-Struktur (wichtigste Stellen)

```
src/
├── pages/
│   ├── index.astro              Startseite (Manifest + CTAs)
│   ├── ueber.astro              Über-Seite mit Manifest + Kolophon
│   ├── essays/
│   │   ├── index.astro          Liste, mischt lokale Essays + Substack-RSS
│   │   └── [slug].astro         Dynamisches Routing pro Essay
│   └── _felder/                 DEAKTIVIERT (Unterstrich-Prefix). Routen
│                                 existieren nicht mehr, Dateien liegen erhalten
│                                 für eventuelle Reaktivierung
├── content/
│   ├── essays/*.md              Essays (Frontmatter: title, date, feld,
│   │                             themengebiet, unterthema, optional substack_url)
│   ├── felder/*.md              5 Felder (Frontmatter: title, optional position)
│   ├── themengebiete/*.md       Themengebiete (Frontmatter: title, feld,
│   │                             optional position) + Erklärungstext im Body
│   └── unterthemen/*.md         Unterthemen (Frontmatter: title, feld,
│                                 themengebiet, optional position)
├── inhalte/start.md             Manifest-Text der Startseite (kein Page, sondern
│                                 in index.astro per Import eingebunden)
├── components/
│   ├── Header.astro             Wordmark + Nav (Essays, Über)
│   └── Footer.astro             Copyright + Buttons (Newsletter, Bluesky)
├── layouts/Basis.astro          HTML-Hülle inkl. Meta, OpenGraph, Sitemap-Konfig
├── lib/
│   ├── substack.ts              RSS-Fetch + Normalisierung
│   ├── bluesky.ts               Public-API-Fetch (aktuell NICHT mehr genutzt,
│   │                             aber im Repo erhalten für späteren Use Case)
│   └── taxonomie.ts             Hilfsmodul: lädt Felder/Themengebiete/
│                                 Unterthemen aus Collections, baut Struktur
└── styles/global.css            Tokens (Farben, Schriften), Reset, Basis-Typografie

public/
├── fonts/                       Selbst gehostete Schrift Source Serif 4 (variable),
│                                 plus Magazin-Reste (EB Garamond, Cormorant Garamond,
│                                 Bebas Neue, JetBrains Mono) — letztere derzeit
│                                 NICHT eingebunden, können gelöscht werden
└── robots.txt                   Verweist auf Sitemap

netlify.toml                     Build-Konfig (command, publish, NODE_VERSION 22)
astro.config.mjs                 site-URL + Sitemap-Integration
```

## Konventionen (wichtig, da Luis JSON-Müll zweimal verursacht hat)

### Slugs

- **Immer lowercase, Bindestriche, keine Umlaute** (`ü→ue`, `ö→oe`, `ä→ae`, `ß→ss`)
- **Dateiname = Slug.** Beispiel: `einfuehrung-in-philosophisches-denken.md`
- **Slug einer Entität nicht mehr ändern, sobald angelegt** — Slug-Wechsel kaskadiert
  durch alle Essay-Referenzen

### Frontmatter

- **Immer drei Striche oben UND unten** (`---`), sonst greift kein Schema
- **Schema-Pflichtfelder beachten** (siehe Verzeichnis-Struktur oben), Tippfehler
  bricht den Build

### Veröffentlichungs-Workflow

1. Edit lokal oder im GitHub-Web-Editor
2. `git add -A && git commit -m "..." && git push`
3. Netlify deployed in ~30 Sek
4. Sitemap und alle Routen aktualisieren sich automatisch

## Arbeitsweise (Luis' Präferenzen)

- **Erst erklären, dann bauen.** Vor jeder Datei-Erstellung oder jedem Befehl in
  einem Satz sagen, was passiert und warum.
- **Kleine Schritte.** Lieber fünf kleine Commits, in denen Luis folgen kann, als
  ein riesiges Setup-Skript.
- **Kein Magie-Boilerplate.** Konfigurationsdateien knapp erklären, nicht
  referenzweise.
- **Bei Unsicherheit fragen.** Lieber Rückfrage als Annahme.
- **Keine vorzeitige Optimierung.** Keine Plugins/Frameworks, die wir nicht
  brauchen.
- **Sprache:** Deutsch in Antworten an Luis und in allen Inhalten.

## Was du **NICHT** tun sollst

- Keine `npm install` von Paketen außerhalb des Astro-Standards ohne Rückfrage.
- Keine fertigen Themes oder Templates aus dem Internet ziehen.
- Kein automatisches Deployment einrichten, das Luis nicht ausdrücklich will.
- Keine Karteikarten-Sektion bauen — das macht Luis später selbst.
- Luis nicht überreden, doch noch ein CMS oder eine Datenbank dranzuhängen.
  Decap CMS wurde diskutiert und nicht eingebaut — bewusste Entscheidung.
- **Keine Stockbilder.** Bilder werden, falls nötig, von Wikimedia Commons mit
  CC-Lizenz und korrekter Attribution geholt — oder Luis liefert sie selbst.
- **Kein automatischer Bluesky-Feed mehr auf der Startseite.** War schon mal drin,
  wurde bewusst entfernt bei der Restrukturierung Mai 2026.
- **Kein Newsletter-Formular im Footer.** Nur zwei dezente Buttons: „Newsletter"
  (verlinkt auf Substack) und „Bluesky".
- **Kein Magazin-Editorial-Layout.** Wurde einmal komplett aufgebaut (mit
  Tabakrot, Cormorant Garamond, Hero-Bildern, Drop Caps) und nach Luis' Feedback
  („zu viel, keine Struktur") komplett zurückgerollt. **Nicht nochmal versuchen,
  außer Luis fragt explizit.**

## Design (eingespielt, nicht ohne Rücksprache ändern)

- **Schrift:** Source Serif 4 (variable, selbst gehostet) für Lesetext, System-Sans
  (`var(--schrift-ui)` = `-apple-system, ...`) für UI/Meta
- **Hintergrund:** warmes Papierbeige `#EDE6D7` mit dezenter SVG-Papierkörnung
- **Tinte:** `#1a1a1a`
- **Akzent:** gedecktes Olivgrün `#5b6b3e`
- **Spaltenbreite:** schmal, 38rem (`--max-breite`)
- **Wordmark:** klein und aufrecht, ohne kursive Spielereien
- Keine Hero-Bilder, keine bunten Cards, keine großen Display-Schriften

## Stand der Dinge (Mai 2026)

### Live und gut

- 4 Routen gebaut: `/`, `/essays`, `/essays/willkommen`, `/ueber`
- Substack-RSS wird beim Build in `/essays` einsortiert (Mix aus lokalen Essays
  und Substack-Posts, sortiert nach Datum)
- Sitemap, robots.txt, OG-Tags, Search Console verifiziert (für die Vorgänger-URL
  `luis-magnolia.netlify.app` — siehe „Offen")
- Drei Themengebiete in „Philosophie & Ethik" — bisher ohne aktive Routen, da
  `/felder` deaktiviert

### Offen

- **Search Console**: neue Property `https://luis-notitia.netlify.app` muss
  angelegt und mit dem Verification-Tag (`UzhefoeozfShCbWZqVo5oWkuAWSCY5Msd4gjdooc1r4`
  in `src/layouts/Basis.astro`) verifiziert werden. Sitemap dort einreichen.
  Alte `luis-magnolia`-Property in Search Console löschen.
- **GitHub-Repo-Rename**: Repo heißt noch `denkfeld`. Über GitHub-Settings auf
  `notitia` umbenennbar; danach lokal `git remote set-url origin ...` setzen.
- **Lokaler Ordner Windows**: heißt noch `magnolia/`, sollte umbenannt werden
  auf `notitia/`. (Auf Mac wird beim Clone schon der richtige Name verwendet.)
- **Word/Bluesky-Banner-Dateien im Repo**: `bluesky_banner_magnolia.svg`,
  `magnolia_bluesky_banner.png`, `git add.docx` liegen im Repo-Root, sind
  versehentlich getrackt. Können entfernt werden, gehören eigentlich nicht hier
  rein.

### Verlauf der Namensgebung (zur Orientierung)

1. **denkfeld** (initial): „Selbstgesteuertes Lernen in fünf Feldern"
2. **magnolia** (zwischenphase): Name ohne klare inhaltliche Bindung
3. **quaestio** (Mai 2026): Latein für „Frage" — passend zur Philosophie
4. **notitia** (final): Latein für „Kenntnis, Notiz, Aktenkenntnis" — passend
   zur Doppelpositionierung Philosophie/Verwaltung

## Wenn du nach Anweisung auf Luis schreibst

Du sprichst Luis konsistent mit „du" an. Du erklärst nicht alles, was du tust,
sondern das, was er beim nächsten Mal selbst tun können soll. Du flaggst Risiken
und konfliktreiche Stellen (Briefing-Verstöße, Build-Schadenspotential), bevor
du handelst. Du machst keine Witze auf seine Kosten.

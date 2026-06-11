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
| **Live-URL** | https://notitia-eta.vercel.app |
| **GitHub-Repo** | https://github.com/fz8m5xbbkz-oss/notitia |
| **Substack** | https://luisfzl.substack.com |
| **Bluesky** | https://bsky.app/profile/luis-57.bsky.social |
| **Kontakt-Mail** | denkfeld@outlook.de |
| **Git-Identität** | `Luis` / `denkfeld@outlook.de` |

## Tech-Stack

- **Astro 6.2** mit Content Collections, deployt als Static Site
- **Markdown** als primäres Schreibformat
- **GitHub** als Code-Hosting + Single Source of Truth
- **Vercel** für Build und Hosting (Free-Plan; deployt automatisch bei jedem Push auf `main`)
- **Keine Datenbank, kein CMS, keine Tracker, keine Cookie-Banner, kein
  Newsletter-Popup**
- **Eingebaute Integrationen:** `@astrojs/sitemap`, `@astrojs/rss`, `marked`
- **Substack-Feed:** fetch-basiert (kein rss-parser — Cloudflare-Kompatibilität)
- **Auto-Push:** SSH-Key eingerichtet, post-commit-Hook pusht automatisch

## Verzeichnis-Struktur (wichtigste Stellen)

```
src/
├── pages/
│   ├── index.astro              Startseite (Manifest + CTAs)
│   ├── ueber.astro              Über-Seite mit Manifest + Kolophon
│   ├── lektuere.astro           Lektüreliste (Gerade / Empfohlen)
│   ├── quellen.astro            Quellenverzeichnis
│   ├── rss.xml.ts               RSS-Feed (Volltext, fetch-basiert)
│   └── essays/
│       ├── index.astro          Liste, mischt lokale Essays + Substack-RSS
│       └── [slug].astro         Dynamisches Routing pro Essay (leserModus=true)
├── content/
│   ├── essays/*.md              Essays (Frontmatter: title, date, feld,
│   │                             themengebiet, unterthema, optional substack_url)
│   └── felder/*.md              Philosophie-Felder (nur noch philosophie-ethik aktiv)
├── data/
│   ├── lektuere.js              Bücherliste (aktuell / empfohlen)
│   └── quellen.js               Quellenverzeichnis
├── inhalte/start.md             Manifest-Text der Startseite
├── components/
│   ├── Header.astro             Wordmark + Nav (Essays, Lektüre, Quellen, Über)
│   └── Footer.astro             Copyright + Buttons (Newsletter, Bluesky)
├── layouts/Basis.astro          HTML-Hülle inkl. Meta, OpenGraph, leserModus-Prop
├── lib/
│   └── substack.ts              RSS-Fetch via fetch() — KEIN rss-parser
└── styles/global.css            Tokens, Reset, Reader-Mode-CSS

public/
└── fonts/                       Source Serif 4 (variable, Roman + Italic)

neuer-essay.mjs                  CLI-Tool: node neuer-essay.mjs → neue Essay-Datei
THESIS.md                        Thiel-Direktive: ein Satz, was notitia glaubt
AUDIENCE.md                      Godin-Direktive: für wen / für wen nicht
astro.config.mjs                 site-URL + trailingSlash: always + Sitemap
```

## Konventionen

### Slugs

- **Immer lowercase, Bindestriche, keine Umlaute** (`ü→ue`, `ö→oe`, `ä→ae`, `ß→ss`)
- **Dateiname = Slug.** Beispiel: `einfuehrung-in-philosophisches-denken.md`
- **Slug einer Entität nicht mehr ändern, sobald angelegt** — Slug-Wechsel kaskadiert
  durch alle Essay-Referenzen

### Frontmatter

- **Immer drei Striche oben UND unten** (`---`), sonst greift kein Schema
- **Schema-Pflichtfelder:** `title`, `date`, `feld`, `themengebiet`, `unterthema`
- Tippfehler bricht den Build

### Veröffentlichungs-Workflow

1. Edit lokal oder im GitHub-Web-Editor
2. `git add ... && git commit -m "..."` — post-commit-Hook pusht automatisch
3. Vercel deployt in ~20 Sek
4. Sitemap und alle Routen aktualisieren sich automatisch

Neuen Essay anlegen: `node neuer-essay.mjs`

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
- **Kein automatischer Bluesky-Feed auf der Startseite.** War drin, bewusst entfernt.
- **Kein Newsletter-Formular im Footer.** Nur zwei Buttons: „Newsletter" + „Bluesky".
- **Kein Magazin-Editorial-Layout.** Einmal gebaut, nach Luis-Feedback zurückgerollt.
  Nicht nochmal versuchen, außer Luis fragt explizit.
- **Kein rss-parser.** Durch fetch-basierte Implementierung ersetzt —
  rss-parser ist inkompatibel mit Cloudflare Workers / Edge-Runtimes.

## Design (eingespielt, nicht ohne Rücksprache ändern)

- **Schrift:** Source Serif 4 (variable, selbst gehostet) für Lesetext, System-Sans
  (`var(--schrift-ui)` = `-apple-system, ...`) für UI/Meta
- **Hintergrund:** warmes Papierbeige `#EDE6D7` mit dezenter SVG-Papierkörnung
- **Tinte:** `#1a1a1a`
- **Akzent:** gedecktes Olivgrün `#5b6b3e`
- **Spaltenbreite:** schmal, 38rem (`--max-breite`)
- **Wordmark:** klein und aufrecht, ohne kursive Spielereien
- Keine Hero-Bilder, keine bunten Cards, keine großen Display-Schriften
- **Reader Mode:** auf mobilen Geräten (≤640px) Header/Footer ausgeblendet,
  `← Essays`-Link direkt im Artikel
- **Dark Mode:** „dunkles Papier" (`#211d17`/`#e6dfd0`, Akzent aufgehellt `#93a565`),
  Toggle im Header, System-Präferenz als Default, Wahl in `localStorage` (`farbschema`)
- **Bewegung:** ein Keyframe (`einblenden`), Artikel-Fade-in + gestaffelte Essay-Liste,
  globaler `prefers-reduced-motion`-Schutz in `global.css` — kein Bounce, keine Scroll-Reveals

## Stand der Dinge (Mai 2026)

### Live und gut

- 6 Routen: `/`, `/essays`, `/essays/willkommen`, `/lektuere`, `/quellen`, `/ueber`
- `/rss.xml` — Volltext-Feed, fetch-basiert
- Substack-RSS wird beim Build in `/essays` einsortiert
- Sitemap, robots.txt, OG-Tags aktiv
- SSH-Key + post-commit-Hook: jeder Commit pusht automatisch
- THESIS.md + AUDIENCE.md im Repo

### Offen

- **THESIS.md**: den einen Satz schreiben (was notitia glaubt, das sonst niemand glaubt)
- **Search Console**: neue Property für `notitia-eta.vercel.app` anlegen,
  Verification-Tag (`UzhefoeozfShCbWZqVo5oWkuAWSCY5Msd4gjdooc1r4`) ist bereits
  in `src/layouts/Basis.astro` hinterlegt
- **Altdateien im Repo-Root**: `bluesky_banner_magnolia.svg`, `magnolia_bluesky_banner.png`,
  `git add.docx` — noch nicht entfernt

### Verlauf der Namensgebung (zur Orientierung)

1. **denkfeld** (initial): „Selbstgesteuertes Lernen in fünf Feldern"
2. **magnolia** (zwischenphase): Name ohne klare inhaltliche Bindung
3. **quaestio** (Mai 2026): Latein für „Frage"
4. **notitia** (final): Latein für „Kenntnis, Notiz, Aktenkenntnis"

## Wenn du nach Anweisung auf Luis schreibst

Du sprichst Luis konsistent mit „du" an. Du erklärst nicht alles, was du tust,
sondern das, was er beim nächsten Mal selbst tun können soll. Du flaggst Risiken
und konfliktreiche Stellen (Briefing-Verstöße, Build-Schadenspotential), bevor
du handelst. Du machst keine Witze auf seine Kosten.

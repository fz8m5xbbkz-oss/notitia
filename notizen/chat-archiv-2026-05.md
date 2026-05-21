# Chat-Archiv — Aufbau von notitia (Mai 2026)

Diese Datei ist kein Pflicht-Inhalt für die Website, sondern ein
chronologisches Protokoll der wichtigsten Entscheidungen und Schritte aus
der Aufbau-Phase. Liegt im Repo, wird *nicht* auf der Live-Seite gerendert
(weil außerhalb von `src/pages/`). Bei Bedarf zur Erinnerung lesbar.

---

## Phase 1 — Setup (Anfang Mai)

- Astro **minimal-Starter** in Ordner `denkfeld/`, `--typescript relaxed`
- Git-Repo lokal initialisiert (manuell die Identität gesetzt: `Luis` /
  `denkfeld@outlook.de`, global)
- Erste Erkundung der Astro-Struktur: `src/pages/`, `astro.config.mjs`,
  `package.json`. Bewusst nichts Magisches drangehängt.

## Phase 2 — Layout und Typografie

- `src/styles/global.css` mit Tokens (Farben, Schriften, Linien)
- `src/layouts/Basis.astro` als HTML-Hülle (Header + `<slot />` + Footer)
- `Header.astro` mit „denkfeld"-Wordmark und Nav (Essays, Felder, Über)
- `Footer.astro` mit Copyright und Kolophon-Link
- Cremeweißer Hintergrund, Olivgrün als Akzent, System-Serife zunächst
- **Schriftwahl Source Serif 4**: manuell heruntergeladen von Adobes
  GitHub-Repo (Variable Font, Roman + Italic), selbst gehostet in
  `public/fonts/` — bewusst kein Google-Fonts-Tracking

## Phase 3 — Inhalts-Architektur

- Content Collections angelegt: `essays`, `lerneinheiten`, `materialien`
  mit Zod-Schemas
- `src/data/felder.json` als Taxonomie-Datei (5 Felder × Themengebiete ×
  Unterthemen)
- Beispiel-Essay `willkommen.md` mit Frontmatter
- Übersicht `/essays` und dynamische Detail-Seite `/essays/[slug]`
- Felder-Übersicht `/felder` mit Verlinkung zu pro-Feld-Detail-Seiten
- Über-Seite mit Kolophon-Block

## Phase 4 — Substack und Bluesky

- **`rss-parser`** installiert (nach Rückfrage genehmigt)
- `src/lib/substack.ts`: fetcht `luisfzl.substack.com/feed` zur Build-Zeit
- `src/lib/bluesky.ts`: ruft die öffentliche Bluesky-API für
  `luis-57.bsky.social` ab, filtert Reposts raus
- Auf `/essays` wurden Substack-Artikel und lokale Essays gemischt,
  chronologisch sortiert
- Auf der Startseite ein Block „Aus dem Notizbuch" mit den letzten
  drei Bluesky-Posts

## Phase 5 — Themengebiete- und Unterthemen-Seiten

- Erklärungstext-System: pro Themengebiet und Unterthema eine optionale
  Markdown-Datei mit Body als Erklärung
- Neue Routen `/felder/[feld]/[themengebiet]` und
  `/felder/[feld]/[themengebiet]/[unterthema]`
- Brotkrumen-Navigation zwischen den Ebenen
- Slug-Konvention etabliert: lowercase, Bindestriche, keine Umlaute,
  Dateiname = Slug

## Phase 6 — Magazin-Mockup-Versuch und Rückbau

- Luis lieferte ein selbst gestaltetes HTML-Mockup mit Magazin-Editorial-
  Stil (vier Schriften, drei Akzentfarben, Hero-Bilder, Pull Quote,
  Drop Caps, Felder-Raster mit Fortschritts-Prozenten)
- Vier Open-Source-Schriften heruntergeladen (Cormorant Garamond,
  EB Garamond, Bebas Neue, JetBrains Mono)
- Komplette Startseite + Header + Footer umgebaut, Bilder von Wikimedia
  Commons eingebaut (Bourdain, Sheen) für Beispiel-Essays
- **Luis' Feedback: „gar nicht. Zu unübersichtlich. Bilder zu groß.
  Keine Struktur."**
- **Voller Rollback** auf den ruhigen Vorzustand mit zwei behaltenen
  Mockup-Elementen: warmes Papierbeige `#EDE6D7` statt Cremeweiß, und
  „denk*feld*"-Wordmark mit kursivem Akzent
- Bilder, Beispielessays, Magazin-Schriften wurden aus dem Code entfernt;
  die Schriften liegen weiterhin in `public/fonts/`, aber ungebraucht

## Phase 7 — Deployment

- `netlify.toml` mit Build-Konfig, GitHub-Repo angelegt
- Erstmals nach GitHub gepusht, Netlify mit GitHub verbunden
- Initial-URL: `denkfeld.netlify.app` (Netlify hat den Namen automatisch
  gewählt)

## Phase 8 — SEO-Grundlagen

- `@astrojs/sitemap` installiert, automatische Sitemap-Generierung
- `public/robots.txt`, Verweis auf Sitemap
- Im `Basis.astro` ergänzt: `<meta name="description">`, OpenGraph-Tags,
  Twitter-Card-Tags, Canonical-Link
- Google Search Console: Property eingerichtet, Verification per HTML-Tag
- Sitemap eingereicht

## Phase 9 — Namensänderungen (Iteration)

- **denkfeld → magnolia**: vollständige Umbenennung (Header-Wordmark,
  Meta-Tags, package.json, Über-Seite, etc.)
- Netlify-Subdomain umbenannt — `magnolia` war jedoch bereits vergeben,
  Netlify gab `luis-magnolia.netlify.app`
- Code-Site-URL und robots.txt angepasst
- Search Console: neue Property für `luis-magnolia.netlify.app`
  verifiziert, Sitemap neu eingereicht

## Phase 10 — Inhalt erweitern (Luis selbst)

- Luis fügt im GitHub-Web-Editor neue Themengebiete hinzu (Erkenntnistheorie,
  Metaphysik, Ethik), läuft in JSON-Syntax-Fehler, rollt Ethik wieder zurück
- Schreibt einen erweiterten Erklärungstext für „Einführung in
  philosophisches Denken" mit Sokrates und dem Advocatus Diaboli
- Tippfehler-Säuberung in seinem Text

## Phase 11 — Migration JSON → Markdown-Collections

- `src/data/felder.json` komplett entfernt
- 5 Felder-Markdown-Dateien angelegt unter `src/content/felder/`
- Themengebiete- und Unterthemen-Schemas um `position`-Feld erweitert
- Helper-Modul `src/lib/taxonomie.ts` erzeugt die alte JSON-Struktur
  dynamisch aus den Collections
- Alle Seiten, die früher `felder.json` lasen, umgestellt
- Konsequenz: Neues Themengebiet anlegen = einzelne Datei anlegen, kein
  JSON mehr

## Phase 12 — Restrukturierung „Philosophie aus der Verwaltung"

- **Neue Positionierung:** Luis startet im September 2026 ein
  Verwaltungsstudium. Die Seite wird zum Versuch, Philosophie und
  Verwaltungspraxis zusammenzudenken.
- Kernsatz: „Philosophie aus dem Inneren der Verwaltung. Jeden Monat ein
  Essay über das, was ich im System erlebe — und was die großen Denker
  dazu gesagt hätten."
- Substack wird **primärer Kanal**, notitia das Archiv
- Navigation reduziert: Essays + Über (Felder raus)
- `/felder`-Routen deaktiviert (Ordner zu `_felder` umbenannt, Dateien
  erhalten)
- Bluesky-Notizbuch von der Startseite entfernt
- Zwei CTAs auf Startseite: „Essays lesen →" + „Newsletter abonnieren →"
- Über-Seite komplett neu geschrieben (Manifest + Studium + monatlicher
  Essay)
- Meta-Description angepasst auf neue Positionierung
- Footer: Knopf „Substack" → „Newsletter" (klarer für Neubesucher)

## Phase 13 — Erneute Namensänderung

- **magnolia → quaestio → notitia** (Luis änderte zweimal die Meinung)
- Code-Replacements überall via `sed`
- Netlify-Subdomain auf `luis-notitia.netlify.app` umgestellt
- Astro-Site-URL und robots.txt angepasst
- Search Console + GitHub-Repo-Rename + lokaler Ordnername: noch offen

## Phase 14 — Übergabe auf Mac

- `CLAUDE.md` angelegt mit Projekt-Kontext für Cross-Machine-Continuity
- Diese Archiv-Datei als chronologische Referenz
- Anleitung für Mac-Setup (Node + Git + Clone + npm install + dev)

---

## Bewährte Heuristiken aus dem Verlauf

- **Beim ersten Mal klein bauen, beim zweiten Mal schön.** Der
  Magazin-Mockup-Versuch war eine Großbaustelle ohne Validierung — beim
  nächsten Stildurchgang lieber einen Schritt pro Iteration.
- **Slug-Konventionen früh festziehen.** Spätere Slug-Umbenennungen
  kaskadieren durch Essay-Referenzen.
- **Build lokal testen vor jedem Push.** `npm run build`, 2 Sekunden,
  spart Netlify-Credits und Frust.
- **Bei JSON-Editierung: lieber im Web-Editor**, der zeigt Syntax-Fehler
  farblich. Oder, wie jetzt, gar kein JSON mehr.
- **Im Zweifel: Git macht alles rückgängig.** Vor heroischen Aktionen
  einen Commit setzen — der „letzter Stand vor dem Müll"-Anker.

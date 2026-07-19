# annotanda

Philosophie aus dem Inneren der Verwaltung.
Ein wöchentliches Essay-Journal von Luis — gehostet auf [www.annotanda.com](https://www.annotanda.com).

## Stack

- **Framework:** [Astro](https://astro.build) — Static Site Generator
- **Hosting:** Vercel (deployt automatisch bei jedem Push auf `main`)
- **Schrift:** Source Serif 4 (selbst gehostet, SIL OFL)
- **Analytics:** — (bewusst keine)

## Lokale Entwicklung

```sh
npm install
npm run dev          # http://localhost:4321
npm run build        # dist/ erzeugen
npm run preview      # dist/ lokal prüfen
npm run neu          # leere Essay-Datei anlegen (fragt nur den Titel)
npm run publizieren  # Essays & Seiten aus Obsidian veröffentlichen
```

## Struktur

```
src/
├── content/
│   ├── essays/        # Alle Essays (Markdown)
│   └── felder/        # Philosophie-Felder (Metadaten)
├── data/
│   ├── argumente.js   # Argument-Karten (Mermaid-Diagramme)
│   ├── lektuere.js    # Lektüreliste (generiert aus Obsidian)
│   └── quellen.js     # Quellenverzeichnis (generiert aus Obsidian)
├── inhalte/
│   ├── start.md       # Manifest der Startseite
│   └── ueber.md       # Über-Seite (generiert aus Obsidian)
├── layouts/
│   └── Basis.astro    # Haupt-Layout (leserModus-Prop für Reader Mode)
├── pages/
│   ├── index.astro
│   ├── rss.xml.ts     # RSS-Feed (Volltext)
│   ├── essays/
│   └── argumente/
└── styles/
    └── global.css
```

## Prinzipien

Siehe `THESIS.md` und `AUDIENCE.md`.

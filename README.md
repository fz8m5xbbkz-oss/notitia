# notitia

Philosophie aus dem Inneren der Verwaltung.
Ein monatliches Essay-Journal von Luis — gehostet auf [luis-notitia.netlify.app](https://luis-notitia.netlify.app).

## Stack

- **Framework:** [Astro](https://astro.build) — Static Site Generator
- **Hosting:** Netlify (CD via Git-Push auf `main`)
- **Schrift:** Source Serif 4 (selbst gehostet, SIL OFL)
- **Analytics:** — (bewusst keine)

## Lokale Entwicklung

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # dist/ erzeugen
npm run preview   # dist/ lokal prüfen
```

## Struktur

```
src/
├── content/
│   ├── essays/        # Alle Essays (Markdown)
│   └── felder/        # Taxonomie-Felder (Metadaten)
├── layouts/
│   └── Basis.astro    # Haupt-Layout (leserModus-Prop für Reader Mode)
├── pages/
│   ├── index.astro
│   ├── ueber.astro
│   ├── rss.xml.ts     # RSS-Feed (Volltext)
│   └── essays/
└── styles/
    └── global.css
```

## Prinzipien

Siehe `THESIS.md` und `AUDIENCE.md`.
Architektur-Entscheidungen: `docs/decisions/`.

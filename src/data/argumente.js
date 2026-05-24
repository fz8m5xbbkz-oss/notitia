/**
 * Argument-Karten — notitia
 *
 * Pro Essay ein Eintrag. Das Feld `diagramm` enthält Mermaid-Syntax
 * (https://mermaid.js.org/syntax/flowchart.html).
 *
 * Konventionen:
 *   - Knoten-IDs: kurz, keine Leerzeichen (z. B. T, A1, P1)
 *   - T = These (Hauptaussage des Essays)
 *   - A1, A2 … = Argumente / Schritte
 *   - P1, P2 … = Prämissen / Belege
 *   - E1, E2 … = Einwände (gestrichelt dargestellt)
 *   - Pfeile: --> für Stützung, -.-> für Einwand
 */

export const argumente = [
  {
    slug: 'willkommen',
    titel: 'Warum dieses notitia',
    diagramm: `
flowchart TD
  T["These: Philosophie und Verwaltung\nbedingen sich gegenseitig"]

  A1["Es gibt zwei Arten zu lernen:\nwas sich gut anfühlt\nund was tatsächlich verändert"]
  A2["Verwaltung ist kein Gegensatz\nzur Philosophie —\nsie ist ihr Prüfstein"]
  A3["Die Irritation ist der Anfang\ndes Denkens"]

  P1["Aristoteles: Praxis\nformt den Charakter"]
  P2["Studium Allgemeine Verwaltung\nab September 2026"]
  P3["Kant lesen und\nBescheide schreiben\nist kein Widerspruch"]

  T --> A1
  T --> A2
  T --> A3
  A1 --> P1
  A2 --> P2
  A3 --> P3
`,
  },
];

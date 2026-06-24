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
    slug: 'synoikismos-in-rhodos',
    titel: 'Synoikismos in Rhodos',
    diagramm: `
flowchart TD
  T["These: Mehr Einheit kann zum Verlust\nder Sache selbst führen — die Frage ist\nnicht ob, sondern wo fusioniert wird"]

  A1["Rhodos, 408 v. Chr.: Ialysos, Kamiros\nund Lindos verschmelzen freiwillig\nzu einer Polis (Synoikismos)"]
  A2["Aristoteles: Die Polis ist ihrem Wesen\nnach Vielheit, nicht Einheit"]
  A3["Moderner Spiegel — Sachsen 2008:\naus 22 Landkreisen werden 10"]

  P1["Platon: die Stadt soll Einheit sein —\nein Leib, ein Wille, ein Gefühl"]
  P2["Zu viel Einheit: aus der Stadt wird\nein Haushalt, dann ein Einzelner —\ndie Stadt verliert sich selbst"]
  P3["Richtige Größe = Spannungsverhältnis:\ngroß genug für Autarkie,\nklein genug für Kenntnis"]
  P4["Gleiche Begründung wie in Rhodos:\ngrößere Einheit sei leistungsfähiger"]
  P5["Folge: die Verwaltung rückt weg vom\nBürger, die Bürgernähe geht verloren"]

  E1["Einwand: Rhodos gelang dennoch —\ndie gute Lage machte es reich und mächtig"]

  S["Schluss: Die Verwaltung muss den Ausgleich\nvon Autarkie und Kenntnis wahren —\nerst dann bleibt beides erhalten"]

  T --> A1
  T --> A2
  T --> A3
  A2 --> P1
  P1 --> P2
  P2 --> P3
  A3 --> P4
  P4 --> P5
  A1 -.-> E1
  P3 --> S
  P5 --> S
  E1 -.-> S
`,
  },
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

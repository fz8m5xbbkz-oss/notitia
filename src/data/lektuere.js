/**
 * Lektüreliste — notitia
 *
 * Zwei Listen:
 *
 *   aktuell    — was du gerade liest (hält die Seite lebendig)
 *   empfohlen  — Bücher, die du uneingeschränkt weiterempfiehlst
 *
 * Felder pro Eintrag:
 *   autor      — z. B. 'Aristoteles' oder 'Arendt, Hannah'
 *   titel      — vollständiger Titel
 *   jahr       — Erscheinungsjahr (optional)
 *   notiz      — kurzer Satz, warum das Buch hier steht (optional)
 *   url        — Link z. B. zu Open Library oder Verlag (optional)
 */

export const aktuell = [
  {
    autor: 'Aristoteles',
    titel: 'Nikomachische Ethik',
    jahr: 'ca. 350 v. Chr.',
    notiz: 'Grundlage für den ersten Essay — Eudaimonia als Maßstab guten Lebens.',
  },
  {
    autor: 'Spaemann, Robert',
    titel: 'Glück und Wohlwollen',
    jahr: 1989,
    notiz: 'Spaemann liest Aristoteles gegen den Zeitgeist.',
  },
];

export const empfohlen = [
  {
    autor: 'Arendt, Hannah',
    titel: 'Vita activa oder Vom tätigen Leben',
    jahr: 1958,
    notiz: 'Denkt Handeln, Herstellen und Arbeiten neu — unvermeidlich für jemanden, der in einer Behörde denkt.',
  },
  {
    autor: 'Weber, Max',
    titel: 'Wirtschaft und Gesellschaft',
    jahr: 1922,
    notiz: 'Das Standardwerk zur Bürokratietheorie. Schwer, aber keine Abkürzung.',
  },
];

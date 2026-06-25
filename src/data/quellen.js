/**
 * Quellenverzeichnis — notitia
 *
 * Pflege diese Datei direkt: neue Einträge einfach unten anhängen oder
 * in die passende Kategorie einfügen. Felder:
 *
 *   autor      — Nachname, Vorname (oder leer lassen bei Sammelwerken)
 *   titel      — vollständiger Titel
 *   untertitel — (optional)
 *   jahr       — Erscheinungsjahr
 *   typ        — 'buch' | 'aufsatz' | 'online' | 'primaertext'
 *   verlag     — (optional)
 *   url        — (optional, für Online-Quellen)
 *   notiz      — (optional, kurze Einordnung für den Leser)
 *   essays     — (optional) Array mit Slugs der Essays, in denen die Quelle vorkommt
 */

// Noch leer. Neue Quelle als Objekt anhängen, z. B.:
//   {
//     autor: 'Aristoteles',
//     titel: 'Politik',
//     jahr: 'ca. 330 v. Chr.',
//     typ: 'primaertext',                 // 'primaertext' | 'buch' | 'aufsatz' | 'online'
//     notiz: 'Buch II zur Einheit der Polis (1261a)',
//     essays: ['synoikismos-in-rhodos'],  // verlinkt die Quelle mit dem Essay
//   },
// Solange die Liste leer ist, zeigt die Quellen-Seite einen kurzen Hinweis.
export const quellen = [];

/**
 * Reihenfolge der Typen in der Darstellung
 */
export const typReihenfolge = ['primaertext', 'buch', 'aufsatz', 'online'];

export const typLabel = {
  primaertext: 'Primärtexte',
  buch: 'Bücher',
  aufsatz: 'Aufsätze',
  online: 'Online',
};

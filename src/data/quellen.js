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

export const quellen = [

  // ── Primärtexte ──────────────────────────────────────────────────────────
  {
    autor: 'Aristoteles',
    titel: 'Nikomachische Ethik',
    jahr: 'ca. 350 v. Chr.',
    typ: 'primaertext',
    notiz: 'Zitiert nach der Übersetzung von Ursula Wolf (Rowohlt, 2006)',
    essays: ['willkommen'],
  },
  {
    autor: 'Aristoteles',
    titel: 'Politik',
    jahr: 'ca. 330 v. Chr.',
    typ: 'primaertext',
    notiz: 'Buch II zur Einheit und Vielheit der Polis (1261a), Buch VII zur richtigen Größe der Polis (1326a–b)',
    essays: ['synoikismos-in-rhodos'],
  },
  {
    autor: 'Diodor',
    titel: 'Historische Bibliothek',
    jahr: 'ca. 30 v. Chr.',
    typ: 'primaertext',
    notiz: 'Buch 13,75 — der Synoikismos von Rhodos (408/407 v. Chr.)',
    essays: ['synoikismos-in-rhodos'],
  },

  // ── Sekundärliteratur ─────────────────────────────────────────────────────
  {
    autor: 'Wolf, Ursula',
    titel: 'Aristoteles\' "Nikomachische Ethik"',
    jahr: 2002,
    typ: 'buch',
    verlag: 'Wissenschaftliche Buchgesellschaft',
  },
  {
    autor: 'Spaemann, Robert',
    titel: 'Glück und Wohlwollen',
    untertitel: 'Versuch über Ethik',
    jahr: 1989,
    typ: 'buch',
    verlag: 'Klett-Cotta',
  },

  // ── Online-Quellen ────────────────────────────────────────────────────────
  // {
  //   autor: '',
  //   titel: '',
  //   jahr: ,
  //   typ: 'online',
  //   url: '',
  // },

];

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

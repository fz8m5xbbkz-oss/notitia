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

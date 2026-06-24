/**
 * Lektüreliste — notitia
 *
 * Vier Listen (jede Sektion blendet sich aus, solange sie leer ist):
 *
 *   aktuell       — was du gerade liest (hält die Seite lebendig)
 *   geplant       — was als Nächstes auf dem Stapel liegt
 *   abgeschlossen — bereits gelesen, das Archiv
 *   empfohlen     — Bücher, die du uneingeschränkt weiterempfiehlst
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
    autor: 'Gysi, Gregor',
    titel: 'Ein Leben ist zu wenig. Die Autobiographie',
    jahr: 2017,
  },
  {
    autor: 'Nagel, Thomas',
    titel: 'Was bedeutet das alles? Eine ganz kurze Einführung in die Philosophie',
    jahr: 1987,
  },
];

// Was als Nächstes auf dem Stapel liegt.
export const geplant = [];

// Bereits gelesen — das Archiv.
export const abgeschlossen = [];

// Noch leer — hier stehen nur Bücher, die du selbst gelesen hast und
// uneingeschränkt weiterempfiehlst.
export const empfohlen = [];

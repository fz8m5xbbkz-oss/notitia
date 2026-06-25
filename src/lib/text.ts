/**
 * Kleine Text-Helfer für Essays — geteilt von Startseite, Essay-Liste und
 * Essay-Seite, damit Lesezeit und Auszug überall gleich berechnet werden.
 */

/** Lesezeit in Minuten: 200 Wörter/Minute, aufgerundet, mindestens 1. */
export function lesezeit(body: string | undefined): number {
  const woerter = (body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(woerter / 200));
}

/**
 * Kurzer Auszug aus Markdown-Fließtext: Überschriften, Links und
 * Markdown-Zeichen entfernt, auf `max` Zeichen an einer Wortgrenze gekürzt.
 */
export function auszug(body: string | undefined, max = 180): string {
  const text = (body ?? '')
    .replace(/^#.*$/gm, '') // Überschriften
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links → nur der Text
    .replace(/[*_>`#]/g, '') // verbliebene Markdown-Zeichen
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + ' …';
}

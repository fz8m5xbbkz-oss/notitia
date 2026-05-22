// Fetch-basiert — kein rss-parser, kompatibel mit Cloudflare Workers / Edge
const FEED_URL = 'https://luisfzl.substack.com/feed';

export type SubstackEintrag = {
  title: string;
  datum: Date;
  url: string;
  beschreibung: string;
};

function parseCDATA(str: string): string {
  const m = str.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return m ? m[1].trim() : str.trim();
}

function getTag(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m ? parseCDATA(m[1]) : '';
}

function getItems(xml: string): string[] {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((m) => m[0]);
}

export async function ladeSubstackFeed(): Promise<SubstackEintrag[]> {
  try {
    const res = await fetch(FEED_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    return getItems(xml)
      .map((item) => ({
        title: getTag(item, 'title') || '(ohne Titel)',
        datum: new Date(getTag(item, 'pubDate')),
        url: getTag(item, 'link') || getTag(item, 'guid'),
        beschreibung: getTag(item, 'description'),
      }))
      .filter((e) => e.title && e.url);
  } catch (fehler) {
    console.warn('[substack] Feed konnte nicht geladen werden:', fehler);
    return [];
  }
}

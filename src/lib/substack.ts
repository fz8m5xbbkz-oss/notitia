import Parser from 'rss-parser';

export type SubstackEintrag = {
  title: string;
  datum: Date;
  url: string;
  beschreibung: string;
};

const FEED_URL = 'https://luisfzl.substack.com/feed';
const parser = new Parser();

export async function ladeSubstackFeed(): Promise<SubstackEintrag[]> {
  try {
    const feed = await parser.parseURL(FEED_URL);
    return (feed.items ?? []).map((item) => ({
      title: item.title ?? '(ohne Titel)',
      datum: item.pubDate ? new Date(item.pubDate) : new Date(0),
      url: item.link ?? '#',
      beschreibung: item.contentSnippet ?? '',
    }));
  } catch (fehler) {
    console.warn('[substack] Feed konnte nicht geladen werden:', fehler);
    return [];
  }
}

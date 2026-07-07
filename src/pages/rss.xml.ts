// RSS-Feed — Volltext, permissionless (Naval #6)
// Warum: Wer den Feed abonniert, ist unabhängig von Algorithmen.
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { marked } from 'marked';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const essays = await getCollection('essays');
  const sortiert = essays.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: 'notitia',
    description: 'Philosophie aus dem Inneren der Verwaltung. Jeden Sonntag ein Essay.',
    site: context.site!,
    customData: '<language>de</language>',
    items: await Promise.all(
      sortiert.map(async (essay) => ({
        title: essay.data.title,
        pubDate: essay.data.date,
        link: `/essays/${essay.id}/`,
        content: await marked.parse(essay.body ?? ''),
      }))
    ),
  });
}

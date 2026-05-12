import { getCollection } from 'astro:content';

export type UnterthemaEintrag = {
  slug: string;
  name: string;
};

export type ThemengebietEintrag = {
  slug: string;
  name: string;
  unterthemen: UnterthemaEintrag[];
};

export type FeldEintrag = {
  slug: string;
  name: string;
  themengebiete: ThemengebietEintrag[];
};

function sortiere<T extends { data: { position?: number; title: string } }>(
  a: T,
  b: T
): number {
  const posA = a.data.position ?? 999;
  const posB = b.data.position ?? 999;
  if (posA !== posB) return posA - posB;
  return a.data.title.localeCompare(b.data.title);
}

export async function ladeFelder(): Promise<FeldEintrag[]> {
  const [felder, themengebiete, unterthemen] = await Promise.all([
    getCollection('felder'),
    getCollection('themengebiete'),
    getCollection('unterthemen'),
  ]);

  return felder.sort(sortiere).map((feld) => ({
    slug: feld.id,
    name: feld.data.title,
    themengebiete: themengebiete
      .filter((tg) => tg.data.feld === feld.id)
      .sort(sortiere)
      .map((tg) => ({
        slug: tg.id,
        name: tg.data.title,
        unterthemen: unterthemen
          .filter(
            (ut) => ut.data.feld === feld.id && ut.data.themengebiet === tg.id
          )
          .sort(sortiere)
          .map((ut) => ({
            slug: ut.id,
            name: ut.data.title,
          })),
      })),
  }));
}

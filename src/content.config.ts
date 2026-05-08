import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const essays = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/essays' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    feld: z.string(),
    themengebiet: z.string(),
    unterthema: z.string(),
    substack_url: z.string().url().optional(),
  }),
});

const lerneinheiten = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lerneinheiten' }),
  schema: z.object({
    feld: z.string(),
    themengebiet: z.string(),
    unterthema: z.string(),
    date: z.coerce.date(),
    material: z.string(),
    reflexion: z.string(),
  }),
});

const materialien = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/materialien' }),
  schema: z.object({
    typ: z.enum(['Buch', 'Artikel', 'Podcast', 'Video']),
    title: z.string(),
    autor: z.string(),
    quelle_url: z.string().url().optional(),
    notiz: z.string().optional(),
  }),
});

const themengebiete = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/themengebiete' }),
  schema: z.object({
    title: z.string(),
    feld: z.string(),
  }),
});

const unterthemen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/unterthemen' }),
  schema: z.object({
    title: z.string(),
    feld: z.string(),
    themengebiet: z.string(),
  }),
});

export const collections = { essays, lerneinheiten, materialien, themengebiete, unterthemen };

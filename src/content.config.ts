import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const essays = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/essays' }),
  schema: z.object({
    // Pflicht ist nur, was die Seite wirklich braucht: Titel und Datum.
    title: z.string(),
    date: z.coerce.date(),
    feld: z.string().default('philosophie-ethik'),
    themengebiet: z.string().optional(),
    unterthema: z.string().optional(),
    substack_url: z.string().url().optional(),
  }),
});

const felder = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/felder' }),
  schema: z.object({
    title: z.string(),
    position: z.number().optional(),
  }),
});

export const collections = { essays, felder };

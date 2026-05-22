// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://notitia-eta.vercel.app',
  trailingSlash: 'always',
  integrations: [sitemap()],
});

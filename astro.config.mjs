import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sculptcues.com',
  integrations: [sitemap()],
  build: { format: 'directory' },
});

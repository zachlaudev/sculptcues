import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.sculptcues.com',
  integrations: [sitemap()],
  build: { format: 'directory' },
});

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

// lastmod for blog posts from front matter (updatedDate ?? pubDate); other pages get build time.
function postDates() {
  const dir = './src/content/blog';
  const map = {};
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    const get = (k) => (src.match(new RegExp(`^${k}:\\s*["']?([0-9-]{10})`, 'm')) || [])[1];
    const d = get('updatedDate') || get('pubDate');
    if (d) map[`/blog/${f.replace(/\.md$/, '')}/`] = new Date(d).toISOString();
  }
  return map;
}
const dates = postDates();
export default defineConfig({
  site: 'https://www.sculptcues.com',
  integrations: [sitemap({
    filter: (page) => !page.includes('/404'),
    serialize(item) {
      const p = new URL(item.url).pathname;
      const key = p.endsWith('/') ? p : `${p}/`;
      item.lastmod = dates[key] ?? dates[p] ?? new Date().toISOString();
      return item;
    },
  })],
  build: { format: 'directory' },
});

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FEATURES_ENABLED } from './src/lib/featuresFlag.js';

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
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !/\/(f|reset|app)\/?$/.test(new URL(page).pathname) && (FEATURES_ENABLED || !page.includes('/features')),
      serialize(item) {
        const p = new URL(item.url).pathname;
        const key = p.endsWith('/') ? p : `${p}/`;
        item.lastmod = dates[key] ?? dates[p] ?? new Date().toISOString();
        return item;
      },
    }),
    {
      name: 'features-visibility',
      hooks: {
        'astro:build:done': ({ dir }) => {
          if (FEATURES_ENABLED) return;
          const root = fileURLToPath(dir);
          fs.rmSync(path.join(root, 'features'), { recursive: true, force: true });
          const llmsPath = path.join(root, 'llms.txt');
          if (fs.existsSync(llmsPath)) {
            const lines = fs.readFileSync(llmsPath, 'utf8').split('\n').filter((line) => !line.includes('/features/'));
            fs.writeFileSync(llmsPath, lines.join('\n'));
          }
          const redirectsPath = path.join(root, '_redirects');
          const rules = ['/features / 302', '/features/ / 302', '/features/index.html / 302', ''].join('\n');
          const existing = fs.existsSync(redirectsPath) ? fs.readFileSync(redirectsPath, 'utf8') : '';
          if (!existing.includes('/features ')) fs.appendFileSync(redirectsPath, `${existing.endsWith('\n') || existing === '' ? '' : '\n'}${rules}`);
        },
      },
    },
  ],
  build: { format: 'directory' },
});

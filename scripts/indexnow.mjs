#!/usr/bin/env node
// Tell IndexNow about changed www.sculptcues.com URLs.
// The key is public (it is the file public/<key>.txt). There is no API secret.
//
// Usage:
//   node scripts/indexnow.mjs --sitemap
//   node scripts/indexnow.mjs --since <git-sha>
//   node scripts/indexnow.mjs https://www.sculptcues.com/blog/example/
//   node scripts/indexnow.mjs --dry-run --sitemap
//
// Run this after Cloudflare Pages has published. The GitHub Action waits, then
// submits. If it races the deploy, re-run the "IndexNow" workflow.

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOST = 'www.sculptcues.com';
const ORIGIN = `https://${HOST}`;

function readKey() {
  const pub = path.join(root, 'public');
  for (const name of fs.readdirSync(pub)) {
    if (!/^[a-f0-9]{8,128}\.txt$/i.test(name)) continue;
    const key = name.slice(0, -4);
    const body = fs.readFileSync(path.join(pub, name), 'utf8').trim();
    if (body === key) return key;
  }
  throw new Error('No IndexNow key file in public/. Expected public/<key>.txt containing the key.');
}

function featuresEnabled() {
  const src = fs.readFileSync(path.join(root, 'src/lib/featuresFlag.js'), 'utf8');
  return /export const FEATURES_ENABLED = true/.test(src);
}

const SKIP = new Set(['/app/', '/f/', '/reset/', '/404/', '/features/']);

function pageFromFile(file) {
  if (file === 'src/pages/index.astro') return '/';
  if (file === 'src/pages/llms.txt.ts') return '/llms.txt';
  if (file === 'src/pages/llms-full.txt.ts') return '/llms-full.txt';
  if (file === 'src/pages/rss.xml.ts') return '/rss.xml';
  const post = file.match(/^src\/content\/blog\/([a-z0-9-]+)\.md$/);
  if (post) return `/blog/${post[1]}/`;
  if (file === 'src/pages/blog/index.astro' || file === 'src/pages/blog/[...slug].astro') return '/blog/';
  const page = file.match(/^src\/pages\/([a-z0-9-]+)\.astro$/);
  if (page) return `/${page[1]}/`;
  return null;
}

function isBroad(file) {
  return (
    file.startsWith('src/layouts/') ||
    file.startsWith('src/components/') ||
    file.startsWith('src/styles/') ||
    file.startsWith('src/data/') ||
    file.startsWith('src/lib/') ||
    file === 'src/site.ts' ||
    file === 'astro.config.mjs' ||
    file === 'public/robots.txt'
  );
}

function changedUrls(since) {
  if (!since || /^0+$/.test(since)) return null;
  let diff = '';
  try {
    diff = execSync(`git diff --name-only ${since} HEAD`, { cwd: root, encoding: 'utf8' });
  } catch {
    return null;
  }
  const files = diff.split('\n').map((line) => line.trim()).filter(Boolean);
  if (files.length === 0 || files.some(isBroad)) return null;
  const urls = new Set();
  let unknown = false;
  for (const file of files) {
    if (file.startsWith('src/content/blog/') && file.endsWith('.md')) {
      const url = pageFromFile(file);
      if (url) urls.add(url);
      continue;
    }
    if (
      file.startsWith('src/pages/') ||
      file === 'public/robots.txt' ||
      file.startsWith('public/') && file.endsWith('.txt') && file.includes('be0d')
    ) {
      const url = pageFromFile(file);
      if (url) urls.add(url);
      else if (file.startsWith('src/pages/')) unknown = true;
      continue;
    }
    if (file.startsWith('src/') || file.startsWith('public/')) unknown = true;
  }
  if (unknown) return null;
  return [...urls].filter(keep);
}

function keep(pathname) {
  if (SKIP.has(pathname)) return false;
  if (pathname === '/features/' && !featuresEnabled()) return false;
  return true;
}

async function locs(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not read ${url} (${res.status})`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((match) =>
    match[1].replaceAll('&amp;', '&'),
  );
}

async function sitemapUrls() {
  const found = new Set();
  const pending = [`${ORIGIN}/sitemap-index.xml`];
  const seen = new Set();
  while (pending.length) {
    const url = pending.pop();
    if (seen.has(url)) continue;
    seen.add(url);
    for (const loc of await locs(url)) {
      if (loc.endsWith('.xml')) pending.push(loc);
      else found.add(loc);
    }
  }
  return [...found];
}

async function main() {
  const args = process.argv.slice(2).filter((arg) => arg !== '--dry-run');
  const dry = process.argv.includes('--dry-run');
  const key = readKey();
  let urls;
  if (args[0] === '--since') {
    const changed = changedUrls(args[1]);
    urls = changed ?? (await sitemapUrls());
    if (changed === null) console.log('IndexNow: change set is broad, submitting the sitemap.');
  } else if (args[0] === '--sitemap' || args.length === 0) {
    urls = await sitemapUrls();
  } else {
    urls = args.filter((arg) => arg.startsWith('http'));
  }
  urls = [...new Set(urls)].filter((url) => {
    try {
      return new URL(url).hostname === HOST;
    } catch {
      return false;
    }
  });
  if (urls.length === 0) {
    console.log('IndexNow: no URLs to submit.');
    return;
  }
  if (dry) {
    console.log(`IndexNow dry run: ${urls.length} URL(s).`);
    for (const url of urls) console.log(url);
    return;
  }
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key,
      keyLocation: `${ORIGIN}/${key}.txt`,
      urlList: urls.slice(0, 10000),
    }),
  });
  const note = await res.text();
  console.log(`IndexNow: ${res.status} for ${Math.min(urls.length, 10000)} URL(s).`);
  if (note) console.log(note.slice(0, 500));
  if (res.status !== 200 && res.status !== 202) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

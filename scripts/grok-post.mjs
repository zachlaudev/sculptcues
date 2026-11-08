// Asks Grok (xAI API) for a new Journal post following GROK.md and writes it to src/content/blog/.
// Env: XAI_API_KEY (required), GROK_MODEL (default grok-4), AUTO_PUBLISH ('true' | 'false'), TOPIC (optional).
import { readFileSync, readdirSync, writeFileSync, existsSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

const key = process.env.XAI_API_KEY;
if (!key) { console.log('XAI_API_KEY is not set – skipping.'); process.exit(0); }
const model = process.env.GROK_MODEL || 'grok-4';
const autoPublish = (process.env.AUTO_PUBLISH ?? 'true') !== 'false';
const topic = (process.env.TOPIC || '').trim();

const dir = 'src/content/blog';
const brief = readFileSync('GROK.md', 'utf8');
const existing = readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
  const m = readFileSync(join(dir, f), 'utf8').match(/^title:\s*"?(.+?)"?\s*$/m);
  return `- ${m ? m[1] : f}`;
});
const today = new Date().toISOString().slice(0, 10);

const system = `You write posts for the Sculpt Cues Journal. Follow this brief exactly.\n\n${brief}`;
const user = [
  `Today is ${today}. Write one new post.`,
  topic ? `Topic requested: ${topic}` : 'Pick the topic yourself, rotating away from recent posts.',
  `Existing posts (don't repeat these):\n${existing.join('\n') || '- none'}`,
  'Reply with JSON only, no code fences: {"slug": string, "title": string, "description": string, "tags": string[], "body": string}. "body" is the Markdown after the front matter.',
].join('\n\n');

const res = await fetch('https://api.x.ai/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model,
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    response_format: { type: 'json_object' },
  }),
});
if (!res.ok) { console.error(`xAI API ${res.status}: ${await res.text()}`); process.exit(1); }
const raw = (await res.json()).choices?.[0]?.message?.content ?? '';
let post;
try { post = JSON.parse(raw.replace(/^```(json)?|```$/g, '').trim()); }
catch { console.error('Grok did not return JSON:\n' + raw); process.exit(1); }

// Validate
const slug = String(post.slug || post.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);
const title = String(post.title || '').trim();
const description = String(post.description || '').trim();
const body = String(post.body || '').trim().replace(/^#\s+.+\n+/, ''); // drop a repeated H1
const tags = (Array.isArray(post.tags) ? post.tags : []).map(String).slice(0, 3);
const words = body.split(/\s+/).length;
const problems = [];
if (!slug) problems.push('missing slug');
if (!title || title.length > 90) problems.push('title missing or > 90 chars');
if (!description || description.length > 170) problems.push('description missing or > 170 chars');
if (words < 300) problems.push(`body too short (${words} words)`);
if (problems.length) { console.error('Rejected: ' + problems.join(', ')); process.exit(1); }

let file = join(dir, `${slug}.md`);
for (let i = 2; existsSync(file); i++) file = join(dir, `${slug}-${i}.md`);

const q = (s) => JSON.stringify(s);
const md = `---
title: ${q(title)}
description: ${q(description)}
pubDate: ${today}
author: "Sculpt Cues"
tags: ${JSON.stringify(tags)}
draft: ${!autoPublish}
---

${body}
`;
writeFileSync(file, md);
console.log(`Wrote ${file} (${words} words, draft: ${!autoPublish})`);
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `file=${file}\ntitle=${title}\n`);

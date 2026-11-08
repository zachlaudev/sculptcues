# sculptcues.com

Website for the Sculpt Cues iPhone app. Astro static site. Canonical host is `https://www.sculptcues.com`.

Cloudflare Pages project `sculptcues` deploys `main` automatically: `npm ci && npm run build`, output directory `dist`, environment variable `NODE_VERSION=24`.

Pushing `main` also runs the GitHub Pages workflow (`.github/workflows/deploy.yml`), which publishes `https://zachlaudev.github.io/sculptcues/`. `public/CNAME` is `www.sculptcues.com`.

## Run locally
```
npm install
npm run dev      # http://localhost:4321
npm run build    # static files in dist/
```

## Where things are
| What | Where |
|---|---|
| Colours, glass, buttons (mirror `Theme.swift`) | `src/styles/global.css` |
| Prices, email, App Store link | `src/site.ts` |
| Home page | `src/pages/index.astro` |
| Privacy / Terms / Support | `src/pages/*.astro` |
| Journal posts | `src/content/blog/*.md` |
| Grok's writing brief | `GROK.md` |

## Journal posts
Add a Markdown file to `src/content/blog/` (format in `GROK.md`). A future `pubDate` keeps it hidden until that day; the daily deploy publishes it. `draft: true` keeps it hidden.

### Grok, on a schedule
`.github/workflows/grok-post.yml` runs Mondays and Thursdays 09:17 SGT: it sends `GROK.md` to the xAI API, writes the post, checks the build, commits as "Grok (Sculpt Cues)" and deploys.
- Secret `XAI_API_KEY` (Settings → Secrets and variables → Actions) – required.
- Variable `GROK_MODEL` – optional, defaults to `grok-4`.
- Variable `GROK_AUTO_PUBLISH` – set to `false` to save posts as drafts for review.
- Run it now: Actions → "Grok writes a Journal post" → Run workflow (optional topic).

## Email sign-ups
The Subscribe form writes to the Supabase `email_signups` table with `source = 'website'`.

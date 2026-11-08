# sculptcues.com

Website for the Sculpt Cues iPhone app. Astro static site. The canonical host is `https://www.sculptcues.com` on Cloudflare Workers Static Assets. Pushing `main` still publishes the existing GitHub Pages workflow to `https://zachlaudev.github.io/sculptcues/`.

## Run locally
```
npm install
npm run dev      # http://localhost:4321
npm run build    # static files in dist/
```

## Cloudflare (not yet deployed)
Production is Workers Static Assets, configured in `wrangler.jsonc` for account `ccadd082d0f478a8f80feddbe1cac21a` and custom domain `www.sculptcues.com`. `npx wrangler deploy` attaches that hostname and is intentionally not wired into CI. The apex redirect (`sculptcues.com` → `www`, path and query preserved) is a Cloudflare Single Redirect, not part of the static build.

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

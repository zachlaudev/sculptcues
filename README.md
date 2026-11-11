# sculptcues.com

Website for the Sculpt Cues iPhone app. Astro static site. Canonical host is `https://www.sculptcues.com`.

Cloudflare Pages project `sculptcues` deploys `main` automatically: `npm ci && npm run build`, output directory `dist`, environment variable `NODE_VERSION=24`. That is the only automatic deploy.

`.github/workflows/deploy.yml` can still publish a GitHub Pages copy, but only when someone runs it by hand (`workflow_dispatch`). It no longer runs on push or on a schedule. `public/CNAME` is `www.sculptcues.com`. Unpublish GitHub Pages in Settings → Pages if that github.io site is still online.

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
| Journal writing brief | `GROK.md` |

## Journal posts
Add a Markdown file to `src/content/blog/` (format in `GROK.md`) and merge the pull request. The post is live as soon as it is merged, including when `pubDate` is in the future. `draft: true` keeps it hidden. Cloudflare Pages builds `main` after the merge. There is no scheduled auto-publishing.

## Email sign-ups
The Subscribe form writes to the Supabase `email_signups` table with `source = 'website'`.

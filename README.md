# sculptcues.com

Website for the Sculpt Cues iPhone app. Astro static site. Canonical host is `https://www.sculptcues.com`.

Cloudflare Pages project `sculptcues` is the host. It deploys `main` automatically: `npm ci && npm run build`, output directory `dist`, environment variable `NODE_VERSION=24`. GitHub Pages is unpublished.

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

## Meta ads
`/app` is the paid landing page. It stays out of the nav, the sitemap and `llms.txt`, and it is `noindex`. App Store links on that page use `ct` from the `utm_campaign` query (letters, numbers and hyphens, 40 characters), or `site-app` when the query is missing. The Meta Pixel (`1082513481499577`) loads from the shared layout. App Store buttons and badges send a Lead event named `app_store_click`.

## Email sign-ups
The Subscribe form writes to the Supabase `email_signups` table with `source = 'website'`.

## Featured Flows mockup
`/features` is hidden while `FEATURES_ENABLED` is `false` in `src/lib/featuresFlag.js`: the build omits the page, redirects `/features` to `/` with a 302, and leaves it out of the nav, footer, sitemap, and `llms.txt`. Set the flag to `true` to publish it again. `POST /api/feature-request` stays available and stores submissions in the KV binding `FEATURE_REQUESTS` (separate from the mailing list `SUBSCRIBERS`). A `send_email` binding named `EMAIL` is optional; without it the function only stores the request.

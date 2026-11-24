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
| Blog posts | `src/content/blog/*.md` |
| Blog writing brief | `GROK.md` |

## Blog posts
Add a Markdown file to `src/content/blog/` (format in `GROK.md`) and merge the pull request. The post is live as soon as it is merged, including when `pubDate` is in the future. `draft: true` keeps it hidden. Cloudflare Pages builds `main` after the merge. There is no scheduled auto-publishing.

## Meta ads
`/app` is the paid landing page. It stays out of the nav, the sitemap and `llms.txt`, and it is `noindex`. App Store links on that page use `ct` from the `utm_campaign` query (letters, numbers and hyphens, 40 characters), or `site-app` when the query is missing. The Meta Pixel (`1082513481499577`) loads from the shared layout. App Store buttons and badges send a Lead event named `app_store_click`.

## App Store links
Buttons and badges (`a[data-app-store]`) use `https://apps.apple.com/app/apple-store/id6831637468?pt=128746925&ct=<placement>&mt=8`. The `ct` value names the placement: `site-header`, `site-home-hero`, `site-home-pricing`, `site-blog-<slug>` (40 characters), `site-features-<flow>`, `site-shared-flow`. `/app` still reads `utm_campaign` into `ct`, or uses `site-app`. Those clicks still send the Meta Pixel Lead event.

## Search
JSON-LD (Organization, WebSite, and page-specific types) is in the base layout. `/llms.txt` and `/llms-full.txt` are generated at build time. `robots.txt` allows the major search and AI crawlers and points at the sitemap. The sitemap includes Blog posts with `lastmod` from `updatedDate` or `pubDate`.

IndexNow needs no secret. The public key file is `public/<key>.txt`. After a production deploy:

```
node scripts/indexnow.mjs --sitemap
```

Pushing to `main` also runs `.github/workflows/indexnow.yml`, which waits three minutes for the Pages deploy and then submits changed URLs. If that ping runs before Pages finishes, re-run the IndexNow workflow.

## Cloudflare Web Analytics
The beacon is in the base layout. The token in the snippet is the site tag `12cec57a0fb1453f87ec4b5a9750eb07`. Confirm in the Cloudflare dashboard that this is also the beacon token.

## Apex to www
`functions/_middleware.js` returns a 301 from `sculptcues.com` to `https://www.sculptcues.com` when the request reaches this Pages project. Preview hosts are not redirected.

If the apex domain is not attached to the Pages project, the middleware never runs. Add this Redirect Rule on the zone instead (Rules → Redirect Rules):

- Name: `Apex to www`
- If: `(http.host eq "sculptcues.com")`
- Then: Dynamic redirect, status 301
- Expression: `concat("https://www.sculptcues.com", http.request.uri)`

`http.request.uri` includes the path and query string. The apex hostname has to be proxied (orange cloud) for the rule to see it.

## Email sign-ups
The Subscribe form writes to the Supabase `email_signups` table with `source = 'website'`.

## Featured Flows mockup
`/features` is hidden while `FEATURES_ENABLED` is `false` in `src/lib/featuresFlag.js`: the build omits the page, redirects `/features` to `/` with a 301, and leaves it out of the nav, footer, sitemap, and `llms.txt`. Set the flag to `true` to publish it again. `POST /api/feature-request` stays available and stores submissions in the KV binding `FEATURE_REQUESTS` (separate from the mailing list `SUBSCRIBERS`). A `send_email` binding named `EMAIL` is optional; without it the function only stores the request.

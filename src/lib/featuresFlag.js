/**
 * Publish the Featured Flows page.
 * false: /features redirects home, and the link is left out of the nav, footer, sitemap, and llms.txt.
 * true: the page, links, sitemap entry, and llms.txt line are all public.
 * The page component and Flow data stay in the repo either way.
 * POST /api/feature-request is unaffected.
 */
export const FEATURES_ENABLED = false;

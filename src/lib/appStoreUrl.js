/** Apple Ads campaign link used by every App Store button. */
export const APP_STORE_ID = '6831637468';
export const APP_STORE_PT = '128746925';

/**
 * @param {string} ct Placement token, such as site-home-hero. Letters, numbers and hyphens, 40 characters.
 * @returns {string}
 */
export function appStoreCampaignUrl(ct) {
  const safe = String(ct || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40) || 'site';
  const url = new URL(`https://apps.apple.com/app/apple-store/id${APP_STORE_ID}`);
  url.searchParams.set('pt', APP_STORE_PT);
  url.searchParams.set('ct', safe);
  url.searchParams.set('mt', '8');
  return url.toString();
}

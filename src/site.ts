// One place for links and prices.
export const SITE = {
  name: 'Sculpt Cues',
  tagline: 'Plan sculpt classes.',
  description:
    'Plan sculpt, barre and mat Pilates classes on iPhone and Apple Watch. Flows, a 280+ movement library, an intensity chart and Cue Coach.',
  email: 'hello@sculptcues.com',
  appStoreUrl: 'https://apps.apple.com/us/app/sculpt-cues-plan-your-class/id6831637468',
  instagram: 'https://www.instagram.com/sculptcues/',
};

export { APP_STORE_ID, APP_STORE_PT, appStoreCampaignUrl } from './lib/appStoreUrl.js';

export const PRICES = [
  { id: 'annual', name: 'Annual', price: '$39.99', per: '/ year', note: '7-day free trial', badge: 'Best value' },
  { id: 'monthly', name: 'Monthly', price: '$7.99', per: '/ month', note: 'Cancel any time' },
  { id: 'lifetime', name: 'Lifetime', price: '$79.99', per: 'once', note: 'Pay once, keep it forever' },
];

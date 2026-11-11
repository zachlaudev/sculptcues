// One place for links and prices.
export const SITE = {
  name: 'Sculpt Cues',
  tagline: 'Plan sculpt classes.',
  description:
    'Sculpt Cues is the sculpt class planner for sculpt teachers: a movement library, segment-by-segment Flows, and sharing between teachers.',
  email: 'hello@sculptcues.com',
  appStoreUrl: 'https://apps.apple.com/us/app/sculpt-cues-plan-your-class/id6831637468',
  instagram: null as string | null,
};

export const PRICES = [
  { id: 'annual', name: 'Annual', price: '$39.99', per: '/ year', note: '7-day free trial', badge: 'Best value' },
  { id: 'monthly', name: 'Monthly', price: '$7.99', per: '/ month', note: 'Cancel any time' },
  { id: 'lifetime', name: 'Lifetime', price: '$79.99', per: 'once', note: 'Pay once, keep it forever' },
];

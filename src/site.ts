// One place for links and prices. Update appStoreUrl once the app is live.
export const SITE = {
  name: 'Sculpt Cues',
  tagline: 'Plan the class. Cue the beat.',
  description:
    'Sculpt Cues is the iPhone app for sculpt teachers: 280+ movements, Flow building with overwork warnings, and a built-in coach that finds the beat in any song.',
  email: 'hello@sculptcues.com',
  appStoreUrl: null as string | null, // e.g. 'https://apps.apple.com/app/id1234567890'
  instagram: null as string | null,
};

export const PRICES = [
  { id: 'annual', name: 'Annual', price: '$39.99', per: '/ year', note: '7-day free trial', badge: 'Best value' },
  { id: 'monthly', name: 'Monthly', price: '$7.99', per: '/ month', note: 'Cancel any time' },
  { id: 'lifetime', name: 'Lifetime', price: '$79.99', per: 'once', note: 'Pay once, keep it forever' },
];

// One place for links and prices. Update appStoreUrl once the app is live.
export const SITE = {
  name: 'Sculpt Cues',
  tagline: 'Plan the class. Teach it your way.',
  description:
    'Sculpt Cues is the iPhone app for sculpt teachers: a growing library of 280+ movements, Flows with next-movement suggestions, and sharing between teachers.',
  email: 'sculptcues@gmail.com',
  appStoreUrl: null as string | null, // e.g. 'https://apps.apple.com/app/id1234567890'
  instagram: null as string | null,
};

export const PRICES = [
  { id: 'annual', name: 'Annual', price: '$39.99', per: '/ year', note: '7-day free trial', badge: 'Best value' },
  { id: 'monthly', name: 'Monthly', price: '$7.99', per: '/ month', note: 'Cancel any time' },
  { id: 'lifetime', name: 'Lifetime', price: '$79.99', per: 'once', note: 'Pay once, keep it forever' },
];

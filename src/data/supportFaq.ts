import { SITE } from '../site';

/** Visible on the support page and in FAQPage structured data. */
export const supportFaqs = [
  { q: 'Cue Coach isn’t picking up the beat.', a: 'Check microphone access in iOS Settings → Sculpt Cues. Play the song out loud (not through headphones) and keep the phone within a few metres of the speaker. Songs with a clear kick drum work best; it usually locks on within a few seconds.' },
  { q: 'How do I restore my purchase on a new phone?', a: 'Open the paywall or Profile and tap Restore. Use the same Apple ID you bought with.' },
  { q: 'How do I cancel my subscription?', a: 'iOS Settings → your name → Subscriptions → Sculpt Cues. Cancel at least 24 hours before it renews.' },
  { q: 'Where are my Flows saved?', a: 'On your phone, and backed up to your Sculpt Cues account. Sign in on a new phone and they come back. Movement photos stay on the phone they were added on.' },
  { q: 'How do I share a Flow with another teacher?', a: 'Open the Flow and tap Share. Sculpt Cues sends a .sculptflow file through the iPhone share sheet (Messages, AirDrop and the rest). The other teacher taps the file to open it in the app.' },
  { q: 'I forgot my password.', a: 'On the Sign in screen tap Forgot password. The email link opens a page where you choose a new one; then sign in in the app.' },
  { q: 'A movement is missing from the library.', a: `Add your own from the Library with New, or email ${SITE.email} if you want it considered for the catalogue.` },
];

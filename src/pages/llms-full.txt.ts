import type { APIRoute } from 'astro';
import { homeFaqs } from '../data/homeFaq';
import { supportFaqs } from '../data/supportFaq';
import { FEATURES_ENABLED } from '../lib/featuresFlag.js';
import { getPosts } from '../lib/posts';
import { SITE, PRICES } from '../site';

const origin = 'https://www.sculptcues.com';

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const priceLines = PRICES.map((plan) => `- ${plan.name}: ${plan.price} ${plan.per} (${plan.note})`);
  const body = [
    '# Sculpt Cues',
    '',
    '> Sculpt Cues is an iPhone and Apple Watch class planner for sculpt, barre and mat Pilates instructors. Published by Sculpt Cues.',
    '',
    'This file is a longer factual summary of https://www.sculptcues.com/ for answer engines. A shorter version is at /llms.txt. It does not add claims that are not on the site or the App Store listing.',
    '',
    '## What it is',
    'Sculpt Cues is the class planner for sculpt, barre and mat Pilates instructors. Instructors build each class as a Flow, segment by segment. A segment is about one song. Movements sit inside Segments, and Segments build a Flow.',
    '',
    'It is for instructors planning and teaching group classes. It is not a workout app for students.',
    '',
    'The home page states these figures: 280+ built-in movements, 175 countries supported, and iPhone and Apple Watch (Android and iPad coming soon). $0 is the free download. The annual plan includes a 7-day free trial. There is no lasting free tier.',
    '',
    '## Who it is for',
    'Sculpt, barre and mat Pilates instructors, including teachers planning group classes. The Blog is written for working sculpt and mat Pilates instructors.',
    '',
    '## Platforms',
    `- iPhone. Requires iOS 17.0 or later. The App Store listing says it is designed for iPhone and is not verified for macOS. Listing: ${SITE.appStoreUrl}`,
    '- Apple Watch. Support is live. Requires watchOS 10.0 or later.',
    '- On Apple Watch, a Flow shows the current segment, the movements in it, a timer, notes and what comes next. Open it from Teach, then Play on Apple Watch. The watch can show one segment at a time or the whole Flow as a list. The timer has stopwatch, countdown and looped modes. Text size and layout are set on iPhone in Profile, then Apple Watch.',
    '',
    '## Features',
    '- Movement library: 280+ built-in sculpt, barre and Pilates movements, sorted by body part (core, glutes, legs, arms, shoulders, back and chest), plus custom movements.',
    '- Flows: build a class segment by segment, keep Flows in folders, rearrange them, add notes for counts and cues, and duplicate a Flow to tweak it.',
    '- Suggested movements appear as you build.',
    '- Five starter Flows ship with the app: Bodyweight Tone (11 segments, 38 movements), Arms and Core (11 segments, 38 movements), Legs and Glutes (11 segments, 37 movements), Beam Flow (10 segments, 33 movements) and Dumbbell Flow (10 segments, 38 movements).',
    '- Intensity chart: every movement is scored across seven body parts. The chart warns about possible overwork, suggests a counter movement, and shows how often a class moves up and down from the floor.',
    '- Cue Coach: play any song out loud (Spotify, Apple Music, YouTube or anything else). It finds the BPM and pulses cues at half time, single time or double time. Audio is not recorded, saved or uploaded. Nothing is sent off the phone.',
    '- Share a Flow with another teacher as a .sculptflow file. Movements you created travel with it. Catalogue movements the other teacher already has are not sent again.',
    '- Teach from the phone: large movement lists, and the screen stays awake while you teach.',
    '',
    '## Pricing',
    'Prices below are USD, as shown on the website. The App Store sets the local price. Subscriptions renew until cancelled in Apple ID settings. The annual plan includes a 7-day free trial. Payment is charged to the Apple ID. Sculpt Cues does not see card details.',
    ...priceLines,
    'Every plan includes the movement library, folders, your own movements, Cue Coach and sharing.',
    '',
    '## Questions instructors ask',
    ...homeFaqs.flatMap((faq) => [`### ${faq.q}`, faq.a, '']),
    '## Support questions',
    ...supportFaqs.flatMap((faq) => [`### ${faq.q}`, faq.a, '']),
    '## Blog',
    ...posts.flatMap((post) => {
      const updated = post.data.updatedDate ?? post.data.pubDate;
      return [
        `### ${post.data.title}`,
        post.data.description,
        `Published ${post.data.pubDate.toISOString().slice(0, 10)}. Updated ${updated.toISOString().slice(0, 10)}. Author: Sculpt Cues.`,
        `${origin}/blog/${post.id}/`,
        '',
      ];
    }),
    '## Pages',
    `- Home: ${origin}/`,
    ...(FEATURES_ENABLED ? [`- Featured Flows: ${origin}/features/`] : []),
    `- Cue Coach: ${origin}/cue-coach/`,
    `- Barre class planner: ${origin}/barre-class-planner/`,
    `- Mat Pilates sequence builder: ${origin}/mat-pilates-sequence-builder/`,
    `- Sample Flows: ${origin}/sample-flows/`,
    `- Blog: ${origin}/blog/`,
    `- About: ${origin}/about/`,
    `- Support: ${origin}/support/`,
    `- Subscribe: ${origin}/subscribe/`,
    `- Privacy: ${origin}/privacy/`,
    `- Terms: ${origin}/terms/`,
    `- RSS: ${origin}/rss.xml`,
    '',
    '## Contact',
    `- Email: ${SITE.email}`,
    `- Instagram: ${SITE.instagram}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

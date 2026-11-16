import type { APIRoute } from 'astro';
import { homeFaqs } from '../data/homeFaq';
import { FEATURES_ENABLED } from '../lib/featuresFlag.js';
import { getPosts } from '../lib/posts';
import { SITE } from '../site';

const origin = 'https://www.sculptcues.com';

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const pages = [
    `- [Home](${origin}/)`,
    ...(FEATURES_ENABLED ? [`- [Featured Flows](${origin}/features/)`] : []),
    `- [Journal](${origin}/blog/)`,
    ...posts.map((post) => `- [${post.data.title}](${origin}/blog/${post.id}/)`),
    `- [About](${origin}/about/)`,
    `- [Support](${origin}/support/)`,
    `- [Subscribe](${origin}/subscribe/)`,
    `- [Privacy](${origin}/privacy/)`,
    `- [Terms](${origin}/terms/)`,
  ];
  const body = [
    '# Sculpt Cues',
    '',
    '> Sculpt Cues is an iPhone and Apple Watch class planner for sculpt, barre and mat Pilates instructors. Plan a class as a Flow made of Segments, check the load with an intensity chart, and cue on the beat with Cue Coach.',
    '',
    'Sculpt Cues is for instructors planning and teaching group classes. It is not a workout app for students.',
    '',
    '## Key facts',
    `- Platforms: iPhone (iOS 17 or later) and Apple Watch (watchOS 10 or later). App Store: ${SITE.appStoreUrl}`,
    '- Who it is for: sculpt, barre and mat Pilates instructors.',
    '- Movements: 280+ built-in sculpt, barre and Pilates movements, plus movements you add yourself. Movements sit inside Segments. Segments build a Flow.',
    '- Flows: one segment is about one song. Organise Flows in folders, add notes, duplicate, rearrange, and share a Flow with another teacher as a link or a file.',
    '- Apple Watch: support is live. From a Flow, the watch shows the current segment, the movements in it, a timer, notes and what comes next.',
    '- Intensity chart: scores core, glutes, legs, arms, shoulders, back and chest, with an overwork caution and counter-movement suggestions.',
    '- Cue Coach: detects the BPM of any song playing aloud and pulses cues at half, single or double time. Audio is not recorded, saved or uploaded.',
    '- Pricing (USD): $7.99 per month, $39.99 per year with a 7-day free trial, $79.99 lifetime. Local prices are set by the App Store. Every plan includes the full app.',
    `- Contact: ${SITE.email}`,
    `- Instagram: ${SITE.instagram}`,
    '',
    '## Questions instructors ask',
    ...homeFaqs.flatMap((faq) => [`- ${faq.q}`, `  ${faq.a}`]),
    '',
    '## Pages',
    ...pages,
    '',
    '## Optional',
    `- [Full summary](${origin}/llms-full.txt)`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

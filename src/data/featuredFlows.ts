import type { Scores } from '../lib/impact';

/**
 * Featured Flows mockup.
 * A creator card uses the same shape: author, optional handle, optional avatar
 * (omit avatar and the photo block is hidden), and optional links
 * (tiktokVideo, tiktok, instagram, spotify, appleMusic, website).
 * Entries with `demo: true` stay in this file as that shape, and are not rendered.
 * The five community Flows use the estimated chart numbers from the 11 Nov 2026 write-up.
 * Editorial marks († ‡ ★) are omitted; they were notes for entering movements in the app.
 */

export function cardSubtitle(flow: { subtitle: string; segments: Segment[] }) {
  const minutes = flow.subtitle.match(/^(\d+)/)?.[1] ?? '';
  const movements = flow.segments.reduce((sum, segment) => sum + segment.movements.length, 0);
  return `${minutes} min · ${flow.segments.length} segments · ${movements} movements`;
}

export type FlowLinks = {
  tiktokVideo?: string;
  tiktok?: string;
  instagram?: string;
  spotify?: string;
  appleMusic?: string;
  website?: string;
};

export type Segment = { movements: string[]; notes: string };

export type FeaturedFlow = {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  handle?: string;
  /** When omitted, the card does not render a photo. */
  avatar?: string;
  /** Demo-only. Remove before launch. */
  demo?: boolean;
  links?: FlowLinks;
  equipment: string;
  positions: string;
  segments: Segment[];
  scores: Scores;
};

const community = 'Sculpt Cues Community';

export const flows: FeaturedFlow[] = [
  {
    id: 'full-body-sculpt-45',
    title: 'Full-Body Sculpt 45',
    subtitle: '45 min · Full body',
    author: community,
    equipment: 'Light dumbbells, loop band',
    positions: 'Stand › On back › On front › All fours › Plank › Kneel › Seated › On back · 1 up/down from the floor.',
    scores: { core: 51, glutes: 47, legs: 46, arms: 27, shoulders: 22, back: 16, chest: 13 },
    segments: [
      { movements: ['Eagle Arms Stretch', 'Straight Arm Round the World', 'Hip Circles', 'Woodchop Standing'], notes: 'Warm-up · standing · 100–115 BPM · single time · 8 of each, then repeat' },
      { movements: ['Low Lunge', 'Side Lunge', 'Plié Squat'], notes: 'Warm-up 2 · bodyweight · 110–118 BPM · single time · alternate sides, 8 each' },
      { movements: ['Reverse Lunge', 'Curtsy Lunge', 'Disco Hip'], notes: 'Lower body 1 · right leg · 118–125 BPM · 8 single, 8 half time with a hold, 16 pulses' },
      { movements: ['Reverse Lunge', 'Curtsy Lunge', 'Disco Hip'], notes: 'Lower body 1 · left leg · same moves, left side' },
      { movements: ['Bicep Curl', 'Bent Over Row', 'Arnold Press', 'Reverse Fly'], notes: 'Upper body 1 · light dumbbells · 118–125 BPM · push then pull, 12–16 each' },
      { movements: ['Side Lunge + Bicep Curl', 'Side Lunge + Upright Row', 'Plié Squat'], notes: 'Glutes & legs 2 · lunge combos · 120–128 BPM · alternate sides, 8 each side · finish with 16 Plié Squat pulses' },
      { movements: ['Glute Bridge', 'Hip Thrust', 'One Leg Circle'], notes: 'Glutes on the mat · band above knees · 120–128 BPM · 16 lifts, 16 pulses · circles 8 each leg' },
      { movements: ['Lying Dumbbell Chest Press', 'Chest Fly', 'Skull Crusher'], notes: 'Upper body 2 · on your back · 120–128 BPM · 12–16 each, slow on the way down' },
      { movements: ['Dead Bug', 'The Hundred', 'Crunch', 'Chest Lift with Rotation'], notes: 'Core 1 · on your back · 110–122 BPM · 8–10 each side, Hundred to the full count' },
      { movements: ['Single Leg Stretch', 'Double Leg Stretch', 'Swimming'], notes: 'Core 2 + back body · 110–122 BPM · roll to your front for Swimming' },
      { movements: ['Chest Press Hover', 'Triceps Hover', 'Chest Press Up', 'Kneeling Side Plank'], notes: 'Finisher · all fours to plank · 125–135 BPM · holds and double-time pulses, side plank right then left' },
      { movements: ['Saw', 'Spine Twist', 'Figure Four Stretch'], notes: 'Cool-down · seated, then on your back · under 100 BPM · long exhales' },
    ],
  },
  {
    id: 'spicy-arms-30',
    title: 'Spicy Arms 30',
    subtitle: '30 min · Arms',
    author: community,
    equipment: 'Light dumbbells',
    positions: 'Stand › On back › All fours › Plank › Kneel › On front › Seated · 1 up/down from the floor.',
    scores: { core: 18, glutes: 20, legs: 19, arms: 43, shoulders: 41, back: 14, chest: 11 },
    segments: [
      { movements: ['Eagle Arms Stretch', 'Straight Arm Round the World', 'Woodchop Standing'], notes: 'Warm-up · standing · 105–115 BPM · single time, 8 each' },
      { movements: ['Bicep Curl', 'Lateral Raise', 'Hammer Curl', 'Arnold Press'], notes: 'Biceps & shoulders · 118–126 BPM · 16 single, 8 half time, 8 pulses' },
      { movements: ['Bent Over Row', 'Tricep Kickback', 'Reverse Fly', 'Upright Row'], notes: 'Back & triceps · hinge · 118–126 BPM · 12–16 each, stand tall for the Upright Row' },
      { movements: ['High Lunge + Bicep Curl', 'High Lunge + Lateral Raise', 'High Lunge + Shoulder Press'], notes: 'Lunge combos · right leg forward · 120–128 BPM · 8 each, then 8 pulses' },
      { movements: ['High Lunge + Bicep Curl', 'High Lunge + Lateral Raise', 'High Lunge + Shoulder Press'], notes: 'Lunge combos · left leg forward · same moves, left side' },
      { movements: ['Lying Dumbbell Chest Press', 'Chest Fly', 'Skull Crusher'], notes: 'Chest & triceps · on your back · 120–128 BPM · 12–16 each' },
      { movements: ['Triceps Hover', 'Chest Press Up', 'Kneeling Serve the Platter'], notes: 'Finisher · all fours to plank, then kneel · 125–135 BPM · holds and double-time pulses' },
      { movements: ['Hands by Shoulders', 'Saw', 'Spine Twist'], notes: 'Cool-down · face down, then seated · under 100 BPM' },
    ],
  },
  {
    id: 'glute-burn-40',
    title: 'Glute Burn 40',
    subtitle: '40 min · Glutes',
    author: community,
    equipment: 'Loop band, light dumbbells',
    positions: 'Stand › On back › All fours › Side-lying › On front › On back › Seated · 1 up/down from the floor.',
    scores: { core: 38, glutes: 65, legs: 44, arms: 1, shoulders: 8, back: 11, chest: 0 },
    segments: [
      { movements: ['Hip Circles', 'Low Lunge', 'Side Lunge', 'Straight Arm Round the World'], notes: 'Warm-up · standing · 105–115 BPM · single time, alternate sides' },
      { movements: ['Plié Squat', 'Squat', 'Disco Hip'], notes: 'Squats · band above knees · 118–125 BPM · 16 single, 8 half time with a hold, 16 pulses' },
      { movements: ['Curtsy Lunge', 'Reverse Lunge', 'High Lunge + Rotation'], notes: 'Lunges · right leg · 120–128 BPM · 8 single, 8 half time, 16 pulses' },
      { movements: ['Curtsy Lunge', 'Reverse Lunge', 'High Lunge + Rotation'], notes: 'Lunges · left leg · same moves, left side' },
      { movements: ['Glute Bridge', 'Hip Thrust', 'One Leg Circle'], notes: 'Bridges · band on · 120–128 BPM · 16 lifts, 8 with a hold, 16 pulses' },
      { movements: ['Dead Bug', 'Toe Taps', 'The Hundred'], notes: 'Core break · on your back · 110–120 BPM · glutes rest' },
      { movements: ['Donkey Kick', 'Fire Hydrant', 'Bear Hold'], notes: 'All fours · band on · 120–128 BPM · switch legs after each movement, 12–16 each' },
      { movements: ['Clamshell', 'Side-Lying Leg Lift'], notes: 'Side-lying · right side · band on · 118–125 BPM · 16 single, 16 pulses' },
      { movements: ['Clamshell', 'Side-Lying Leg Lift'], notes: 'Side-lying · left side · same moves' },
      { movements: ['Swimming', 'Hands by Shoulders'], notes: 'Back body · face down · 110–120 BPM · slow and long' },
      { movements: ['Figure Four Stretch', 'Saw', 'Spine Twist'], notes: 'Cool-down · on your back, then seated · under 100 BPM' },
    ],
  },
  {
    id: 'core-sculpt-30',
    title: 'Core Sculpt 30',
    subtitle: '30 min · Abs',
    author: community,
    equipment: 'Mat (no weights)',
    positions: 'Stand › On back › On front › All fours › Kneel › Seated · 1 up/down from the floor.',
    scores: { core: 62, glutes: 5, legs: 4, arms: 5, shoulders: 15, back: 15, chest: 2 },
    segments: [
      { movements: ['Woodchop Standing', 'Hip Circles', 'Straight Arm Round the World'], notes: 'Warm-up · standing · 105–115 BPM · single time, 8 each, then roll down to the mat' },
      { movements: ['Dead Bug', 'The Hundred', 'Toe Taps'], notes: 'Core · on your back · 110–120 BPM · 8–10 each side, Hundred to the full count' },
      { movements: ['Chest Lift with Rotation', 'Crunch', 'Bicycle Crunch'], notes: 'Obliques · on your back · 115–122 BPM · 8 single, 8 half time, 8 pulses each side' },
      { movements: ['Single Leg Stretch', 'Double Leg Stretch', 'One Leg Circle'], notes: 'Leg series · on your back · 115–122 BPM · 8–10 each, circles 8 each way' },
      { movements: ['Swimming', 'Swan Dive', 'Hands by Shoulders'], notes: 'Back body · face down · 110–120 BPM · the counter to all that flexion' },
      { movements: ['Bear Hold', 'Chest Press Hover', 'Triceps Hover'], notes: 'All fours · 118–125 BPM · 20–40 s holds, then double-time pulses' },
      { movements: ['Kneeling Side Plank', 'Kneeling Side Plank Rotation'], notes: 'Side plank · kneeling · right then left · 115–122 BPM' },
      { movements: ['Half Roll Back', 'Spine Twist', 'Saw'], notes: 'Seated core & cool-down · under 105 BPM' },
    ],
  },
  {
    id: 'beginner-sculpt-30',
    title: 'Beginner Sculpt 30',
    subtitle: '30 min · Full body',
    author: community,
    equipment: 'Bodyweight (light dumbbells optional)',
    positions: 'Stand › On back › On front › Kneel › Side-lying › Seated › On back · 1 up/down from the floor.',
    scores: { core: 26, glutes: 18, legs: 14, arms: 6, shoulders: 12, back: 16, chest: 0 },
    segments: [
      { movements: ['Eagle Arms Stretch', 'Hip Circles', 'Straight Arm Round the World'], notes: 'Warm-up · standing · 100–110 BPM · single time, 8 each' },
      { movements: ['Plié Squat', 'Side Lunge', 'Low Lunge'], notes: 'Legs · bodyweight · 110–118 BPM · single time, 8–10 each, alternate sides' },
      { movements: ['Bicep Curl', 'Lateral Raise', 'Bent Over Row'], notes: 'Arms · no or light weights · 110–118 BPM · single time, 10–12 each' },
      { movements: ['Glute Bridge', 'One Leg Circle'], notes: 'Bridges · on your back · 110–118 BPM · 12 lifts, circles 6 each leg' },
      { movements: ['Dead Bug', 'Toe Taps', 'Crunch'], notes: 'Core · on your back · 108–115 BPM · 6–8 each side' },
      { movements: ['Swimming', 'Hands by Shoulders'], notes: 'Back body · face down · 105–115 BPM · slow' },
      { movements: ['Kneeling Side Plank', 'Clamshell'], notes: 'Side work · right then left · 108–115 BPM · 10 each side' },
      { movements: ['Spine Twist', 'Saw', 'Figure Four Stretch'], notes: 'Cool-down · seated, then on your back · under 100 BPM' },
    ],
  },
  // Demo only. Remove before launch. Not a real instructor.
  {
    id: 'demo-sunday-burn',
    title: 'Sunday Burn',
    subtitle: '45 min · Full body',
    author: 'Demo Instructor',
    handle: '@demo.instructor',
    avatar: '/img/demo-instructor.svg',
    demo: true,
    equipment: 'Light dumbbells',
    positions: 'Demo only · not a real class.',
    links: {
      tiktokVideo: 'https://example.com/demo/tiktok-video',
      tiktok: 'https://example.com/demo/tiktok',
      instagram: 'https://example.com/demo/instagram',
      spotify: 'https://example.com/demo/spotify',
      appleMusic: 'https://example.com/demo/apple-music',
      website: 'https://example.com/demo',
    },
    scores: { core: 30, glutes: 28, legs: 24, arms: 22, shoulders: 18, back: 12, chest: 10 },
    segments: [
      { movements: ['Demo march', 'Demo squat to reach'], notes: 'Demo only · warm-up · not a real class' },
      { movements: ['Demo lunge', 'Demo row'], notes: 'Demo only · standing work · placeholder movements' },
      { movements: ['Demo stretch'], notes: 'Demo only · cool-down' },
    ],
  },
  // Demo only. Remove before launch. No photo, only some links.
  {
    id: 'demo-desk-stretch',
    title: 'Desk Stretch Demo',
    subtitle: '20 min · Recovery',
    author: '@demo.instructor',
    demo: true,
    equipment: 'None',
    positions: 'Demo only · not a real class.',
    links: {
      instagram: 'https://example.com/demo/instagram',
      website: 'https://example.com/demo',
    },
    scores: { core: 10, glutes: 4, legs: 6, arms: 2, shoulders: 8, back: 6, chest: 1 },
    segments: [
      { movements: ['Demo shoulder roll', 'Demo hip hinge'], notes: 'Demo only · a shorter card with two links and no photo' },
      { movements: ['Demo seated twist'], notes: 'Demo only · cool-down' },
    ],
  },
];

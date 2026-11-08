// Locked-beat math from App/SculptCues/Cue/CueView.swift and BeatSession.swift.
// One beat clock. Cue words are derived from it. This module does not use audio.

export const CUE_WORDS = [
  ['Up', 'Down'],
  ['In', 'Out'],
  ['Left', 'Right'],
];

/** Beats per cue. CueSpeed in CueView.swift. */
export const BEATS_PER_CUE = {
  half: 2,
  single: 1,
  double: 0.5,
};

/** BeatClock.position, with nextBeat = 0 and beatNumber = 0. */
export function beatPosition(t, period) {
  const x = t / period;
  const k = Math.floor(x);
  return { beat: k, progress: x - k };
}

/** cueCircle's cue index: (beat + progress) / beatsPerCue. */
export function cuePosition(beat, progress, beatsPerCue) {
  const x = (beat + progress) / beatsPerCue;
  const k = Math.floor(x);
  return { index: k, progress: x - k };
}

/** Expand on the beat, then settle. 1 + 0.10 * exp(-seconds / 0.09). */
export function pulseScale(beatProgress, period, reduceMotion) {
  if (reduceMotion) return 1;
  const seconds = beatProgress * period;
  return 1 + 0.10 * Math.exp(-seconds / 0.09);
}

/** Ring contracts from outer to inner across the cue. Reduced motion holds still. */
export function ringSize(cueProgress, outer, inner, reduceMotion) {
  if (reduceMotion) return inner;
  return outer + (inner - outer) * cueProgress;
}

/** Eight count dots. Active index is beat % 8. */
export function countDot(beat) {
  return ((beat % 8) + 8) % 8;
}

export function wordFor(option, cueIndex) {
  const pair = CUE_WORDS[option] ?? CUE_WORDS[0];
  return pair[((cueIndex % 2) + 2) % 2];
}

export function sampleAt(t, options = {}) {
  const bpm = options.bpm ?? 120;
  const speed = options.speed ?? 'single';
  const option = options.option ?? 0;
  const reduceMotion = options.reduceMotion ?? false;
  const outer = options.outer ?? 232;
  const inner = options.inner ?? 124;
  const period = 60 / bpm;
  const beatsPerCue = BEATS_PER_CUE[speed] ?? 1;
  const beat = beatPosition(t, period);
  const cue = cuePosition(beat.beat, beat.progress, beatsPerCue);
  const even = ((cue.index % 2) + 2) % 2 === 0;
  return {
    period,
    beat: beat.beat,
    beatProgress: beat.progress,
    cueIndex: cue.index,
    cueProgress: cue.progress,
    word: wordFor(option, cue.index),
    filled: even,
    pulse: pulseScale(beat.progress, period, reduceMotion),
    ring: ringSize(cue.progress, outer, inner, reduceMotion),
    dot: countDot(beat.beat),
  };
}

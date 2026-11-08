import assert from 'node:assert/strict';
import { sampleAt } from '../src/lib/cueClock.js';

const bpm = 120;
const period = 0.5;

function at(t, extra = {}) {
  return sampleAt(t, { bpm, ...extra });
}

// Single: a new word on every beat. Up, Down, Up, Down.
const single = [0, 1, 2, 3].map((beat) => at(beat * period));
assert.deepEqual(single.map((s) => s.word), ['Up', 'Down', 'Up', 'Down']);
assert.deepEqual(single.map((s) => s.filled), [true, false, true, false]);
assert.deepEqual(single.map((s) => s.dot), [0, 1, 2, 3]);
assert.equal(single[0].pulse, 1.1);
assert.ok(Math.abs(single[0].ring - 232) < 1e-9);

// Still on beat 0 just before the next beat.
const late = at(period - 1e-9);
assert.equal(late.beat, 0);
assert.equal(late.word, 'Up');
assert.ok(late.pulse < 1.02);

// The pulse belongs to the beat, not a second cue animation.
const mid = at(period * 0.5);
assert.equal(mid.beat, 0);
assert.equal(mid.word, 'Up');
assert.ok(mid.pulse < single[0].pulse);
assert.ok(mid.ring < single[0].ring);

// Half time: one word lasts two beats. The count still advances every beat.
const halfA = at(0, { speed: 'half' });
const halfB = at(period, { speed: 'half' });
const halfC = at(2 * period, { speed: 'half' });
assert.equal(halfA.word, 'Up');
assert.equal(halfB.word, 'Up');
assert.equal(halfB.dot, 1);
assert.equal(halfC.word, 'Down');
assert.ok(Math.abs(halfB.cueProgress - 0.5) < 1e-9);

// Double time: the word changes halfway through the beat. The dot does not.
const dubA = at(0, { speed: 'double' });
const dubB = at(period / 2, { speed: 'double' });
const dubC = at(period, { speed: 'double' });
assert.deepEqual([dubA.word, dubB.word, dubC.word], ['Up', 'Down', 'Up']);
assert.equal(dubB.dot, 0);
assert.equal(dubC.dot, 1);
assert.ok(dubB.pulse < 1.02);
assert.equal(dubC.pulse, 1.1);

// Eight count dots, then back to 1.
assert.equal(at(8 * period).dot, 0);
assert.equal(at(8 * period).word, 'Up');

// Other cue pairs, same clock.
assert.equal(at(0, { option: 1 }).word, 'In');
assert.equal(at(period, { option: 1 }).word, 'Out');
assert.equal(at(period, { option: 2 }).word, 'Right');

// Reduced motion: no scale pulse and no travelling ring. The word still changes.
const still = at(0, { reduceMotion: true, outer: 220, inner: 118 });
const next = at(period, { reduceMotion: true, outer: 220, inner: 118 });
assert.equal(still.pulse, 1);
assert.equal(still.ring, 118);
assert.equal(next.pulse, 1);
assert.equal(next.word, 'Down');

console.log('cue clock ok');

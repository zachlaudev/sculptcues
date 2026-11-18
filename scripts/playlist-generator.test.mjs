import assert from 'node:assert/strict';
import { generate, makeRng, toText, fmt, ROLE_ORDER } from '../public/tools/playlist-generator.mjs';
import { SONGS } from '../public/tools/sculpt-song-pool.mjs';

// Pool sanity: real fields, no duplicates, sensible lengths.
assert.ok(SONGS.length >= 100, `pool has ${SONGS.length} songs`);
const ids = new Set(SONGS.map((s) => s.id));
assert.equal(ids.size, SONGS.length, 'no duplicate Spotify IDs');
for (const s of SONGS) {
  assert.ok(s.title && s.artist, 'title and artist');
  assert.ok(Number.isInteger(s.sec) && s.sec >= 100 && s.sec <= 400, `${s.title} length ${s.sec}`);
  assert.ok(ROLE_ORDER.includes(s.role), `${s.title} role ${s.role}`);
  assert.match(s.id, /^[A-Za-z0-9]{22}$/);
}

assert.equal(fmt(65), '1:05');
assert.equal(fmt(2765), '46:05');
assert.equal(fmt(3725), '1:02:05');

const rank = { warm: 0, build: 1, peak: 2, cool: 3 };
let worst = 0;
for (const minutes of [10, 20, 30, 45, 50, 60, 75, 90, 120]) {
  for (const style of ['balanced', 'high', 'steady']) {
    for (const clean of [true, false]) {
      for (let seed = 1; seed <= 25; seed++) {
        const r = generate(SONGS, { minutes, style, clean }, makeRng(seed * 7919 + minutes));
        const total = r.songs.reduce((n, s) => n + s.sec, 0);
        assert.equal(total, r.total, 'total matches songs');
        assert.equal(r.target, minutes * 60);
        worst = Math.max(worst, Math.abs(r.diff));
        assert.ok(Math.abs(r.diff) <= 60, `${minutes}m ${style} clean=${clean} seed ${seed}: off by ${r.diff}s`);
        // Arc: warm-up first, cool-down last, no song twice.
        assert.equal(r.songs[0].role, 'warm', 'starts with a warm-up song');
        assert.equal(r.songs.at(-1).role, 'cool', 'ends with a cool-down song');
        assert.equal(new Set(r.songs.map((s) => s.id)).size, r.songs.length, 'no repeats');
        if (clean) assert.ok(r.songs.every((s) => !s.explicit), 'clean mode has no explicit songs');
        // Peaks sit between the warm-up and the cool-down; at most one build after the peaks.
        const firstPeak = r.songs.findIndex((s) => s.role === 'peak');
        const lastPeak = r.songs.map((s) => s.role).lastIndexOf('peak');
        assert.ok(firstPeak > 0 && lastPeak < r.songs.length - 1, 'peaks in the middle');
        const after = r.songs.slice(lastPeak + 1).filter((s) => s.role === 'build').length;
        assert.ok(after <= 1);
        for (let i = 1; i < firstPeak; i++) assert.ok(rank[r.songs[i].role] <= 1, 'only warm/build before peaks');
      }
    }
  }
}

// Regenerate gives different mixes.
const a = generate(SONGS, { minutes: 45 }, makeRng(1)).songs.map((s) => s.id).join();
const b = generate(SONGS, { minutes: 45 }, makeRng(2)).songs.map((s) => s.id).join();
assert.notEqual(a, b);

// Typical classes land within 10 seconds.
let close = 0;
for (let seed = 1; seed <= 200; seed++) if (Math.abs(generate(SONGS, { minutes: 45 }, makeRng(seed)).diff) <= 10) close++;
assert.ok(close >= 190, `${close}/200 within 10s`);

// Plain text for Notes.
const text = toText(generate(SONGS, { minutes: 30 }, makeRng(3)), 'Sculpt playlist · 30 min');
assert.match(text, /^Sculpt playlist · 30 min \(\d+:\d\d\)\n\n1\. .+ – .+ \(\d+:\d\d\)/);
assert.match(text, /\nTotal: \d+:\d\d$/);
assert.ok(!/[<>|]/.test(text), 'no markup in copied text');

console.log(`playlist generator ok (worst miss ${worst}s, 45-min within 10s: ${close}/200)`);

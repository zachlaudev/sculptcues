// Sculpt playlist generator: fills a class length with real songs in a warm-up, build, peak, cool-down arc.
// Pure functions, no network. Used by /blog/sculpt-playlist-generator/ and tested in scripts/playlist-generator.test.mjs.

/** Share of class time for each role, by class style. */
export const STYLES = {
  balanced: { warm: 0.12, build: 0.36, peak: 0.38, cool: 0.14 },
  high: { warm: 0.09, build: 0.26, peak: 0.55, cool: 0.10 },
  steady: { warm: 0.13, build: 0.52, peak: 0.20, cool: 0.15 },
};
export const ROLE_ORDER = ['warm', 'build', 'peak', 'cool'];
export const ROLE_LABEL = { warm: 'Warm-up', build: 'Build', peak: 'Peak', cool: 'Cool-down' };

/** Seeded random generator (mulberry32) so results can be reproduced in tests. */
export function makeRng(seed = Date.now()) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(list, rng) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function fmt(sec) {
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${r}` : `${m}:${r}`;
}

const sum = (list) => list.reduce((n, s) => n + s.sec, 0);

/**
 * Build one playlist.
 * @param {Array<{title:string, artist:string, sec:number, role:string, explicit?:boolean, id?:string}>} pool
 * @param {{ minutes:number, style?:keyof STYLES, clean?:boolean }} opts
 * @param {() => number} rng
 * @returns {{ songs: Array, total: number, target: number, diff: number }}
 */
export function generate(pool, opts, rng = Math.random) {
  const minutes = Math.min(120, Math.max(10, Number(opts.minutes) || 45));
  const target = Math.round(minutes * 60);
  const shares = STYLES[opts.style] || STYLES.balanced;
  const usable = pool.filter((s) => !(opts.clean && s.explicit));
  const byRole = {};
  for (const role of ROLE_ORDER) byRole[role] = usable.filter((s) => s.role === role);

  let best = null;
  const tries = 60;
  for (let attempt = 0; attempt < tries; attempt++) {
    // 1. Greedy fill each role towards its share of the class.
    const chosen = {};
    const spare = {};
    for (const role of ROLE_ORDER) {
      const want = target * shares[role];
      const list = shuffle(byRole[role], rng);
      chosen[role] = [];
      let t = 0;
      for (const song of list) {
        if (chosen[role].length && t + song.sec / 2 > want) break;
        chosen[role].push(song);
        t += song.sec;
      }
      spare[role] = list.filter((s) => !chosen[role].includes(s));
    }
    // 2. Hill-climb: swap, add or drop songs to get closer to the target.
    const all = () => ROLE_ORDER.flatMap((r) => chosen[r]);
    let total = sum(all());
    for (let pass = 0; pass < 400; pass++) {
      const diff = total - target;
      if (Math.abs(diff) <= 3) break;
      let move = null;
      let bestGain = 0;
      for (const role of ROLE_ORDER) {
        const cur = chosen[role];
        const sp = spare[role];
        // swap one chosen song for a spare song in the same role
        for (let i = 0; i < cur.length; i++) {
          for (let j = 0; j < sp.length; j++) {
            const nd = Math.abs(diff - cur[i].sec + sp[j].sec);
            const gain = Math.abs(diff) - nd;
            if (gain > bestGain) { bestGain = gain; move = { type: 'swap', role, i, j }; }
          }
        }
        // add a song to a middle role, or drop one (never below one per role)
        if (role === 'build' || role === 'peak') {
          for (let j = 0; j < sp.length; j++) {
            const gain = Math.abs(diff) - Math.abs(diff + sp[j].sec);
            if (gain > bestGain) { bestGain = gain; move = { type: 'add', role, j }; }
          }
          if (cur.length > 1) {
            for (let i = 0; i < cur.length; i++) {
              const gain = Math.abs(diff) - Math.abs(diff - cur[i].sec);
              if (gain > bestGain) { bestGain = gain; move = { type: 'drop', role, i }; }
            }
          }
        }
      }
      if (!move) break;
      const cur = chosen[move.role];
      const sp = spare[move.role];
      if (move.type === 'swap') {
        const out = cur[move.i];
        cur[move.i] = sp[move.j];
        sp[move.j] = out;
      } else if (move.type === 'add') {
        cur.push(sp.splice(move.j, 1)[0]);
      } else {
        sp.push(cur.splice(move.i, 1)[0]);
      }
      total = sum(all());
    }
    const diff = total - target;
    if (!best || Math.abs(diff) < Math.abs(best.diff)) best = { chosen, total, diff };
    // Close enough: stop early so each Regenerate gives a different mix.
    if (Math.abs(diff) <= 10) break;
  }

  // 3. Order: warm-up, builds rising into peaks, peaks in the middle, one build to come down, cool-down.
  // Within each role, tempo climbs on the way up and falls on the way down.
  const c = best.chosen;
  const up = (x, y) => (x.bpm || 0) - (y.bpm || 0);
  const builds = c.build.slice().sort(up);
  const tail = builds.length > 1 ? [builds.shift()] : [];
  const songs = [...c.warm.slice().sort(up), ...builds, ...c.peak.slice().sort(up), ...tail, ...c.cool.slice().sort(up).reverse()];
  return { songs, total: best.total, target, diff: best.diff };
}

/** Plain text for the Notes app: numbered titles, artists, durations and the total. */
export function toText(result, heading = 'Sculpt class playlist') {
  const lines = [`${heading} (${fmt(result.total)})`, ''];
  result.songs.forEach((s, i) => {
    lines.push(`${i + 1}. ${s.title} – ${s.artist} (${fmt(s.sec)})`);
  });
  lines.push('', `Total: ${fmt(result.total)}`);
  return lines.join('\n');
}

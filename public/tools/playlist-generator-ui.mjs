// UI for the sculpt playlist generator on /blog/sculpt-playlist-generator/.
import { generate, toText, fmt, ROLE_LABEL } from './playlist-generator.mjs';
import { SONGS } from './sculpt-song-pool.mjs';

const root = document.getElementById('sc-gen');
if (root) {
  const minutesInput = root.querySelector('#sc-gen-minutes');
  const list = root.querySelector('.sc-gen-list');
  const totalEl = root.querySelector('.sc-gen-total span:last-child');
  const status = root.querySelector('.sc-gen-status');
  const output = root.querySelector('#sc-gen-text');
  const clean = root.querySelector('#sc-gen-clean');
  let style = 'balanced';

  const setPills = (group, value) => {
    root.querySelectorAll(`[data-${group}]`).forEach((b) => {
      const on = b.getAttribute(`data-${group}`) === String(value);
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  };

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function render() {
    const minutes = Math.min(120, Math.max(10, parseInt(minutesInput.value, 10) || 45));
    const result = generate(SONGS, { minutes, style, clean: clean.checked });
    list.innerHTML = result.songs
      .map((s) => {
        const title = s.id ? `<a href="https://open.spotify.com/track/${s.id}" target="_blank" rel="noopener">${esc(s.title)}</a>` : esc(s.title);
        return `<li><span class="sc-song">${title}<span class="sc-role">${ROLE_LABEL[s.role]}</span><span class="sc-artist">${esc(s.artist)}</span></span><span class="sc-dur">${fmt(s.sec)}</span></li>`;
      })
      .join('');
    totalEl.textContent = fmt(result.total);
    const off = result.total - result.target;
    status.textContent = `${result.songs.length} songs for a ${minutes}-minute class, ${off === 0 ? 'right on time' : `${fmt(Math.abs(off))} ${off > 0 ? 'over' : 'under'}`}.`;
    output.textContent = toText(result, `Sculpt playlist · ${minutes} min`);
  }

  root.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.minutes) { minutesInput.value = t.dataset.minutes; setPills('minutes', t.dataset.minutes); render(); }
    if (t.dataset.style) { style = t.dataset.style; setPills('style', style); render(); }
    if (t.dataset.action === 'regen') render();
  });
  minutesInput.addEventListener('change', () => { setPills('minutes', minutesInput.value); render(); });
  clean.addEventListener('change', render);
  render();
}

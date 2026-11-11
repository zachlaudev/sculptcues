// Cloudflare Pages Function. Bind a NEW KV namespace as FEATURE_REQUESTS.
// Do not reuse or delete the mailing-list namespace (SUBSCRIBERS / sculptcues-subscribers).
// Email is sent only when a send_email binding named EMAIL is already configured.
// This function does not change DNS or MX records.

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HANDLE = /^@?[A-Za-z0-9._]{1,40}$/;

function clean(value, max) {
  return String(value ?? '').trim().slice(0, max);
}

function optionalUrl(value) {
  const v = clean(value, 300);
  if (!v) return '';
  try {
    const url = new URL(v);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.toString();
  } catch {
    return null;
  }
}

function optionalHandle(value) {
  const v = clean(value, 40);
  if (!v) return '';
  return HANDLE.test(v) ? v.replace(/^@/, '') : null;
}

async function notify(env, record) {
  if (!env.EMAIL || typeof env.EMAIL.send !== 'function') return false;
  try {
    const { EmailMessage } = await import('cloudflare:email');
    const lines = [
      `Name: ${record.name}`,
      `Email: ${record.email}`,
      record.instagram ? `Instagram: @${record.instagram}` : '',
      record.tiktok ? `TikTok: @${record.tiktok}` : '',
      record.video ? `Video: ${record.video}` : '',
      record.playlist ? `Playlist: ${record.playlist}` : '',
      record.website ? `Website: ${record.website}` : '',
      record.message ? `Message: ${record.message}` : '',
      `Submitted: ${record.createdAt}`,
    ].filter(Boolean);
    const raw = [
      'From: Sculpt Cues <hello@sculptcues.com>',
      'To: hello@sculptcues.com',
      'Subject: Featured Flow request',
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      '',
      lines.join('\n'),
    ].join('\r\n');
    await env.EMAIL.send(new EmailMessage('hello@sculptcues.com', 'hello@sculptcues.com', raw));
    return true;
  } catch {
    return false;
  }
}

export async function onRequestPost({ request, env }) {
  if (!env.FEATURE_REQUESTS) {
    return json({ ok: false, error: 'Feature requests are not configured yet.' }, 503);
  }

  let body = {};
  const type = request.headers.get('content-type') || '';
  try {
    body = type.includes('application/json') ? await request.json() : Object.fromEntries(await request.formData());
  } catch {
    return json({ ok: false, error: 'Please check the form and try again.' }, 400);
  }

  if (clean(body.company, 200)) return json({ ok: true, notified: false });

  const name = clean(body.name, 80);
  const email = clean(body.email, 120).toLowerCase();
  const instagram = optionalHandle(body.instagram);
  const tiktok = optionalHandle(body.tiktok);
  const video = optionalUrl(body.video);
  const playlist = optionalUrl(body.playlist);
  const website = optionalUrl(body.website);
  const message = clean(body.message, 1000);
  const consent = body.consent === true || body.consent === 'on' || body.consent === 'true';

  if (!name) return json({ ok: false, error: 'Please enter your name.' }, 400);
  if (!EMAIL.test(email)) return json({ ok: false, error: 'Please enter a valid email.' }, 400);
  if (instagram === null || tiktok === null) return json({ ok: false, error: 'Please check the handles.' }, 400);
  if (video === null || playlist === null || website === null) {
    return json({ ok: false, error: 'Links need to start with https://.' }, 400);
  }
  if (!consent) return json({ ok: false, error: 'Please agree that we may contact you.' }, 400);

  const createdAt = new Date().toISOString();
  const id = `req:${createdAt}:${crypto.randomUUID()}`;
  const record = { name, email, instagram, tiktok, video, playlist, website, message, consent: true, createdAt, source: 'features' };
  await env.FEATURE_REQUESTS.put(id, JSON.stringify(record));
  const notified = await notify(env, record);
  return json({ ok: true, notified });
}

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
  let v = clean(value, 300);
  if (!v) return '';
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  try {
    const url = new URL(v);
    if (url.protocol !== 'http:' && url.protocol !== 'https:' || !url.hostname.includes('.')) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function photoPayload(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  const match = /^data:image\/(png|jpeg|jpg|webp|gif);base64,([A-Za-z0-9+/=\s]+)$/i.exec(raw);
  if (!match) return null;
  const b64 = match[2].replace(/\s/g, '');
  let bytes;
  try { bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)); }
  catch { return null; }
  if (!bytes.length || bytes.length > 2 * 1024 * 1024) return null;
  const type = match[1].toLowerCase() === 'jpg' ? 'jpeg' : match[1].toLowerCase();
  return { contentType: `image/${type}`, base64: b64 };
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
  const photo = photoPayload(body.photo);
  const photoConsent = body.photoConsent === true || body.photoConsent === 'on' || body.photoConsent === 'true';

  if (!name) return json({ ok: false, error: 'Please enter your name.' }, 400);
  if (!EMAIL.test(email)) return json({ ok: false, error: 'Please enter a valid email.' }, 400);
  if (instagram === null || tiktok === null) return json({ ok: false, error: 'Please check the handles.' }, 400);
  if (video === null || playlist === null || website === null) {
    return json({ ok: false, error: 'Please check that link.' }, 400);
  }
  if (body.photo && photo === null) return json({ ok: false, error: 'Use a JPG, PNG, or WebP under 2 MB.' }, 400);
  if (photo && !photoConsent) return json({ ok: false, error: 'Please confirm you own this photo.' }, 400);

  const createdAt = new Date().toISOString();
  const id = `req:${createdAt}:${crypto.randomUUID()}`;
  const photoKey = photo ? `photo:${id}` : '';
  const record = {
    name, email, instagram, tiktok, video, playlist, website, message,
    consent_contact: true,
    consent_contact_at: createdAt,
    photoKey,
    photo_consent: { accepted: Boolean(photo) && photoConsent, at: photo && photoConsent ? createdAt : null },
    createdAt,
    source: 'features',
  };
  if (photo) await env.FEATURE_REQUESTS.put(photoKey, JSON.stringify(photo));
  await env.FEATURE_REQUESTS.put(id, JSON.stringify(record));
  const notified = await notify(env, record);
  return json({ ok: true, id, notified });
}

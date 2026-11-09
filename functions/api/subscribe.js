// Cloudflare Pages Function. Bind a KV namespace as SUBSCRIBERS on the Pages project.

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
  if (!env.SUBSCRIBERS) {
    return json({ ok: false, error: 'Signup storage is not configured.' }, 503);
  }

  let email = '';
  let trap = '';
  const type = request.headers.get('content-type') || '';
  try {
    if (type.includes('application/json')) {
      const body = await request.json();
      email = String(body.email || '');
      trap = String(body.company || '');
    } else {
      const form = await request.formData();
      email = String(form.get('email') || '');
      trap = String(form.get('company') || '');
    }
  } catch {
    return json({ ok: false, error: 'Please enter a valid email.' }, 400);
  }

  if (trap.trim()) return json({ ok: true });

  email = email.trim().toLowerCase();
  if (!EMAIL.test(email)) return json({ ok: false, error: 'Please enter a valid email.' }, 400);

  await env.SUBSCRIBERS.put(email, JSON.stringify({
    email,
    createdAt: new Date().toISOString(),
    source: 'website',
  }));
  return json({ ok: true });
}

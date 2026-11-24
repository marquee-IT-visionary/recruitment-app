const ALLOWED_ORIGINS = ['https://marquee-it-visionary.github.io', 'http://127.0.0.1:5173'];
const SESSION_MS = 30 * 60 * 1000;
const enc = new TextEncoder();
const dec = new TextDecoder();

const b64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const unb64 = (str) => Uint8Array.from(atob(str), (c) => c.charCodeAt(0));

async function sha(value) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(value)));
}

async function safeEqual(a, b) {
  const [x, y] = await Promise.all([sha(a), sha(b)]);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

async function aesKey(env) {
  return crypto.subtle.importKey('raw', unb64(env.ENC_KEY), 'AES-GCM', false, ['encrypt', 'decrypt']);
}

async function encrypt(env, text) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await aesKey(env), enc.encode(text));
  return `${b64(iv)}.${b64(data)}`;
}

async function decrypt(env, stored) {
  const [iv, data] = stored.split('.');
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(iv) }, await aesKey(env), unb64(data));
  return dec.decode(plain);
}

async function hmacKey(env) {
  return crypto.subtle.importKey('raw', enc.encode(env.ENC_KEY), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function makeToken(env) {
  const payload = b64(enc.encode(JSON.stringify({ exp: Date.now() + SESSION_MS })));
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(env), enc.encode(payload));
  return `${payload}.${b64(sig)}`;
}

async function checkToken(env, request) {
  const token = (request.headers.get('Authorization') || '').replace('Bearer ', '');
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const valid = await crypto.subtle.verify('HMAC', await hmacKey(env), unb64(sig), enc.encode(payload));
  return valid && JSON.parse(dec.decode(unb64(payload))).exp > Date.now();
}

async function loadCredentials(env) {
  const stored = await env.CONFIG.get('candidate');
  return stored ? JSON.parse(await decrypt(env, stored)) : null;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const allowed = ALLOWED_ORIGINS.includes(origin);
    const reply = (body, status = 200) =>
      new Response(status === 204 ? null : JSON.stringify(body), {
        status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
          'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          Vary: 'Origin'
        }
      });

    if (request.method === 'OPTIONS') return reply(null, 204);
    if (!allowed) return reply({ ok: false }, 403);

    const { pathname } = new URL(request.url);

    if (pathname === '/login' && request.method === 'POST') {
      let body;
      try {
        body = await request.json();
      } catch {
        return reply({ ok: false }, 400);
      }
      const username = String(body.username ?? '');
      const password = String(body.password ?? '');

      if (body.role === 'admin') {
        const ok = await safeEqual(password, env.ADMIN_PASSWORD);
        return ok ? reply({ ok: true, token: await makeToken(env) }) : reply({ ok: false }, 401);
      }

      const creds = await loadCredentials(env);
      const ok = creds && (await safeEqual(username, creds.username)) && (await safeEqual(password, creds.password));
      return reply({ ok: Boolean(ok) }, ok ? 200 : 401);
    }

    if (pathname === '/admin/credentials') {
      if (!(await checkToken(env, request))) return reply({ ok: false }, 401);

      if (request.method === 'GET') {
        const creds = (await loadCredentials(env)) || { username: '', password: '' };
        return reply({ ok: true, ...creds });
      }

      if (request.method === 'PUT') {
        const body = await request.json();
        const username = String(body.username ?? '').trim();
        const password = String(body.password ?? '');
        if (!username || password.length < 8) return reply({ ok: false, error: 'Username required and password must be at least 8 characters' }, 400);
        await env.CONFIG.put('candidate', await encrypt(env, JSON.stringify({ username, password })));
        return reply({ ok: true });
      }
    }

    return reply({ ok: false }, 404);
  }
};

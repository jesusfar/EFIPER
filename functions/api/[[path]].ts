interface Env {
  DB: D1Database;
  SESSION_SECRET: string;
  APP_ORIGIN?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  FACEBOOK_CLIENT_ID?: string;
  FACEBOOK_CLIENT_SECRET?: string;
}

type Provider = 'google' | 'facebook';

const SESSION_COOKIE = 'efiper_session';
const OAUTH_STATE_COOKIE = 'efiper_oauth_state';
const SESSION_DAYS = 30;

export async function onRequest(context: any): Promise<Response> {
  const { request, env } = context as { request: Request; env: Env };
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/?/, '');

  try {
    if (request.method === 'GET' && path === 'health') return health(env);
    if (request.method === 'POST' && path === 'auth/register') return register(request, env);
    if (request.method === 'POST' && path === 'auth/login') return login(request, env);
    if (request.method === 'POST' && path === 'auth/logout') return logout(env);
    if (request.method === 'GET' && path === 'auth/me') return me(request, env);
    if (request.method === 'GET' && path === 'auth/oauth/google/start') return oauthStart(request, env, 'google');
    if (request.method === 'GET' && path === 'auth/oauth/google/callback') return oauthCallback(request, env, 'google');
    if (request.method === 'GET' && path === 'auth/oauth/facebook/start') return oauthStart(request, env, 'facebook');
    if (request.method === 'GET' && path === 'auth/oauth/facebook/callback') return oauthCallback(request, env, 'facebook');
    if (request.method === 'GET' && path === 'sync/pull') return syncPull(request, env);
    if (request.method === 'POST' && path === 'sync/push') return syncPush(request, env);

    return json({ error: 'Not found' }, 404);
  } catch (error) {
    if (error instanceof HttpError) return json({ error: error.message }, error.status);
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return json({ error: message }, 500);
  }
}

async function health(env: Env): Promise<Response> {
  try {
    const result = await env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('users', 'sessions', 'user_snapshots') ORDER BY name"
    ).all();
    return json({
      ok: true,
      tables: result.results?.map((row: any) => row.name) ?? [],
      hasSessionSecret: Boolean(env.SESSION_SECRET),
      hasGoogleClientId: Boolean(env.GOOGLE_CLIENT_ID),
      hasGoogleClientSecret: Boolean(env.GOOGLE_CLIENT_SECRET),
      hasFacebookClientId: Boolean(env.FACEBOOK_CLIENT_ID),
      hasFacebookClientSecret: Boolean(env.FACEBOOK_CLIENT_SECRET),
    });
  } catch (error) {
    return json({ ok: false, error: error instanceof Error ? error.message : 'Health check failed' }, 500);
  }
}

async function register(request: Request, env: Env): Promise<Response> {
  const body = await readJson(request);
  const email = normalizeEmail(body.email);
  const password = String(body.password ?? '');
  const displayName = cleanText(body.displayName, 80);

  if (!email) return json({ error: 'Email invalido.' }, 400);
  if (password.length < 8) return json({ error: 'La contrasena debe tener al menos 8 caracteres.' }, 400);

  const exists = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (exists) return json({ error: 'Ya existe una cuenta con ese email.' }, 409);

  const salt = randomId(24);
  const passwordHash = await hashPassword(password, salt);
  const now = Date.now();
  const userId = crypto.randomUUID();

  await env.DB.prepare(
    `INSERT INTO users (id, email, display_name, password_hash, password_salt, auth_provider, created_at, updated_at, last_login_at)
     VALUES (?, ?, ?, ?, ?, 'password', ?, ?, ?)`
  ).bind(userId, email, displayName || null, passwordHash, salt, now, now, now).run();

  return issueSession(env, userId, { id: userId, email, displayName, avatarUrl: null });
}

async function login(request: Request, env: Env): Promise<Response> {
  const body = await readJson(request);
  const email = normalizeEmail(body.email);
  const password = String(body.password ?? '');
  if (!email || !password) return json({ error: 'Email o contrasena invalidos.' }, 400);

  const user = await env.DB.prepare(
    'SELECT id, email, display_name, avatar_url, password_hash, password_salt FROM users WHERE email = ?'
  ).bind(email).first<any>();

  if (!user?.password_hash || !user?.password_salt) {
    return json({ error: 'Esta cuenta usa Google o Facebook para iniciar sesion.' }, 401);
  }

  const candidate = await hashPassword(password, user.password_salt);
  if (!timingSafeEqual(candidate, user.password_hash)) return json({ error: 'Email o contrasena invalidos.' }, 401);

  await env.DB.prepare('UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?')
    .bind(Date.now(), Date.now(), user.id).run();

  return issueSession(env, user.id, userDto(user));
}

async function logout(env: Env): Promise<Response> {
  return json({ ok: true }, 200, clearSessionHeaders(env));
}

async function me(request: Request, env: Env): Promise<Response> {
  const user = await requireUser(request, env);
  return json({ user });
}

async function syncPull(request: Request, env: Env): Promise<Response> {
  const user = await requireUser(request, env);
  const row = await env.DB.prepare('SELECT backup_json, exported_at, updated_at FROM user_snapshots WHERE user_id = ?')
    .bind(user.id).first<any>();
  if (!row) return json({ snapshot: null });
  return json({ snapshot: JSON.parse(row.backup_json), exportedAt: row.exported_at, updatedAt: row.updated_at });
}

async function syncPush(request: Request, env: Env): Promise<Response> {
  const user = await requireUser(request, env);
  const body = await readJson(request);
  const snapshot = body.snapshot;
  if (!snapshot || snapshot.app !== 'EFIPER') return json({ error: 'Snapshot invalido.' }, 400);

  const exportedAt = Number(snapshot.exportedAt || Date.now());
  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO user_snapshots (user_id, backup_json, exported_at, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       backup_json = excluded.backup_json,
       exported_at = excluded.exported_at,
       updated_at = excluded.updated_at`
  ).bind(user.id, JSON.stringify(snapshot), exportedAt, now).run();

  return json({ ok: true, exportedAt, updatedAt: now });
}

async function oauthStart(request: Request, env: Env, provider: Provider): Promise<Response> {
  const url = new URL(request.url);
  const origin = appOrigin(request, env);
  const state = randomId(32);
  const callbackUrl = `${origin}/api/auth/oauth/${provider}/callback`;

  const config = providerConfig(env, provider);
  if (!config.clientId || !config.clientSecret) {
    return json({ error: `Faltan credenciales OAuth para ${provider}.` }, 500);
  }

  const authUrl = provider === 'google'
    ? new URL('https://accounts.google.com/o/oauth2/v2/auth')
    : new URL('https://www.facebook.com/v19.0/dialog/oauth');

  authUrl.searchParams.set('client_id', config.clientId);
  authUrl.searchParams.set('redirect_uri', callbackUrl);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('scope', provider === 'google' ? 'openid email profile' : 'email,public_profile');
  if (provider === 'google') authUrl.searchParams.set('prompt', 'select_account');

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl.toString(),
      'Set-Cookie': cookie(OAUTH_STATE_COOKIE, state, env, { maxAge: 600, path: '/api/auth/oauth' }),
      'Cache-Control': 'no-store',
      'X-EFIPER-Origin': url.origin,
    },
  });
}

async function oauthCallback(request: Request, env: Env, provider: Provider): Promise<Response> {
  const url = new URL(request.url);
  const expectedState = getCookie(request, OAUTH_STATE_COOKIE);
  const receivedState = url.searchParams.get('state');
  const code = url.searchParams.get('code');
  const origin = appOrigin(request, env);

  if (!code || !expectedState || expectedState !== receivedState) {
    return redirectToAccount(origin, 'oauth_error');
  }

  try {
    const profile = provider === 'google'
      ? await googleProfile(env, code, `${origin}/api/auth/oauth/google/callback`)
      : await facebookProfile(env, code, `${origin}/api/auth/oauth/facebook/callback`);

    if (!profile.email) throw new Error(`OAuth profile from ${provider} did not include an email.`);

    const now = Date.now();
    let user = await env.DB.prepare(
      'SELECT id, email, display_name, avatar_url FROM users WHERE auth_provider = ? AND provider_user_id = ?'
    ).bind(provider, profile.providerUserId).first<any>();

    if (!user) {
      user = await env.DB.prepare('SELECT id, email, display_name, avatar_url FROM users WHERE email = ?')
        .bind(profile.email).first<any>();
    }

    if (user) {
      await env.DB.prepare(
        `UPDATE users SET display_name = COALESCE(?, display_name), avatar_url = COALESCE(?, avatar_url),
         auth_provider = ?, provider_user_id = ?, last_login_at = ?, updated_at = ? WHERE id = ?`
      ).bind(nullable(profile.displayName), nullable(profile.avatarUrl), provider, profile.providerUserId, now, now, user.id).run();
    } else {
      const userId = crypto.randomUUID();
      await env.DB.prepare(
        `INSERT INTO users (id, email, display_name, avatar_url, auth_provider, provider_user_id, created_at, updated_at, last_login_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(userId, profile.email, nullable(profile.displayName), nullable(profile.avatarUrl), provider, profile.providerUserId, now, now, now).run();
      user = { id: userId, email: profile.email, display_name: profile.displayName, avatar_url: profile.avatarUrl };
    }

    const response = await createSessionRedirect(env, user.id, `${origin}/#/cuenta?cloud=connected`);
    response.headers.append('Set-Cookie', cookie(OAUTH_STATE_COOKIE, '', env, { maxAge: 0, path: '/api/auth/oauth' }));
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'OAuth callback failed';
    console.error('EFIPER OAuth callback failed', { provider, message });
    return redirectToAccount(origin, 'oauth_error');
  }
}

async function googleProfile(env: Env, code: string, redirectUri: string) {
  const config = providerConfig(env, 'google');
  const token = await postForm('https://oauth2.googleapis.com/token', {
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (!res.ok) throw new Error('No se pudo leer el perfil de Google.');
  const profile: any = await res.json();
  return {
    providerUserId: String(profile.sub),
    email: normalizeEmail(profile.email),
    displayName: cleanText(profile.name, 80),
    avatarUrl: cleanText(profile.picture, 500),
  };
}

async function facebookProfile(env: Env, code: string, redirectUri: string) {
  const config = providerConfig(env, 'facebook');
  const tokenUrl = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
  tokenUrl.searchParams.set('client_id', config.clientId);
  tokenUrl.searchParams.set('client_secret', config.clientSecret);
  tokenUrl.searchParams.set('redirect_uri', redirectUri);
  tokenUrl.searchParams.set('code', code);
  const tokenRes = await fetch(tokenUrl);
  if (!tokenRes.ok) throw new Error('No se pudo completar login con Facebook.');
  const token: any = await tokenRes.json();

  const profileUrl = new URL('https://graph.facebook.com/me');
  profileUrl.searchParams.set('fields', 'id,name,email,picture');
  profileUrl.searchParams.set('access_token', token.access_token);
  const profileRes = await fetch(profileUrl);
  if (!profileRes.ok) throw new Error('No se pudo leer el perfil de Facebook.');
  const profile: any = await profileRes.json();
  return {
    providerUserId: String(profile.id),
    email: normalizeEmail(profile.email),
    displayName: cleanText(profile.name, 80),
    avatarUrl: cleanText(profile.picture?.data?.url, 500),
  };
}

async function issueSession(env: Env, userId: string, user: any): Promise<Response> {
  const token = randomId(48);
  const tokenHash = await hmac(token, env.SESSION_SECRET);
  const now = Date.now();
  const expiresAt = now + SESSION_DAYS * 24 * 60 * 60 * 1000;

  await env.DB.prepare('INSERT INTO sessions (id, user_id, token_hash, created_at, expires_at) VALUES (?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), userId, tokenHash, now, expiresAt).run();

  return json({ user }, 200, {
    'Set-Cookie': cookie(SESSION_COOKIE, token, env, { maxAge: SESSION_DAYS * 24 * 60 * 60, path: '/' }),
  });
}

async function createSessionRedirect(env: Env, userId: string, location: string): Promise<Response> {
  const token = randomId(48);
  const tokenHash = await hmac(token, env.SESSION_SECRET);
  const now = Date.now();
  const expiresAt = now + SESSION_DAYS * 24 * 60 * 60 * 1000;
  await env.DB.prepare('INSERT INTO sessions (id, user_id, token_hash, created_at, expires_at) VALUES (?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), userId, tokenHash, now, expiresAt).run();
  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      'Set-Cookie': cookie(SESSION_COOKIE, token, env, { maxAge: SESSION_DAYS * 24 * 60 * 60, path: '/' }),
    },
  });
}

async function requireUser(request: Request, env: Env) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) throw new HttpError('No autenticado.', 401);
  const tokenHash = await hmac(token, env.SESSION_SECRET);
  const now = Date.now();
  const row = await env.DB.prepare(
    `SELECT users.id, users.email, users.display_name, users.avatar_url
     FROM sessions JOIN users ON users.id = sessions.user_id
     WHERE sessions.token_hash = ? AND sessions.expires_at > ?`
  ).bind(tokenHash, now).first<any>();
  if (!row) throw new HttpError('Sesion vencida.', 401);
  return userDto(row);
}

function userDto(row: any) {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name ?? row.displayName ?? null,
    avatarUrl: row.avatar_url ?? row.avatarUrl ?? null,
  };
}

function providerConfig(env: Env, provider: Provider) {
  return provider === 'google'
    ? { clientId: env.GOOGLE_CLIENT_ID || '', clientSecret: env.GOOGLE_CLIENT_SECRET || '' }
    : { clientId: env.FACEBOOK_CLIENT_ID || '', clientSecret: env.FACEBOOK_CLIENT_SECRET || '' };
}

async function readJson(request: Request): Promise<any> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function normalizeEmail(value: unknown): string {
  const email = String(value ?? '').trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
}

function cleanText(value: unknown, max: number): string {
  return String(value ?? '').trim().slice(0, max);
}

function nullable(value: unknown): string | null {
  const text = String(value ?? '').trim();
  return text ? text : null;
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const material = await crypto.subtle.importKey('raw', enc(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: enc(salt), iterations: 120000 },
    material,
    256
  );
  return hex(new Uint8Array(bits));
}

async function hmac(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc(secret || 'dev-secret'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc(value));
  return hex(new Uint8Array(sig));
}

async function postForm(url: string, fields: Record<string, string>) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields),
  });
  if (!res.ok) throw new Error('No se pudo completar OAuth.');
  return res.json();
}

function enc(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

function hex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function randomId(bytes: number): string {
  const data = new Uint8Array(bytes);
  crypto.getRandomValues(data);
  return btoa(String.fromCharCode(...data)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function getCookie(request: Request, name: string): string {
  const raw = request.headers.get('Cookie') || '';
  return raw.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1) || '';
}

function cookie(name: string, value: string, env: Env, options: { maxAge: number; path: string }): string {
  const secure = env.APP_ORIGIN?.startsWith('http://localhost') ? '' : '; Secure';
  return `${name}=${value}; Path=${options.path}; Max-Age=${options.maxAge}; HttpOnly; SameSite=Lax${secure}`;
}

function clearSessionHeaders(env: Env): HeadersInit {
  return { 'Set-Cookie': cookie(SESSION_COOKIE, '', env, { maxAge: 0, path: '/' }) };
}

function appOrigin(request: Request, env: Env): string {
  return env.APP_ORIGIN || new URL(request.url).origin;
}

function redirectToAccount(origin: string, status: string): Response {
  return Response.redirect(`${origin}/#/cuenta?cloud=${encodeURIComponent(status)}`, 302);
}

function json(data: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}

class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

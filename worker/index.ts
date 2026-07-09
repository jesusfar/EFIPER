import { onRequest } from '../functions/api/[[path]]';

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  SESSION_SECRET: string;
  APP_ORIGIN?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  FACEBOOK_CLIENT_ID?: string;
  FACEBOOK_CLIENT_SECRET?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      return onRequest({ request, env, ctx });
    }

    const res = await env.ASSETS.fetch(request);

    // Los archivos en /assets/ llevan hash de contenido en el nombre → son inmutables:
    // se pueden cachear agresivamente durante 1 año. El resto (HTML, sw.js, íconos)
    // conserva los headers por defecto para no interferir con la actualización del SW.
    if (res.ok && url.pathname.startsWith('/assets/')) {
      const headers = new Headers(res.headers);
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
    }

    return res;
  },
};

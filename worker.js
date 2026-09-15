/**
 * worker.js — entry point for a traditional Cloudflare Worker deployment
 * (wrangler deploy), as opposed to Cloudflare Pages.
 *
 * This worker has no server-side OSINT logic of its own — the search
 * engine runs entirely in the browser (app.js). This file only serves
 * the static files in /public via the Workers Static Assets binding
 * and adds a couple of safe default headers.
 */

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    // Clona a resposta para poder ajustar headers (a original é imutável)
    const headers = new Headers(response.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "no-referrer");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

import type { APIRoute } from 'astro';
// robots.txt uses the `site` URL from astro.config.mjs (TODO: set the real domain there).
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });

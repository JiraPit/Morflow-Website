import type { APIRoute } from 'astro';
import { withBase } from '../lib/content';
import { useCases, useCasePath } from '../content/usecases';

/**
 * /sitemap.xml for search engines (submitted in Google Search Console and
 * named in robots.txt). Lists every public page; use cases come from
 * src/content/usecases.ts, so a new use case is included automatically.
 */
export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://morflow.org');
  const newest = useCases.map((u) => u.updated).sort().at(-1);
  const pages: { path: string; lastmod?: string }[] = [
    { path: '/' },
    { path: '/doc' },
    { path: '/usecases', lastmod: newest },
    ...useCases.map((u) => ({ path: useCasePath(u.slug), lastmod: u.updated })),
  ];
  const urls = pages
    .map(({ path, lastmod }) => {
      const loc = new URL(withBase(path), origin).href;
      return `  <url>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`;
    })
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

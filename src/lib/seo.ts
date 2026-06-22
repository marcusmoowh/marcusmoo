import { useEffect } from 'react';
import seo from '../content/seo.json';

export type SeoOptions = {
  title?: string;
  description?: string;
  image?: string; // path ("/og/x.jpg") or absolute URL
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
  canonicalPath?: string; // defaults to current pathname
  jsonLd?: object | object[];
};

const site = seo.site;
const routes = seo.routes as Record<string, { title?: string; description?: string }>;

const base = () =>
  ((import.meta.env.VITE_SITE_URL as string) || (typeof window !== 'undefined' ? window.location.origin : ''))
    .replace(/\/$/, '');

function upsertMeta(attr: 'property' | 'name', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// Per-route SEO: title, description, canonical, Open Graph, Twitter card and
// optional JSON-LD. Googlebot renders JS, so these are picked up on crawl; the
// most important routes are ALSO prerendered into static HTML at build time.
export function useSeo(opts: SeoOptions = {}) {
  useEffect(() => {
    const path = opts.canonicalPath ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
    const route = routes[path] || {};
    const title = opts.title || route.title || site.title;
    const description = opts.description || route.description || site.description;
    const url = base() + path;
    const imgPath = opts.image || site.image;
    const image = imgPath.startsWith('http') ? imgPath : base() + imgPath;

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', opts.noindex ? 'noindex,nofollow' : 'index,follow');
    upsertLink('canonical', url);

    upsertMeta('property', 'og:site_name', site.name);
    upsertMeta('property', 'og:type', opts.type || 'website');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:locale', site.locale);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);

    document.head.querySelectorAll('script[data-seo-jsonld]').forEach((n) => n.remove());
    const blocks = opts.jsonLd ? (Array.isArray(opts.jsonLd) ? opts.jsonLd : [opts.jsonLd]) : [];
    blocks.forEach((b) => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-seo-jsonld', '');
      s.textContent = JSON.stringify(b);
      document.head.appendChild(s);
    });
  }, [JSON.stringify(opts)]);
}

export const siteOrigin = base;

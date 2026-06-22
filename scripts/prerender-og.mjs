// Post-build SEO + social step. After `vite build` this:
//   1. injects per-post Open Graph / Twitter tags + BlogPosting JSON-LD into
//      static HTML at dist/blog/<slug>/index.html (crawlers don't run JS),
//   2. prerenders the main routes (/, /blog, /travel) with their own titles
//      and descriptions,
//   3. writes dist/sitemap.xml and dist/robots.txt.
//
// Set your real domain so URLs/images are absolute (LinkedIn + Google need it):
//   SITE_URL=https://www.marcusmoowh.com npm run build
// or put VITE_SITE_URL=https://www.marcusmoowh.com in .env.production

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const SRC = path.join(ROOT, 'src', 'content');

function readEnvVar(name) {
  for (const file of ['.env', '.env.production']) {
    try {
      const env = fs.readFileSync(path.join(ROOT, file), 'utf8');
      const m = env.match(new RegExp(`^${name}\\s*=\\s*(.+)$`, 'm'));
      if (m) return m[1].trim().replace(/^["']|["']$/g, '');
    } catch {
      /* file may not exist; try next */
    }
  }
  return '';
}

const PLACEHOLDER = 'https://www.marcusmoowh.com';
let SITE_URL = (process.env.SITE_URL || readEnvVar('VITE_SITE_URL') || '').replace(/\/$/, '');
if (!SITE_URL) {
  SITE_URL = PLACEHOLDER;
  console.warn(
    '\n[prerender] No SITE_URL / VITE_SITE_URL set — defaulting to https://www.marcusmoowh.com.\n'
  );
}

const seo = JSON.parse(fs.readFileSync(path.join(SRC, 'seo.json'), 'utf8'));
const today = new Date().toISOString().slice(0, 10);

const escHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => escHtml(s).replace(/"/g, '&quot;');
const unq = (s) => (s || '').replace(/\\'/g, "'").replace(/\\\\/g, '\\');

// ---- parse content (no extra deps) ----
function parsePosts() {
  const src = fs.readFileSync(path.join(SRC, 'posts.ts'), 'utf8');
  const marks = [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => ({ slug: m[1], at: m.index }));
  return marks.map((mk, i) => {
    const chunk = src.slice(mk.at, i + 1 < marks.length ? marks[i + 1].at : src.length);
    const pick = (re, d = '') => (chunk.match(re) || [null, d])[1];
    const tags = [...((chunk.match(/tags:\s*\[([^\]]*)\]/) || [null, ''])[1].matchAll(/'([^']+)'/g))].map((m) => m[1]);
    return {
      slug: mk.slug,
      title: unq(pick(/title:\s*'((?:[^'\\]|\\.)*)'/, mk.slug)),
      excerpt: unq(pick(/excerpt:\s*'((?:[^'\\]|\\.)*)'/)),
      date: pick(/date:\s*'([^']+)'/, today),
      cover: pick(/cover:\s*'([^']+)'/, '/photos/feature.jpg'),
      tags,
    };
  });
}

function parseTravel() {
  const src = fs.readFileSync(path.join(SRC, 'travel.ts'), 'utf8');
  const re = /(?:slug:\s*'([^']+)',\s*name:)|(?:slug:\s*'([^']+)',\s*title:)/g;
  const urls = [];
  let m, current = null;
  while ((m = re.exec(src))) {
    if (m[1]) { current = m[1]; urls.push(`/travel/${current}`); }
    else if (m[2] && current) { urls.push(`/travel/${current}/${m[2]}`); }
  }
  return urls;
}

// ---- html helpers ----
const setTitle = (h, t) => h.replace(/<title>[\s\S]*?<\/title>/, `<title>${escHtml(t)}</title>`);
const setMeta = (h, attr, key, val) => {
  const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`);
  return re.test(h) ? h.replace(re, `$1${escAttr(val)}$2`) : h;
};
const setCanonical = (h, href) => h.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${escAttr(href)}$2`);
const injectHead = (h, snippet) => h.replace('</head>', `${snippet}\n  </head>`);

function applyMeta(shell, { title, description, url, image, type }) {
  let h = shell;
  h = setTitle(h, title);
  h = setCanonical(h, url);
  h = setMeta(h, 'name', 'description', description);
  h = setMeta(h, 'property', 'og:type', type);
  h = setMeta(h, 'property', 'og:title', type === 'article' ? title.replace(/ — Marcus Moo$/, '') : title);
  h = setMeta(h, 'property', 'og:description', description);
  h = setMeta(h, 'property', 'og:image', image);
  h = setMeta(h, 'property', 'og:url', url);
  h = setMeta(h, 'name', 'twitter:title', title);
  h = setMeta(h, 'name', 'twitter:description', description);
  h = setMeta(h, 'name', 'twitter:image', image);
  return h;
}

function write(file, html) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

function main() {
  const shellPath = path.join(DIST, 'index.html');
  if (!fs.existsSync(shellPath)) {
    console.error('[prerender] dist/index.html not found — run `vite build` first.');
    process.exit(1);
  }
  let shell = fs.readFileSync(shellPath, 'utf8');
  if (SITE_URL !== PLACEHOLDER) shell = shell.split(PLACEHOLDER).join(SITE_URL);

  const posts = parsePosts();
  const travelUrls = parseTravel();
  const sitemap = [];
  const addUrl = (loc, lastmod, priority) => sitemap.push({ loc, lastmod, priority });

  // --- main routes ---
  const home = seo.routes['/'];
  write(shellPath, applyMeta(shell, { title: home.title, description: home.description, url: `${SITE_URL}/`, image: `${SITE_URL}${seo.site.image}`, type: 'website' }));
  addUrl(`${SITE_URL}/`, today, '1.0');

  const blog = seo.routes['/blog'];
  write(path.join(DIST, 'blog', 'index.html'), applyMeta(shell, { title: blog.title, description: blog.description, url: `${SITE_URL}/blog`, image: `${SITE_URL}${seo.site.image}`, type: 'website' }));
  addUrl(`${SITE_URL}/blog`, today, '0.8');

  const travel = seo.routes['/travel'];
  write(path.join(DIST, 'travel', 'index.html'), applyMeta(shell, { title: travel.title, description: travel.description, url: `${SITE_URL}/travel`, image: `${SITE_URL}${seo.site.image}`, type: 'website' }));
  addUrl(`${SITE_URL}/travel`, today, '0.8');

  // --- posts ---
  for (const p of posts) {
    const url = `${SITE_URL}/blog/${p.slug}`;
    const card = fs.existsSync(path.join(DIST, 'og', `${p.slug}.jpg`)) ? `/og/${p.slug}.jpg` : p.cover;
    const image = card.startsWith('http') ? card : `${SITE_URL}${card}`;
    let html = applyMeta(shell, { title: `${p.title} — Marcus Moo`, description: p.excerpt, url, image, type: 'article' });
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.excerpt,
      image,
      datePublished: p.date,
      dateModified: p.date,
      author: { '@type': 'Person', name: 'Marcus Moo', url: SITE_URL },
      publisher: { '@type': 'Person', name: 'Marcus Moo' },
      mainEntityOfPage: url,
      keywords: p.tags.join(', '),
    };
    html = injectHead(html, `    <script type="application/ld+json">${JSON.stringify(ld)}</script>`);
    write(path.join(DIST, 'blog', p.slug, 'index.html'), html);
    addUrl(url, p.date, '0.7');
  }

  // --- travel country + trip pages ---
  for (const u of travelUrls) addUrl(`${SITE_URL}${u}`, today, u.split('/').length > 3 ? '0.5' : '0.6');

  // --- sitemap.xml + robots.txt ---
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    sitemap
      .map((u) => `  <url><loc>${escHtml(u.loc)}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`)
      .join('\n') +
    '\n</urlset>\n';
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml);
  fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

  console.log(`[prerender] origin ${SITE_URL}`);
  console.log(`  routes: / /blog /travel`);
  console.log(`  posts: ${posts.length} (OG + BlogPosting JSON-LD)`);
  console.log(`  sitemap.xml: ${sitemap.length} URLs + robots.txt`);
}

main();

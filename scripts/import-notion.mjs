// Pulls posts from a Notion database and writes them into src/content/notion-posts.json,
// which posts.ts merges with the hand-written posts. Notion-hosted images (cover + inline)
// are downloaded into public/notion/ so they don't expire.
//
// Setup: see the "Notion side" instructions. Needs env NOTION_TOKEN and NOTION_DATABASE_ID
// (put them in a .env file or pass inline). Run with:  npm run import:notion
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

const TOKEN = process.env.NOTION_TOKEN;
const DB = process.env.NOTION_DATABASE_ID;
if (!TOKEN || !DB) {
  console.warn('• Notion creds not set (NOTION_TOKEN / NOTION_DATABASE_ID) — skipping import, keeping existing posts.');
  process.exit(0); // don't block dev/build
}

const OUT_JSON = 'src/content/notion-posts.json';
const IMG_DIR = 'public/notion';

const notion = new Client({ auth: TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

const slugify = (s) =>
  s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
   .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');

const plain = (rich = []) => rich.map((r) => r.plain_text).join('').trim();
const isNotionFile = (u) => /amazonaws\.com|notion-static\.com|prod-files-secure|secure\.notion/.test(u);

// find a property by candidate names (case-insensitive), return its raw object
const prop = (props, names) => {
  const keys = Object.keys(props);
  for (const n of names) {
    const hit = keys.find((k) => k.toLowerCase() === n.toLowerCase());
    if (hit) return props[hit];
  }
  return undefined;
};
const titleOf = (props) => {
  const t = Object.values(props).find((v) => v?.type === 'title');
  return t ? plain(t.title) : '';
};

// Tags can be named a few ways and stored as different Notion property types.
const TAG_NAMES = ['Tags', 'Tag', 'Topics', 'Topic', 'Categories', 'Category', 'Keywords', 'Labels', 'Themes'];
const extractTags = (props) => {
  const c = prop(props, TAG_NAMES);
  if (!c) return [];
  if (c.type === 'multi_select') return (c.multi_select || []).map((t) => t.name);
  if (c.type === 'select') return c.select ? [c.select.name] : [];
  if (c.type === 'status') return c.status ? [c.status.name] : [];
  if (c.type === 'rich_text') return plain(c.rich_text).split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
  return [];
};

async function download(url, base) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : ct.includes('gif') ? 'gif' : ct.includes('svg') ? 'svg' : 'jpg';
    await fs.mkdir(IMG_DIR, { recursive: true });
    const file = `${base}.${ext}`;
    await fs.writeFile(path.join(IMG_DIR, file), Buffer.from(await res.arrayBuffer()));
    return `/notion/${file}`;
  } catch {
    return null;
  }
}

// download any Notion-hosted images referenced in the markdown and rewrite to local paths
async function localizeImages(md, slug) {
  const re = /!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
  let m, i = 0;
  const jobs = [];
  while ((m = re.exec(md))) {
    const [full, alt, url] = m;
    if (isNotionFile(url)) {
      const idx = i++;
      jobs.push((async () => {
        const local = await download(url, `${slug}-${idx}`);
        if (local) md = md.replace(full, `![${alt}](${local})`);
      })());
    }
  }
  await Promise.all(jobs);
  return md;
}

async function run() {
  // fetch every page (paginated); filter/sort in code so a missing property never errors
  const pages = [];
  let cursor;
  do {
    const res = await notion.databases.query({ database_id: DB, start_cursor: cursor, page_size: 100 });
    pages.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);

  if (pages[0]) {
    const schema = Object.entries(pages[0].properties).map(([k, v]) => `${k} (${v.type})`).join(', ');
    console.log('• Notion properties detected:', schema);
  }

  const out = [];
  for (const page of pages) {
    const props = page.properties || {};

    // Status: only import "Published" (skip if a Status select exists and isn't Published)
    const status = prop(props, ['Status'])?.select?.name;
    if (status && status.toLowerCase() !== 'published') continue;

    const title = titleOf(props) || 'Untitled';
    const slug = plain(prop(props, ['Slug'])?.rich_text || []) || slugify(title);
    const date = (prop(props, ['Date', 'Published', 'Publish Date'])?.date?.start || page.created_time).slice(0, 10);
    const excerpt = plain(prop(props, ['Excerpt', 'Summary', 'Description'])?.rich_text || []);
    const tags = extractTags(props);

    // cover: page cover, else a Cover files/url property
    let cover =
      page.cover?.external?.url || page.cover?.file?.url ||
      prop(props, ['Cover', 'Image'])?.files?.[0]?.external?.url ||
      prop(props, ['Cover', 'Image'])?.files?.[0]?.file?.url ||
      prop(props, ['Cover', 'Image'])?.url || '';
    if (cover && isNotionFile(cover)) cover = (await download(cover, `${slug}-cover`)) || cover;

    // body → markdown, then localize images
    const blocks = await n2m.pageToMarkdown(page.id);
    let body = n2m.toMarkdownString(blocks).parent || '';
    body = (await localizeImages(body, slug)).trim();

    out.push({ slug, title, date, excerpt, tags, ...(cover ? { cover } : {}), body });
    console.log(`  - ${title}: ${tags.length} tag(s)${tags.length ? ' [' + tags.join(', ') + ']' : ''}`);
  }

  out.sort((a, b) => b.date.localeCompare(a.date));
  await fs.writeFile(OUT_JSON, JSON.stringify(out, null, 2) + '\n');
  console.log(`✓ Imported ${out.length} Notion post(s) → ${OUT_JSON}`);
}

run().catch((e) => { console.warn('• Notion import skipped (' + (e.message || e) + ') — keeping existing posts.'); process.exit(0); });

# Marcus Moo — Portfolio (Vite + React + TypeScript)

A cinematic personal portfolio: a crystal phoenix that emerges from a swirl of rainbow particles and soars
through a cosmic blue → ember sky, rendered with **react-three-fiber** and **real bloom post-processing**,
wrapped around routed pages (About, Work, Travel, Philosophy, Blog, Contact).

## Run it

```bash
npm install
npm run dev      # start the dev server (Vite prints a localhost URL)
npm run build    # type-check + production build into /dist
npm run preview  # preview the production build
```

Requires Node 18+.

## Stack

- **Vite + React 18 + TypeScript**
- **three / @react-three/fiber / @react-three/drei** — 3D scene, GLB loading
- **@react-three/postprocessing** — Bloom + Vignette (the "true cinematic" glow)
- **react-router-dom** — multi-page routing
- **lenis** — smooth scrolling (drives the phoenix's flight)
- **react-markdown + remark-gfm** — blog/CMS content rendering

## Project map

```
public/models/phoenix.glb        your 3D model (with real textures)
src/
  three/            the cinematic 3D scene (Scene, Sky, Phoenix, Particles, shaders)
  sections/         the one-page scroll scenes:
                      Hero, About, Work, TravelSynopsis, Philosophy, Writing, Contact
  pages/            routed views:
                      Home (composes all sections)
                      TravelJournal (/travel)  Country (/travel/:country)  Trip (/travel/:country/:trip)
                      Blog (/blog)  BlogPost (/blog/:slug)  NotFound
  components/       Nav, Layout, Reveal, Parallax, Counter, ProgressBar, TravelMap
  content/          projects.ts, travel.ts (countries+trips), values.ts, posts.ts
  lib/              scroll state, Lenis + GSAP ScrollTrigger wiring
```

## How it's structured

- **Home is one continuous cinematic scroll.** The nav smooth-scrolls between scenes
  (About / Work / Travel / Philosophy / Journal / Contact) using Lenis. The phoenix's
  flight, the sky's blue→ember shift, and layered **GSAP ScrollTrigger** parallax are all
  driven by scroll position.
- **Travel breaks out into subpages.** The home keeps the map + synopsis; "Explore" opens
  `/travel` (full map) → `/travel/:country` (a montage of trips) → `/travel/:country/:trip`
  (the individual trip, rendered from markdown).
- **Blog breaks out too:** teased on the home, full list at `/blog`, posts at `/blog/:slug`.
- From any subpage, clicking a nav item routes home and scrolls to that scene.

## Where to edit your content

- **Projects** → `src/content/projects.ts`
- **Travel countries & trips** → `src/content/travel.ts`  (each country has a `trips[]` array)
- **Philosophy values** → `src/content/values.ts`
- **Blog posts** → `src/content/posts.ts`
- **Contact details** → `src/sections/Contact.tsx`

## Notes / knobs

- **Parallax / motion**: tune per-element depth via the `speed` prop on `<Parallax>`; global smoothing in `src/lib/useLenis.ts`.
- **Bloom**: tune in `src/three/Scene.tsx` (`intensity`, `luminanceThreshold`).
- **Ember timing / colours**: `src/three/shaders/sky.ts` (`u_scroll` thresholds, `emberLo`/`emberHi`).
- **Phoenix look & flap**: `src/three/shaders/phoenix.ts` (fresnel, alpha, flap amounts) and
  facing in `Phoenix.tsx` (`inner.rotation.y = -Math.PI/2`).
- **Flight path / closeness**: `src/three/journey.ts` and the camera in `Scene.tsx`.
- **Logos**: currently text wordmarks in `src/pages/About.tsx` — drop in official logo images when ready.
- **Contact form**: opens the visitor's mail app (mailto). For true server-side send, add Netlify/Cloudflare
  Forms on deploy, or a small serverless endpoint, and POST to it from `Contact.tsx`.

The model loads with its **real textures** here (no sandbox restriction), and the crystal shader is layered on top.


## Photos & logos

- **Your photos** live in `public/photos/` (feature.jpg + the gallery shots). Replace any file with a same-named image to swap it; the About section reads them by path.
- **Brand logos** in `public/logos/` are clean *placeholders* (uniform white wordmarks). They are not the official trademarks — drop in the official SVG/PNG from each brand's media/brand-resource page (keep the same filename, e.g. `samsung.svg`) and the logo wall updates automatically. White/transparent SVGs sit best on the dark wall.

## SEO & social sharing

Per-page SEO is driven by `src/content/seo.json` (site defaults + per-route titles/descriptions) and applied at runtime by `useSeo()` (`src/lib/seo.ts`): title, meta description, canonical, Open Graph, Twitter card, and JSON-LD (Person/WebSite in `index.html`, BlogPosting per post).

At build time `scripts/prerender-og.mjs` runs after `vite build` and writes crawler-visible static HTML (LinkedIn/Facebook/X/Google don't run JS):
- `dist/index.html`, `dist/blog/index.html`, `dist/travel/index.html` with their own meta
- `dist/blog/<slug>/index.html` with per-post OG tags + BlogPosting JSON-LD
- `dist/sitemap.xml` and `dist/robots.txt`

**Set your domain** (required for absolute OG/canonical URLs):
- add `VITE_SITE_URL=https://your-domain.com` to `.env`, or
- build with `SITE_URL=https://your-domain.com npm run build`

**Per-post share cards:** `public/og/<slug>.jpg` (1200×630) are used as `og:image`. Regenerate after adding/renaming posts with `python3 scripts/gen_og_images.py` (needs Pillow). After deploying, paste a post URL into LinkedIn's Post Inspector once to refresh its cache.

import { useEffect, useRef, useState } from 'react';
import { setIntroOffset } from '../lib/scroll';

const EXPAND = 1.2; // viewport-heights of scroll needed to fully expand

type Props = {
  bg: string; // full-screen background (the mountain) — fades/clips away on scroll
  titleA?: string;
  titleB?: string;
  tagline?: string;
  hint?: string;
};

// Cinematic opener. A rounded-rect "window" is cut into the mountain backdrop and
// expands as you scroll, revealing the live 3D phoenix sky behind it. At full
// expansion the backdrop is gone and the scene hands off straight into the site.
//
// Implemented as a FIXED stage (not sticky — sticky is unreliable under the page's
// `overflow-x: hidden`, which was hiding the intro entirely).
export function ScrollExpandIntro({
  bg,
  titleA = 'Marcus',
  titleB = 'Moo',
  tagline = 'APAC Technology Evangelist',
  hint = 'Scroll to explore',
}: Props) {
  const [p, setP] = useState(0);
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);
  const [vh, setVh] = useState(typeof window !== 'undefined' ? window.innerHeight : 900);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const dist = reduced.current ? 1 : EXPAND * (window.innerHeight || 1);
      setP(Math.min(1, Math.max(0, window.scrollY / dist)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute); };
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
      setIntroOffset(reduced.current ? 0 : EXPAND * window.innerHeight);
      compute();
    };
    onResize();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
      setIntroOffset(0);
    };
  }, []);

  const mobile = vw < 768;
  // panel (window) size grows with scroll; at p=1 it exceeds the viewport
  const pw = 300 + p * (mobile ? Math.max(vw * 0.96 - 300, 320) : 1180);
  const ph = 380 + p * (mobile ? 300 : 380);
  const x = (vw - pw) / 2;
  const y = (vh - ph) / 2;
  const r = Math.max(0, Math.min(20, pw / 2, ph / 2));
  const outer = `M0 0 H${vw} V${vh} H0 Z`;
  const inner =
    `M${x + r} ${y} H${x + pw - r} A${r} ${r} 0 0 1 ${x + pw} ${y + r} ` +
    `V${y + ph - r} A${r} ${r} 0 0 1 ${x + pw - r} ${y + ph} ` +
    `H${x + r} A${r} ${r} 0 0 1 ${x} ${y + ph - r} ` +
    `V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;
  const clip = `path(evenodd, "${outer} ${inner}")`;

  const tx = p * (mobile ? 22 : 15); // vw the words drift apart
  const drop = (from: number, span: number) => Math.max(0, 1 - Math.max(0, p - from) / span);
  const titleFade = drop(0.6, 0.32);
  const stageFade = drop(0.86, 0.14);
  const fade = (m: number) => Math.max(0, 1 - p * m);

  return (
    <>
      <div className="sxi-spacer" aria-hidden />
      <section
        className="sxi-stage"
        aria-label={`${titleA} ${titleB} — ${tagline}`}
        style={{ opacity: stageFade, visibility: p >= 1 ? 'hidden' : 'visible' }}
      >
        <div
          className="sxi-mountain"
          style={{ clipPath: clip, WebkitClipPath: clip }}
        >
          <img src={bg} alt="" draggable={false} />
          <div className="sxi-mountain-tint" />
        </div>

        <div
          className="sxi-frame"
          style={{ width: pw, height: ph, opacity: drop(0.7, 0.3) }}
        />

        <h1 className="sxi-title" style={{ opacity: titleFade }}>
          <span style={{ transform: `translateX(-${tx}vw)` }}>{titleA}</span>
          <span style={{ transform: `translateX(${tx}vw)` }}>{titleB}</span>
        </h1>
        <p className="sxi-tagline" style={{ opacity: Math.min(titleFade, fade(1.3)) }}>{tagline}</p>
        <div className="sxi-hint" style={{ opacity: fade(2.6) }}>
          <span>{hint}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
        </div>
      </section>
    </>
  );
}

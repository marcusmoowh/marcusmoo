import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLenis, setProgressFromWindow } from './scroll';

gsap.registerPlugin(ScrollTrigger);

// Smooth scrolling (Lenis) wired to GSAP ScrollTrigger + the 3D scroll state.
export function useLenis() {
  useEffect(() => {
    // Always open at the very top (Hero). Browsers otherwise restore the last
    // scroll position on reload, which made the site load partway down (About).
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const lenis = new Lenis({ duration: 1.3, smoothWheel: true });
    setLenis(lenis);
    lenis.scrollTo(0, { immediate: true });
    lenis.on('scroll', () => {
      ScrollTrigger.update();
      setProgressFromWindow();
    });
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Recompute scroll limits whenever the page grows (lazy images, async embeds
    // like the Instagram widget). Without this Lenis caps scrolling before the
    // last section, so you can't reach Contact.
    const refresh = () => {
      lenis.resize();
      ScrollTrigger.refresh();
      setProgressFromWindow();
    };
    refresh();

    const page: Element = document.querySelector('main.page') || document.body;
    const ro = new ResizeObserver(() => refresh());
    ro.observe(page);
    window.addEventListener('load', refresh);
    window.addEventListener('resize', refresh);
    const timers = [600, 1500, 3500, 6000].map((d) => window.setTimeout(refresh, d));

    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', refresh);
      timers.forEach((t) => clearTimeout(t));
      ScrollTrigger.getAll().forEach((s) => s.kill());
      lenis.destroy();
      setLenis(null);
    };
  }, []);
}

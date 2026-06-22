import type Lenis from 'lenis';

// Mutable cross-tree state read inside useFrame (no React re-render needed).
export const scrollState = { progress: 0 };
export const emerge = { t0: -1, progress: 0 };

let lenisInstance: Lenis | null = null;
export function setLenis(l: Lenis | null) { lenisInstance = l; }

// The cinematic intro occupies extra scroll height at the very top of Home.
// We offset the 3D scene's progress by it, so the phoenix/season scroll mapping
// still starts cleanly at the real hero (progress 0) instead of being already
// advanced by the intro's scroll distance.
let introOffset = 0;
export function setIntroOffset(px: number) { introOffset = Math.max(0, px); }

export function scrollTo(target: string) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: 0, duration: 1.4 });
  } else {
    const el = document.querySelector(target);
    if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth' });
  }
}

export function setProgressFromWindow() {
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh - introOffset;
  const y = window.scrollY - introOffset;
  scrollState.progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
}

// Jump to the very top on route change. Must reset Lenis's OWN cached scroll
// (not just window.scrollTo) — otherwise Lenis snaps back to its previous offset
// on the next tick, clamped to the new page's height, landing you at the bottom.
export function scrollToTop() {
  scrollState.progress = 0;
  if (lenisInstance) {
    lenisInstance.resize();
    lenisInstance.scrollTo(0, { immediate: true, force: true });
  }
  window.scrollTo(0, 0);
}

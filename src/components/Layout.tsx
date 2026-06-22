import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Scene } from '../three/Scene';
import { SceneBoundary } from './SceneBoundary';
import { Nav } from './Nav';
import { ProgressBar } from './ProgressBar';
import { useLenis } from '../lib/useLenis';
import { scrollToTop } from '../lib/scroll';

export function Layout() {
  useLenis();
  const location = useLocation();
  useEffect(() => {
    const anchor = (location.state as { anchor?: string } | null)?.anchor;
    if (!anchor) {
      scrollToTop();
      // run again next frame, after the new route's content has laid out
      requestAnimationFrame(scrollToTop);
    }
  }, [location.pathname]);
  return (
    <>
      <div className="bg-canvas"><SceneBoundary><Scene /></SceneBoundary></div>
      <div className="veil grain" />
      <ProgressBar />
      <Nav />
      <main className="page">
        <Outlet />
      </main>
    </>
  );
}

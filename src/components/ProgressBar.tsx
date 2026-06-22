import { useEffect, useRef } from 'react';
import { scrollState } from '../lib/scroll';

export function ProgressBar() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (ref.current) ref.current.style.width = (scrollState.progress * 100).toFixed(2) + '%';
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <div className="progress" ref={ref} />;
}

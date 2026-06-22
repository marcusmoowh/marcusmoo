import { useEffect, useRef, useState, useCallback } from 'react';

const items = [
  {
    title: '$25m+ National Automation Projects',
    subtitle: 'Tech Consultancy and SWE in Multi-Million National Scheme Projects',
    image: '/photos/projects/portfolio-feature.jpg',
  },
  {
    title: 'Entrepreneurship',
    subtitle: 'Delivered ~$100k/year velocity — Web App Development and Digital Marketing',
    image: '/photos/projects/entrepreneurship.jpg',
  },
  {
    title: 'Agentic AI [WIP]',
    subtitle: 'Architecting AI Workflow Acceleration MVP using Openclaw and Claude',
    image: '/photos/projects/agentic-ai.jpg',
  },
];

// A 3D circular ring: cards orbit, you see their backs as they swing round to
// the front. Auto-rotates, drag to spin.
export function PortfolioGallery() {
  const [rotation, setRotation] = useState(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const raf = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      setRotation((r) => r + dx * 0.45);
    };
    const up = () => { dragging.current = false; };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const tick = () => {
      if (!dragging.current) setRotation((r) => r + 0.12);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const anglePer = 360 / items.length;

  return (
    <div className="cg-stage" onPointerDown={onPointerDown} role="region" aria-label="Portfolio gallery — drag to rotate">
      <div className="cg-ring" style={{ transform: `rotateY(${rotation}deg)` }}>
        {items.map((it, i) => {
          const itemAngle = i * anglePer;
          const rel = (((itemAngle + rotation) % 360) + 360) % 360;
          const norm = rel > 180 ? 360 - rel : rel; // 0 = front, 180 = back
          const opacity = Math.max(0.55, 1 - norm / 300);
          return (
            <article
              className="cg-card"
              key={it.title}
              style={{ transform: `rotateY(${itemAngle}deg) translateZ(var(--cg-r))`, opacity }}
            >
              <div className="cg-cover" style={{ backgroundImage: `url(${it.image})` }} />
              <div className="cg-text">
                <h3>{it.title}</h3>
                <p>{it.subtitle}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState, type ReactNode } from 'react';

export function Reveal({ children, delay = 0, as = 'div' }: { children: ReactNode; delay?: number; as?: keyof JSX.IntrinsicElements }) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setShown(true); io.unobserve(e.target); } }),
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as as any;
  return (
    <Tag ref={ref} className={'reveal' + (shown ? ' in' : '')} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

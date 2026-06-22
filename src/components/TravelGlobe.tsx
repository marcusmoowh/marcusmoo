import { useEffect, useRef, useCallback } from 'react';
import createGlobe from 'cobe';
import { countries, type Country } from '../content/travel';

const flag = (code: string) => `https://flagcdn.com/w80/${code}.png`;

// cobe's own convention: a marker is centred when state.phi == phiForLng(lng).
const phiForLng = (lng: number) => Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2);

// How far out the markers sit, as a fraction of the canvas radius. cobe draws the
// globe a touch inside the canvas; 1.0 = canvas edge. Tune here if flags don't land
// exactly on the gold dots (lower = pull them inward).
const GLOBE_SCALE = 1.0;

type Props = {
  activeSlug?: string;
  onSelect?: (c: Country) => void;
  speed?: number;
  showList?: boolean;
};

export function TravelGlobe({ activeSlug, onSelect, speed = 0.004, showList = true }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const phiOffset = useRef(0);
  const thetaOffset = useRef(0);
  const delta = useRef({ phi: 0, theta: 0 });
  const paused = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY };
    paused.current = true;
    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!drag.current) return;
      delta.current = {
        phi: (e.clientX - drag.current.x) / 280,
        theta: (e.clientY - drag.current.y) / 360,
      };
    };
    const up = () => {
      if (drag.current) {
        phiOffset.current += delta.current.phi;
        thetaOffset.current = Math.max(-0.7, Math.min(0.7, thetaOffset.current + delta.current.theta));
        delta.current = { phi: 0, theta: 0 };
      }
      drag.current = null;
      paused.current = false;
      if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    let globe: ReturnType<typeof createGlobe> | null = null;
    let phi = 0;
    let size = 0;
    let visible = false;

    const build = () => {
      const w = wrap.offsetWidth;
      if (!w) return;
      if (globe) { globe.destroy(); globe = null; }
      size = w;
      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: size * 2,
        height: size * 2,
        phi: 0,
        theta: 0.2,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.26, 0.29, 0.38],
        markerColor: [1, 0.82, 0.54],
        glowColor: [0.14, 0.16, 0.24],
        markers: countries.map((c) => ({ location: [c.coords[1], c.coords[0]], size: 0.05 })),
        onRender: (state) => {
          if (!paused.current) phi += speed;
          const curPhi = phi + phiOffset.current + delta.current.phi;
          const curTheta = 0.2 + thetaOffset.current + delta.current.theta;
          state.phi = curPhi;
          state.theta = curTheta;

          const R = (size / 2) * GLOBE_SCALE;
          const ct = Math.cos(curTheta);
          const st = Math.sin(curTheta);
          for (let i = 0; i < countries.length; i++) {
            const el = markerRefs.current[i];
            if (!el) continue;
            const c = countries[i];
            const latR = (c.coords[1] * Math.PI) / 180;
            const d = curPhi - phiForLng(c.coords[0]);
            const cl = Math.cos(latR);
            const x = cl * Math.sin(d);
            const y = Math.sin(latR);
            const z = cl * Math.cos(d);
            const y2 = y * ct - z * st;
            const z2 = y * st + z * ct;
            const sx = size / 2 + x * R;
            const sy = size / 2 - y2 * R;
            const vis = z2 > 0.04;
            el.style.transform = `translate(${sx}px, ${sy}px)`;
            el.style.opacity = vis ? '1' : '0';
            el.style.pointerEvents = vis ? 'auto' : 'none';
            el.style.zIndex = String(100 + Math.round(z2 * 100));
          }
        },
      });
      canvas.style.opacity = '1';
    };
    const teardown = () => { if (globe) { globe.destroy(); globe = null; } canvas.style.opacity = '0'; };

    const io = new IntersectionObserver((en) => {
      visible = !!en[0]?.isIntersecting;
      if (visible) { if (!globe) requestAnimationFrame(build); }
      else teardown();
    }, { rootMargin: '240px' });
    io.observe(wrap);

    // Rebuild whenever the container's size changes, so the canvas buffer always
    // matches the displayed size (no stretching, markers stay pinned).
    let rt = 0;
    const ro = new ResizeObserver(() => {
      if (!visible) return;
      const w = wrap.offsetWidth;
      if (!w || Math.abs(w - size) < 2) return;
      clearTimeout(rt);
      rt = window.setTimeout(build, 120);
    });
    ro.observe(wrap);

    return () => { io.disconnect(); ro.disconnect(); clearTimeout(rt); if (globe) globe.destroy(); };
  }, [speed]);

  return (
    <div className="globe-block">
      <div className="globe-wrap" ref={wrapRef}>
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          style={{ width: '100%', height: '100%', cursor: 'grab', opacity: 0, transition: 'opacity 1s ease', borderRadius: '50%', touchAction: 'none' }}
        />
        {countries.map((c, i) => (
          <button
            key={c.slug}
            ref={(el) => { markerRefs.current[i] = el; }}
            className={`globe-mk${activeSlug === c.slug ? ' active' : ''}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onSelect?.(c)}
            aria-label={c.name}
          >
            <img src={flag(c.code)} alt="" draggable={false} />
            <span className="lbl">{c.name}</span>
          </button>
        ))}
      </div>
      <p className="globe-hint">Drag to spin · tap a flag or pick below</p>
      {showList && (
        <div className="globe-chips">
          {countries.map((c) => (
            <button
              key={c.slug}
              className={`globe-chip${activeSlug === c.slug ? ' active' : ''}`}
              onClick={() => onSelect?.(c)}
            >
              <img src={flag(c.code)} alt="" draggable={false} />
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

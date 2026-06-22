import * as React from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { Reveal } from './Reveal';
import { testimonials, type Testimonial } from '../content/testimonials';

type Pos = 'front' | 'middle' | 'back' | 'hidden';

const VARIANTS: Record<Pos, { rotate: number; x: string; y: number; scale: number; opacity: number }> = {
  front: { rotate: -4, x: '0%', y: 0, scale: 1, opacity: 1 },
  middle: { rotate: 4, x: '10%', y: 10, scale: 0.96, opacity: 1 },
  back: { rotate: 9, x: '20%', y: 20, scale: 0.92, opacity: 1 },
  hidden: { rotate: 9, x: '20%', y: 20, scale: 0.9, opacity: 0 },
};

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase() ?? '').join('');
}

function Card({ t, pos, onShuffle }: { t: Testimonial; pos: Pos; onShuffle: () => void }) {
  const isFront = pos === 'front';
  const v = VARIANTS[pos];
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -90 || info.velocity.x < -450) onShuffle();
  };
  return (
    <motion.figure
      className={`tm-card${isFront ? ' is-front' : ''}`}
      style={{ zIndex: pos === 'front' ? 4 : pos === 'middle' ? 3 : pos === 'back' ? 2 : 1 }}
      initial={false}
      animate={v}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      drag={isFront ? 'x' : false}
      dragListener={isFront}
      dragElastic={0.35}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={isFront ? onDragEnd : undefined}
      aria-hidden={!isFront}
    >
      {t.photo ? (
        <img className="tm-avatar" src={t.photo} alt={t.name} draggable={false} loading="lazy" />
      ) : (
        <span className="tm-mono" aria-hidden>{initials(t.name)}</span>
      )}
      <blockquote className="tm-quote">{t.quote}</blockquote>
      <figcaption className="tm-who">
        <span className="tm-name">{t.name}</span>
        <span className="tm-role">{t.title}</span>
        <span className="tm-co">{t.company}</span>
      </figcaption>
    </motion.figure>
  );
}

// Drag-to-shuffle stack of glass testimonial cards.
export function Testimonials() {
  const n = testimonials.length;
  const [order, setOrder] = React.useState(() => testimonials.map((_, i) => i));
  if (!n) return null;

  const shuffle = () => setOrder((o) => { const next = [...o]; next.push(next.shift() as number); return next; });
  const posOf = (i: number): Pos => {
    const idx = order.indexOf(i);
    return idx === 0 ? 'front' : idx === 1 ? 'middle' : idx === 2 ? 'back' : 'hidden';
  };

  return (
    <div className="caps-block">
      <Reveal>
        <div className="gallery-head">
          <h3 className="sub-h">In their words</h3>
          <span className="sub-line" />
        </div>
      </Reveal>
      <Reveal delay={80}>
        <div className="tm-stage">
          <div className="tm-deck">
            {testimonials.map((t, i) => (
              <Card key={t.name} t={t} pos={posOf(i)} onShuffle={shuffle} />
            ))}
          </div>
          <div className="tm-controls">
            <span className="tm-hint">Drag&nbsp;left, or</span>
            <div className="tm-dots" aria-hidden>
              {order.map((idx) => <i key={idx} className={idx === order[0] ? 'on' : ''} />)}
            </div>
            <button className="tm-next" onClick={shuffle} aria-label="Next testimonial">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

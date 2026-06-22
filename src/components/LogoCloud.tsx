import { Reveal } from './Reveal';
import { logos } from '../content/logos';

// Infinite marquee of organisation logos, rendered as an About subsection.
// Pure-CSS scroll (duplicated row, translateX -50%); pauses on hover; reduced-motion safe.
export function LogoCloud() {
  const row = [...logos, ...logos];
  return (
    <div className="caps-block affil">
      <Reveal>
        <div className="affil-head">Where I've <i>learnt</i>, <i>built</i> &amp; <i>contributed</i></div>
      </Reveal>
      <Reveal delay={60}>
        <div className="logo-cloud" aria-label="Organisations Marcus has worked with">
          <div className="logo-track">
            {row.map((l, i) => (
              <div className="logo-chip" key={`${l.alt}-${i}`} title={l.alt} aria-hidden={i >= logos.length}>
                <img src={l.src} alt={i < logos.length ? l.alt : ''} loading="lazy" draggable={false} />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

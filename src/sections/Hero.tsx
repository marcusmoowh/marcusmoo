import { Reveal } from '../components/Reveal';
import { Parallax } from '../components/Parallax';
import { Domains } from '../components/Domains';
import { scrollTo } from '../lib/scroll';

export function Hero() {
  return (
    <section id="top" className="hero">
      <div className="frame">
        <Parallax speed={0.12}>
          <div className="eyebrow">APAC Technology Evangelist</div>
        </Parallax>
        <h1 className="hero-title">MARCUS MOO</h1>
        <Reveal delay={120}><p className="hero-sub">I develop tech policy and architect solutions by day — and explore the world by night.</p></Reveal>
        <Reveal delay={220}>
          <Domains />
        </Reveal>
        <Reveal delay={320}>
          <div className="hero-cta">
            <button className="btn" onClick={() => scrollTo('#work')}>View work</button>
            <button className="btn ghost" onClick={() => scrollTo('#contact')}>Get in touch</button>
          </div>
        </Reveal>
      </div>
      <button className="scroll-cue" onClick={() => scrollTo('#about')}>
        <span>Scroll</span><span className="line" />
      </button>
    </section>
  );
}

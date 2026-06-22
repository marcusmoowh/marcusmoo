import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { Parallax } from '../components/Parallax';
import { TravelGlobe } from '../components/TravelGlobe';
import { homeCountry, type Country } from '../content/travel';

export function TravelSynopsis() {
  const [active, setActive] = useState<Country>(homeCountry());
  return (
    <section id="travel">
      <div className="frame wide">
        <Parallax speed={0.1}><div className="eyebrow">III · Travel</div></Parallax>
        <Reveal delay={80}><h2 className="section-title">Connections across <i>APAC</i></h2></Reveal>
        <Reveal delay={140}><p className="copy">Every month I travel to build meaningful relationships and memories. Tap a country for a glimpse — then open the full journal to wander through each trip.</p></Reveal>
        <Reveal delay={160}>
          <div className="map-wrap">
            <TravelGlobe activeSlug={active.slug} onSelect={setActive} showList={false} />
            <aside className="story">
              <div className="story-eyebrow">Story</div>
              <h3>{active.name}</h3>
              <div className="story-meta">{active.meta}</div>
              <p>{active.synopsis}</p>
              <Link className="btn ghost small-btn" to={`/travel/${active.slug}`}>
                Explore {active.name} →
              </Link>
              <div className="story-foot">
                <Link className="link" to="/travel">Open the full map &amp; journal →</Link>
              </div>
            </aside>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

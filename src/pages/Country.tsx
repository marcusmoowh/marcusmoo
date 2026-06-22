import type { CSSProperties } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { getCountry } from '../content/travel';
import { useSeo } from '../lib/seo';

export default function Country() {
  const { country } = useParams();
  const c = getCountry(country);
  useSeo(
    c
      ? { title: `${c.name} — Travel — Marcus Moo`, description: (c.synopsis || `Travel notes from ${c.name}.`).slice(0, 155), type: 'article', canonicalPath: `/travel/${c.slug}` }
      : { title: 'Country not found — Marcus Moo', noindex: true }
  );
  if (!c) {
    return (
      <section><div className="frame">
        <h2 className="section-title">Country not found</h2>
        <button className="backlink" onClick={() => history.back()}>← Back</button>
      </div></section>
    );
  }
  return (
    <section>
      <div className="frame wide">
        <Link className="backlink" to="/travel">← Full journal</Link>
        <div className="eyebrow" style={{ marginTop: '1rem' }}>{c.meta}</div>
        <Reveal delay={60}><h1 className="article-title">{c.name}</h1></Reveal>
        <Reveal delay={120}><p className="copy big">{c.synopsis}</p></Reveal>

        <div className="montage">
          {c.trips.map((t, i) => (
            <Reveal key={t.slug} delay={i * 80}>
              <Link to={`/travel/${c.slug}/${t.slug}`} className="trip-card" style={{ ['--g']: cover(i) } as CSSProperties}>
                <div className="tc-cover"><span className="tc-date">{new Date(t.date).toLocaleDateString('en-SG', { year: 'numeric', month: 'short' })}</span></div>
                <div className="tc-body"><h3>{t.title}</h3><p>{t.excerpt}</p><span className="post-more">Open trip →</span></div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function cover(i: number) {
  const g = [
    'linear-gradient(135deg,#1b2a6b,#7a3cff)',
    'linear-gradient(135deg,#ff7a3c,#ffd27a)',
    'linear-gradient(135deg,#0f3d6e,#2bd0c8)',
    'linear-gradient(135deg,#6b1b4f,#ff6f91)',
  ];
  return g[i % g.length];
}

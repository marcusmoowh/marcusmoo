import { useMemo, useState, type CSSProperties } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { TravelGlobe } from '../components/TravelGlobe';
import { CitySkyline } from '../components/CitySkyline';
import { countries } from '../content/travel';
import { useSeo } from '../lib/seo';

// Dusk gradient skies per country (silhouette sits in front of these).
const SKY: Record<string, string> = {
  singapore: 'linear-gradient(180deg,#1b2a5e,#e8a06a)',
  malaysia: 'linear-gradient(180deg,#241a4e,#f0a85a)',
  taiwan: 'linear-gradient(180deg,#0f2f4a,#36c5c0)',
  'south-korea': 'linear-gradient(180deg,#26314f,#e98a9a)',
  thailand: 'linear-gradient(180deg,#3a1f4e,#f2b65c)',
  vietnam: 'linear-gradient(180deg,#10333a,#4fd0a0)',
  australia: 'linear-gradient(180deg,#15294f,#ff8e6e)',
  indonesia: 'linear-gradient(180deg,#2a2350,#ffb98a)',
};

export default function TravelJournal() {
  useSeo();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return countries;
    return countries.filter((c) => {
      const hay = [
        c.name, c.meta, c.synopsis,
        ...c.trips.flatMap((t) => [t.title, t.excerpt]),
      ].join(' ').toLowerCase();
      return hay.includes(k);
    });
  }, [q]);

  return (
    <section>
      <div className="frame wide">
        <button className="backlink" onClick={() => navigate('/', { state: { anchor: 'travel' } })} aria-label="Back to the site">← Back to the story</button>

        <div className="eyebrow">Travel · Full journal</div>
        <Reveal delay={60}><h2 className="section-title">Where I've <i>been</i></h2></Reveal>
        <Reveal delay={120}><p className="copy">Tap a country on the map to wander through its trips — or search and browse them all below. Each stop is a montage you can step into.</p></Reveal>

        <Reveal delay={140}>
          <TravelGlobe onSelect={(c) => navigate(`/travel/${c.slug}`)} />
        </Reveal>

        <div className="search travel-search">
          <svg viewBox="0 0 24 24" className="search-ic" aria-hidden fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" /></svg>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search countries or cities — try “Seoul”, “Bali”, “Taipei”…" aria-label="Search travel" />
          {q && <button className="search-clear" onClick={() => setQ('')} aria-label="Clear search">×</button>}
        </div>

        {filtered.length === 0 ? (
          <p className="search-empty">No countries or cities match “{q}”.</p>
        ) : (
          <div className="country-grid">
            {filtered.map((c, i) => (
              <Reveal key={c.slug} delay={i * 50}>
                <Link to={`/travel/${c.slug}`} className="country-card" style={{ ['--g']: SKY[c.slug] || SKY.singapore } as CSSProperties}>
                  <div className="cc-cover">
                    {c.image ? <img className="cc-photo" src={c.image} alt={`${c.name} skyline`} loading="lazy" /> : <CitySkyline slug={c.slug} />}
                  </div>
                  <div className="cc-body">
                    <div className="cc-meta">{c.meta}{c.home ? ' · Home' : ''}</div>
                    <h3>{c.name}</h3>
                    <p>{c.synopsis}</p>
                    <span className="cc-count">{c.trips.length} {c.trips.length === 1 ? 'trip' : 'trips'} →</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { posts, allTags, readingTime } from '../content/posts';
import { useSeo } from '../lib/seo';

export default function Blog() {
  useSeo();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tag = params.get('tag') || '';
  const [q, setQ] = useState('');

  const setTag = (t: string) => setParams(t ? { tag: t } : {});

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return posts.filter((p) => {
      const inTag = !tag || (p.tags ?? []).includes(tag);
      const inText =
        !term ||
        [p.title, p.excerpt, p.body, ...(p.tags ?? [])]
          .join(' ')
          .toLowerCase()
          .includes(term);
      return inTag && inText;
    });
  }, [q, tag]);

  return (
    <section>
      <div className="frame wide">
        <button className="backlink" onClick={() => navigate(-1)} aria-label="Go back">← Back</button>
        <Reveal><div className="eyebrow">Knowledge</div></Reveal>
        <Reveal delay={80}><h2 className="section-title">Power of <i>words</i></h2></Reveal>

        <Reveal delay={120}>
          <div className="search">
            <svg viewBox="0 0 24 24" className="search-ic" aria-hidden>
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M20 20l-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search notes by keyword…"
              aria-label="Search notes"
            />
            {q && <button className="search-clear" onClick={() => setQ('')} aria-label="Clear search">×</button>}
          </div>
        </Reveal>

        {allTags.length > 0 && (
          <Reveal delay={160}>
            <div className="tags filter-tags">
              <button className={`tag${!tag ? ' active' : ''}`} onClick={() => setTag('')}>All</button>
              {allTags.map((t) => (
                <button key={t} className={`tag${tag === t ? ' active' : ''}`} onClick={() => setTag(t)}>{t}</button>
              ))}
            </div>
          </Reveal>
        )}

        {results.length === 0 ? (
          <p className="copy search-empty">No notes match{q && ` “${q}”`}{tag && ` in “${tag}”`}. Try another keyword or tag.</p>
        ) : (
          <div className="posts">
            {results.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <Link to={`/blog/${p.slug}`} className="post-card">
                  <div className="post-meta">
                    <span className="post-date">{new Date(p.date).toLocaleDateString('en-SG', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span className="reading-time">· {readingTime(p.body)} min read</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  {(p.tags ?? []).length > 0 && (
                    <div className="tags card-tags">
                      {(p.tags ?? []).map((t) => <span key={t} className="tag">{t}</span>)}
                    </div>
                  )}
                  <span className="post-more">Read →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

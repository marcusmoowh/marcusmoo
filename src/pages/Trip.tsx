import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getTrip } from '../content/travel';
import { useSeo } from '../lib/seo';

export default function Trip() {
  const { country, trip } = useParams();
  const { country: c, trip: t } = getTrip(country, trip);
  useSeo(
    c && t
      ? { title: `${t.title} — ${c.name} — Marcus Moo`, description: (t.excerpt || `A trip note from ${c.name}.`).slice(0, 155), type: 'article', canonicalPath: `/travel/${c.slug}/${t.slug}` }
      : { title: 'Trip not found — Marcus Moo', noindex: true }
  );
  if (!c || !t) {
    return (
      <section><div className="frame">
        <h2 className="section-title">Trip not found</h2>
        <button className="backlink" onClick={() => history.back()}>← Back</button>
      </div></section>
    );
  }
  return (
    <section>
      <article className="frame article">
        <div className="article-nav"><Link className="backlink" to={`/travel/${c.slug}`}>← {c.name}</Link><Link className="link" to="/travel">Full journal</Link></div>
        <div className="post-date">{new Date(t.date).toLocaleDateString('en-SG', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        <h1 className="article-title">{t.title}</h1>
        <div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{t.body}</ReactMarkdown></div>
      </article>
    </section>
  );
}

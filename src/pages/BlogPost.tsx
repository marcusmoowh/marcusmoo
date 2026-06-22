import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPost, readingTime } from '../content/posts';
import { ShareButtons } from '../components/ShareButtons';
import { Comments } from '../components/Comments';
import { useSeo, siteOrigin } from '../lib/seo';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = slug ? getPost(slug) : undefined;

  const origin = siteOrigin();
  const url = post ? `${origin}/blog/${post.slug}` : origin;
  const ogImage = post ? `${origin}/og/${post.slug}.jpg` : '';

  useSeo(
    post
      ? {
          title: `${post.title} — Marcus Moo`,
          description: post.excerpt,
          image: `/og/${post.slug}.jpg`,
          type: 'article',
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: ogImage,
            datePublished: post.date,
            dateModified: post.date,
            author: { '@type': 'Person', name: 'Marcus Moo', url: origin },
            publisher: { '@type': 'Person', name: 'Marcus Moo' },
            mainEntityOfPage: url,
            keywords: (post.tags ?? []).join(', '),
          },
        }
      : { title: 'Post not found — Marcus Moo', noindex: true }
  );

  if (!post) {
    return (
      <section><div className="frame">
        <button className="backlink" onClick={() => navigate(-1)}>← Back</button>
        <h2 className="section-title">Post not found</h2>
        <p className="copy"><Link className="link" to="/blog">Back to all notes</Link></p>
      </div></section>
    );
  }

  return (
    <section>
      <article className="frame article">
        <div className="article-nav">
          <button className="backlink" onClick={() => navigate(-1)} aria-label="Go back">← Back</button>
          <Link className="link" to="/blog">All notes</Link>
        </div>
        <div className="post-meta">
          <span className="post-date">{new Date(post.date).toLocaleDateString('en-SG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span className="reading-time">· {readingTime(post.body)} min read</span>
        </div>
        <h1 className="article-title">{post.title}</h1>
        {(post.tags ?? []).length > 0 && (
          <div className="tags article-tags">
            {(post.tags ?? []).map((t) => (
              <Link key={t} className="tag" to={`/blog?tag=${encodeURIComponent(t)}`}>{t}</Link>
            ))}
          </div>
        )}
        <ShareButtons title={post.title} text={post.excerpt} />
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>
        <ShareButtons title={post.title} text={post.excerpt} />
        <Comments postId={post.slug} />
      </article>
    </section>
  );
}

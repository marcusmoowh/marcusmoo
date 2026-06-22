import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { Parallax } from '../components/Parallax';
import { values, creed, creedBy } from '../content/values';
import { posts } from '../content/posts';

export function Philosophy() {
  return (
    <section id="philosophy">
      <div className="frame wide">
        <Parallax speed={0.1}><div className="eyebrow">IV · Philosophy</div></Parallax>
        <Reveal delay={80}><h2 className="section-title">What I'd tell my <i>younger self</i></h2></Reveal>
        <div className="values">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 70}>
              <div className="value"><b>{v.title}</b><p>{v.body}</p></div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <blockquote className="creed">
            &ldquo;{creed}&rdquo;
            <cite className="creed-by">— {creedBy}</cite>
          </blockquote>
        </Reveal>

        {/* Power of words — parked under Philosophy; its own section comes later */}
        <div className="pow">
          <Reveal><div className="gallery-head"><h3 className="sub-h">Power of words</h3><span className="sub-line" /></div></Reveal>
          <Reveal delay={60}><p className="copy">Short essays on rising again, building for people, and what the road teaches.</p></Reveal>
          <div className="posts">
            {posts.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <Link to={`/blog/${p.slug}`} className="post-card">
                  <div className="post-date">{new Date(p.date).toLocaleDateString('en-SG', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <span className="post-more">Read →</span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal><p className="copy"><Link className="link" to="/blog">Read the full collection →</Link></p></Reveal>
        </div>
      </div>
    </section>
  );
}

import { Reveal } from './Reveal';
import { career } from '../content/career';

// Vertical left-rail timeline: a glowing gradient line, a node per role, and a
// glass card with period, company, role, an accent chip and highlight bullets.
export function Timeline() {
  return (
    <div className="caps-block">
      <Reveal>
        <div className="gallery-head">
          <h3 className="sub-h">The Career Capital forged</h3>
          <span className="sub-line" />
        </div>
      </Reveal>
      <ol className="timeline" role="list">
        {career.map((r, i) => (
          <Reveal as="li" key={r.company + r.period} delay={i * 70}>
            <div className="tl-item">
              <span className="tl-node" aria-hidden />
              <div className="tl-card">
                <div className="tl-top">
                  <span className="tl-period">{r.period}</span>
                  <span className="tl-kind">{r.kind}</span>
                </div>
                <h4 className="tl-co">{r.company}</h4>
                <div className="tl-role">{r.role}</div>
                <p className="tl-sum">{r.summary}</p>
                <ul className="tl-hi">
                  {r.highlights.slice(0, 2).map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

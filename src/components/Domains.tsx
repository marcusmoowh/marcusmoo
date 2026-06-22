// Hero "skills" — translucent glass capability chips styled like the equipped
// skills of an AI agent: a live status dot + a monospace label, with an ambient
// sheen that drifts across the glass.
//   kind: 'func'  -> green glow  (functional / role skills)
//   kind: 'tech'  -> ruby glow   (technical / delivery skills)
import type { CSSProperties } from 'react';

type Skill = { label: string; kind: 'func' | 'tech' };

const skills: Skill[] = [
  { label: 'Entrepreneurship', kind: 'func' },
  { label: 'Tech Policy', kind: 'func' },
  { label: 'Solution Architecture', kind: 'tech' },
  { label: 'Agentic AI', kind: 'tech' },
  { label: 'Automation', kind: 'tech' },
  { label: 'RPA', kind: 'tech' },
  { label: 'Cloud Infrastructure', kind: 'tech' },
  { label: 'SEO/SEM', kind: 'tech' },
  { label: 'Speaker', kind: 'func' },
  { label: 'Mentor', kind: 'func' },
  { label: 'Ambassadorship', kind: 'func' },
];

export function Domains() {
  return (
    <ul className="skills" role="list">
      {skills.map((s, i) => (
        <li className={`skill ${s.kind}`} key={s.label} style={{ ['--i']: i } as CSSProperties}>
          <span className="skill-dot" title="active" aria-hidden />
          <span className="skill-name">{s.label}</span>
        </li>
      ))}
    </ul>
  );
}

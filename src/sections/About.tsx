import { Reveal } from '../components/Reveal';
import { LogoCloud } from '../components/LogoCloud';
import { Parallax } from '../components/Parallax';
import { Counter } from '../components/Counter';
import { InstagramFeed } from '../components/InstagramFeed';
import { LinkedInFeed } from '../components/LinkedInFeed';
import { TikTokFeed } from '../components/TikTokFeed';

const gallery = [
  { src: '/photos/chin.jpg', alt: 'Marcus Moo — portrait, hand on chin' },
  { src: '/photos/profile.jpg', alt: 'Marcus Moo — side profile' },
  { src: '/photos/black.jpg', alt: 'Marcus Moo — seated, editorial' },
  { src: '/photos/red.jpg', alt: 'Marcus Moo — standing portrait' },
  { src: '/photos/bw.jpg', alt: 'Marcus Moo — black and white portrait' },
];

const capabilities = [
  {
    metric: '$25M+',
    tag: 'Flagship Tech Platforms',
    title: 'National-scale solution architecture',
    body: 'I co-build multi-million-dollar government digital services with talented agile team and deliver platforms end-to-end — translating policy into resilient, secure systems that serve businesses and citizens at population scale.',
  },
  {
    metric: '30+',
    tag: 'Tech Projects Developed',
    title: 'From brief to shipped product',
    body: 'Across web, data and cloud, I turn ambiguous problems into delivered solutions — leading the architecture, the engineering and the stakeholders all the way to launch.',
  },
  {
    metric: '12+',
    tag: 'APAC Cities / Year',
    title: 'Regional connections & ecosystems',
    body: 'I build deep and trusted connections with friends across Asia Pacific to bounce off ideas, opportunities and ecosystems.',
  },
  {
    metric: '12',
    tag: 'Years of Work Experience',
    title: 'Public sector to industry',
    body: 'A practitioner with 8 years in the public sector and 4 years in industry — from entrepreneurship to serving government, SMEs, MNCs and overseas clients.',
  },
  {
    metric: '3',
    tag: 'Speaker Events',
    title: 'Stage presence & technology evangelism',
    body: 'I take complex technology and break it down into simple ideas — taking the stage to share cutting-edge technology, its use cases and its impact.',
  },
  {
    metric: '13',
    tag: 'Mentees Guided',
    title: 'Mentorship & leadership',
    body: 'I help grow students and early careers to reach their full potential through holistic development — from CV vetting, LinkedIn presence to vibe coding. Lifting others as I climb and multiplying impact.',
  },
];

const interests = [
  { label: 'Badminton', icon: '🏸' },
  { label: 'HIIT', icon: '🏋️' },
  { label: 'Running', icon: '🏃' },
  { label: 'Monthly APAC travel', icon: '✈️' },
  { label: 'Buddhism', icon: '🧘' },
  { label: 'Continuous Learning', icon: '📚' },
];

export function About() {
  return (
    <section id="about">
      <div className="frame wide">
        <Parallax speed={0.1}><div className="eyebrow">I · About</div></Parallax>
        <Reveal delay={80}><h2 className="section-title">The person behind the <i>work</i></h2></Reveal>

        {/* lead: narrative + feature portrait */}
        <div className="about-lead">
          <div className="about-lead-copy">
            <Reveal><p className="copy">I'm an APAC technology evangelist. By day I shape technology policy and architect large-scale digital solutions for governments and enterprises; by night I chase new cities, summits and stories. The two halves feed each other — good architecture is just curiosity, applied.</p></Reveal>
            <Reveal delay={80}><p className="copy">I keep the engine running with badminton, HIIT and running, and I travel across the Asia-Pacific every month to build relationships that outlast any single project. I serve at Soka Gakkai Singapore, by studying and sharing Buddhism — a practice that grounds how I create value.</p></Reveal>
          </div>
          <Reveal delay={120}>
            <Parallax speed={0.14} className="about-portrait">
              <img src="/photos/feature.jpg" alt="Marcus Moo" loading="lazy" />
            </Parallax>
          </Reveal>
        </div>

        {/* KPI metrics — bold, equal-size */}
        <div className="kpis">
          <Reveal><div className="kpi"><b><Counter prefix="$" to={25} suffix="M+" /></b><span>Flagship Tech Platforms</span></div></Reveal>
          <Reveal delay={80}><div className="kpi"><b><Counter to={30} suffix="+" /></b><span>Tech Projects Developed</span></div></Reveal>
          <Reveal delay={160}><div className="kpi"><b><Counter to={12} suffix="+" /></b><span>APAC Cities / Year</span></div></Reveal>
          <Reveal delay={240}><div className="kpi"><b><Counter to={12} /></b><span>Years of Work Experience</span></div></Reveal>
          <Reveal delay={320}><div className="kpi"><b><Counter to={3} /></b><span>Speaker Events</span></div></Reveal>
          <Reveal delay={400}><div className="kpi"><b><Counter to={13} /></b><span>Mentees Guided</span></div></Reveal>
        </div>

        {/* photo gallery */}
        <Reveal><div className="gallery-head"><h3 className="sub-h">In frame</h3><span className="sub-line" /></div></Reveal>
        <Reveal delay={60}>
          <div className="gallery">
            {gallery.map((p) => (
              <figure className="shot" key={p.src}>
                <img src={p.src} alt={p.alt} loading="lazy" />
              </figure>
            ))}
          </div>
        </Reveal>

        {/* capabilities elaborated per KPI */}
        <div className="caps-block">
          <Reveal><div className="gallery-head"><h3 className="sub-h">What I can do</h3><span className="sub-line" /></div></Reveal>
          <div className="caps">
            {capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <article className="cap">
                  <div className="cap-metric"><b>{c.metric}</b><span>{c.tag}</span></div>
                  <h4>{c.title}</h4>
                  <p>{c.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <LogoCloud />

        {/* passion */}
        <div className="caps-block">
          <Reveal><div className="gallery-head"><h3 className="sub-h">Career Fitness</h3><span className="sub-line" /></div></Reveal>
          <Reveal delay={60}>
            <div className="interests">
              {interests.map((it) => (
                <div className="interest" key={it.label}>
                  <span className="ic">{it.icon}</span>
                  <b>{it.label}</b>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* social media subsection */}
        <div className="caps-block">
          <Reveal><div className="gallery-head"><h3 className="sub-h">Social Media</h3><span className="sub-line" /></div></Reveal>
          <div className="social-row">
            <Reveal><InstagramFeed /></Reveal>
            <Reveal><LinkedInFeed /></Reveal>
          </div>
          <Reveal><TikTokFeed /></Reveal>
        </div>
      </div>
    </section>
  );
}

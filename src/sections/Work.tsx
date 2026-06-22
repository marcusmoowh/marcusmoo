import { Reveal } from '../components/Reveal';
import { Parallax } from '../components/Parallax';
import { Timeline } from '../components/Timeline';
import { Testimonials } from '../components/Testimonials';
import { PortfolioGallery } from '../components/PortfolioGallery';
import { projects } from '../content/projects';

export function Work() {
  return (
    <section id="work">
      <div className="frame wide">
        <Parallax speed={0.1}><div className="eyebrow">II · Work</div></Parallax>
        <Reveal delay={80}><h2 className="section-title">Flagship <i>work</i></h2></Reveal>
        <Reveal delay={140}><p className="copy">From multi-million-dollar national systems to AI automation, web and digital marketing — projects I've engineered and delivered for governments, enterprises and growing businesses across the region.</p></Reveal>
        <div className="projects">
          {projects.map((p, i) => (
            <Reveal key={p.no} delay={i * 90}>
              <article className="project">
                <div className="p-head"><span className="p-no">{p.no}</span><span className="p-scale">{p.scale}</span></div>
                <h3>{p.title}</h3>
                <p>{p.blurb}</p>
                <div className="p-meta">{p.meta.map((m) => <span key={m}>{m}</span>)}</div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal><p className="copy small">…and a portfolio of further public-service and enterprise initiatives across the region.</p></Reveal>

        {/* Portfolio — 3D circular gallery */}
        <div className="portfolio">
          <Reveal><div className="gallery-head"><h3 className="sub-h">Portfolio</h3><span className="sub-line" /></div></Reveal>
          <Reveal delay={60}><p className="copy small">A 360° look at the work — drag to spin.</p></Reveal>
          <Reveal delay={120}><PortfolioGallery /></Reveal>
        </div>

        {/* career timeline — the capital forged */}
        <Timeline />

        {/* testimonials — what clients & leaders say */}
        <Testimonials />
      </div>
    </section>
  );
}

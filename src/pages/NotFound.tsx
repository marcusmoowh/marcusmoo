import { Link } from 'react-router-dom';
import { useSeo } from '../lib/seo';
export default function NotFound() {
  useSeo({ title: 'Page not found — Marcus Moo', noindex: true });
  return (
    <section><div className="frame">
      <div className="eyebrow">404</div>
      <h2 className="section-title">This page took flight</h2>
      <p className="copy"><Link className="link" to="/">← Return home</Link></p>
    </div></section>
  );
}

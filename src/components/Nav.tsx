import { Link, useLocation, useNavigate } from 'react-router-dom';
import { scrollTo } from '../lib/scroll';

const sections = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'travel', label: 'Travel' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'contact', label: 'Contact' },
];

export function Nav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const goTo = (id: string) => {
    if (pathname === '/') scrollTo('#' + id);
    else navigate('/', { state: { anchor: id } });
  };
  const goTop = () => {
    if (pathname === '/') scrollTo('#top');
    else navigate('/', { state: { anchor: 'top' } });
  };

  return (
    <header className="topbar">
      <Link to="/" className="brand" onClick={(e) => { e.preventDefault(); goTop(); }}>Marcus&nbsp;Moo</Link>
      <nav className="nav">
        {sections.map((s) => (
          <button key={s.id} className="navlink" onClick={() => goTo(s.id)}>{s.label}</button>
        ))}
      </nav>
    </header>
  );
}

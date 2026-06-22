import { useState } from 'react';
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
  const [open, setOpen] = useState(false);

  const goTo = (id: string) => {
    setOpen(false);
    if (pathname === '/') scrollTo('#' + id);
    else navigate('/', { state: { anchor: id } });
  };
  const goTop = () => {
    setOpen(false);
    if (pathname === '/') scrollTo('#top');
    else navigate('/', { state: { anchor: 'top' } });
  };

  return (
    <header className={'topbar' + (open ? ' nav-open' : '')}>
      <Link to="/" className="brand" onClick={(e) => { e.preventDefault(); goTop(); }}>Marcus&nbsp;Moo</Link>

      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span /><span /><span />
      </button>

      <nav className="nav">
        {sections.map((s) => (
          <button key={s.id} className="navlink" onClick={() => goTo(s.id)}>{s.label}</button>
        ))}
      </nav>

      {open && (
        <button
          type="button"
          className="nav-backdrop"
          aria-hidden="true"
          tabIndex={-1}
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  );
}

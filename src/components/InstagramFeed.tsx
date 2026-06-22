import { useEffect } from 'react';

const IG_URL = 'https://www.instagram.com/marcusmoo_';
const BEHOLD_FEED_ID = import.meta.env.VITE_BEHOLD_FEED_ID || '';

// Allow the Behold custom element in JSX/TSX.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'behold-widget': Record<string, any>;
    }
  }
}

function IgIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function InstagramFeed() {
  // Load the Behold widget script once.
  useEffect(() => {
    if (document.getElementById('behold-widget-script')) return;
    const s = document.createElement('script');
    s.id = 'behold-widget-script';
    s.type = 'module';
    s.src = 'https://w.behold.so/widget.js';
    document.head.appendChild(s);
  }, []);

  return (
    <div className="ig">
      <a className="ig-head" href={IG_URL} target="_blank" rel="noopener noreferrer">
        <span className="ig-avatar"><img src="/photos/feature.jpg" alt="Marcus Moo" /></span>
        <span className="ig-id">
          <b>@marcusmoo_</b>
          <span>Latest from Instagram</span>
        </span>
        <span className="ig-follow"><IgIcon /> Follow</span>
      </a>
      <div className="ig-embed">
        <behold-widget feed-id={BEHOLD_FEED_ID}></behold-widget>
      </div>
    </div>
  );
}

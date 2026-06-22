import { useEffect } from 'react';

const TIKTOK_USER = 'metadolphin';
const TIKTOK_URL = `https://www.tiktok.com/@${TIKTOK_USER}`;

function TtIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M16.5 3c.3 2.1 1.5 3.5 3.5 3.8v2.4c-1.3.1-2.5-.3-3.6-1v5.7c0 3.3-2.4 5.6-5.6 5.6A5.5 5.5 0 0 1 5.4 14c0-3.2 2.9-5.6 6.2-5.1v2.6c-.4-.1-.8-.2-1.2-.2-1.5 0-2.7 1.2-2.7 2.7 0 1.6 1.2 2.8 2.8 2.8 1.6 0 2.7-1.2 2.7-2.8V3h2.3z" />
    </svg>
  );
}

// TikTok has no data API for free feeds, but the official creator embed renders
// a live widget of the latest videos. embed.js scans for .tiktok-embed blocks.
export function TikTokFeed() {
  useEffect(() => {
    // Re-add the script on mount so it re-scans this block (SPA-safe).
    const prev = document.getElementById('tiktok-embed-script');
    if (prev) prev.remove();
    const s = document.createElement('script');
    s.id = 'tiktok-embed-script';
    s.async = true;
    s.src = 'https://www.tiktok.com/embed.js';
    document.body.appendChild(s);
  }, []);

  return (
    <div className="tiktok">
      <a className="ig-head" href={TIKTOK_URL} target="_blank" rel="noopener noreferrer">
        <span className="tt-avatar"><img src="/photos/feature.jpg" alt="Marcus Moo" /></span>
        <span className="ig-id">
          <b>@{TIKTOK_USER}</b>
          <span>Latest on TikTok</span>
        </span>
        <span className="tt-follow"><TtIcon /> Follow</span>
      </a>
      <div className="tt-embed">
        <blockquote
          className="tiktok-embed"
          cite={TIKTOK_URL}
          data-unique-id={TIKTOK_USER}
          data-embed-type="creator"
          style={{ maxWidth: '100%', minWidth: '288px' }}
        >
          <section>
            <a target="_blank" rel="noopener noreferrer" href={`${TIKTOK_URL}?refer=creator_embed`}>
              @{TIKTOK_USER}
            </a>
          </section>
        </blockquote>
      </div>
    </div>
  );
}

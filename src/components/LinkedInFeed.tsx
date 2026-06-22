import { useEffect } from 'react';

// LinkedIn has no free public "posts feed" embed (unlike Instagram via Behold),
// so this uses the official, free LinkedIn profile badge — dark-themed to match.
// 1) Set LINKEDIN_VANITY to your handle: linkedin.com/in/<vanity>.
// 2) For a true live POSTS feed, sign up for a widget (e.g. SociableKit/Elfsight),
//    paste its embed where marked below, and delete the badge block.
const LINKEDIN_VANITY = 'marcusmoowh'; // linkedin.com/in/marcusmoowh
const LINKEDIN_URL = `https://www.linkedin.com/in/${LINKEDIN_VANITY}/`;

function LiIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0z" />
    </svg>
  );
}

export function LinkedInFeed() {
  // Load LinkedIn's badge script once; it renders any .LI-profile-badge on the page.
  useEffect(() => {
    if (document.getElementById('linkedin-badge-script')) return;
    const s = document.createElement('script');
    s.id = 'linkedin-badge-script';
    s.async = true;
    s.defer = true;
    s.src = 'https://platform.linkedin.com/badges/js/profile.js';
    document.body.appendChild(s);
  }, []);

  return (
    <div className="li">
      <a className="ig-head" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
        <span className="li-avatar"><img src="/photos/feature.jpg" alt="Marcus Moo" /></span>
        <span className="ig-id">
          <b>Marcus Moo</b>
          <span>Latest from LinkedIn</span>
        </span>
        <span className="li-follow"><LiIcon /> Connect</span>
      </a>
      <div className="li-embed">
        {/* Official LinkedIn profile badge (free, no API) */}
        <div
          className="badge-base LI-profile-badge"
          data-locale="en_US"
          data-size="medium"
          data-theme="dark"
          data-type="VERTICAL"
          data-vanity={LINKEDIN_VANITY}
          data-version="v1"
        >
          <a className="badge-base__link LI-simple-link" href={LINKEDIN_URL}>Marcus Moo</a>
        </div>
        {/* ↑ For a live POSTS feed, replace this badge with a SociableKit/Elfsight embed. */}
      </div>
    </div>
  );
}

import { useState } from 'react';

// Social sharing for a post.
// - Rich previews (title/description/image) are produced by the per-post Open
//   Graph tags generated at build time (scripts/prerender-og.mjs) — that's what
//   LinkedIn/Facebook/X read, since they don't run JavaScript.
// - The buttons below open each network's official share intent. We share the
//   CANONICAL post URL (VITE_SITE_URL + path) so it works even when previewed
//   from localhost or a temporary host.
// - On supported devices we also offer the native share sheet.
export function ShareButtons({ title, text }: { title: string; text?: string }) {
  const [copied, setCopied] = useState(false);

  const siteBase = ((import.meta.env.VITE_SITE_URL as string) || '').replace(/\/$/, '');
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const url = siteBase
    ? `${siteBase}${pathname}`
    : typeof window !== 'undefined'
      ? window.location.href
      : '';

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const summary = encodeURIComponent(text || title);

  const links = [
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: 'X', href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { name: 'WhatsApp', href: `https://wa.me/?text=${t}%20${u}` },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: 'Email', href: `mailto:?subject=${t}&body=${summary}%0A%0A${u}` },
  ];

  const canNative = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const nativeShare = async () => {
    try {
      await navigator.share({ title, text: text || title, url });
    } catch {
      /* user dismissed */
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="share">
      <span className="share-label">Share</span>
      {canNative && (
        <button className="share-btn share-native" onClick={nativeShare}>Share…</button>
      )}
      {links.map((l) => (
        <a key={l.name} className="share-btn" href={l.href} target="_blank" rel="noopener noreferrer">
          {l.name}
        </a>
      ))}
      <button className="share-btn share-copy" onClick={copy} aria-live="polite">
        {copied ? 'Copied ✓' : 'Copy link'}
      </button>
    </div>
  );
}

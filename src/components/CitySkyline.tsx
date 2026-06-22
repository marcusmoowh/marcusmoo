// Symbolic skyline silhouettes for each country, drawn as dark shapes against the
// card's dusk gradient. Evocative rather than architecturally exact. If a country
// has a real `image` (photo) set in travel.ts, the card shows that instead.

const BACK = (
  <g className="sky-back">
    <rect x="0" y="98" width="20" height="32" />
    <rect x="22" y="88" width="14" height="42" />
    <rect x="300" y="92" width="20" height="38" />
    <rect x="284" y="102" width="12" height="28" />
  </g>
);

function front(slug: string) {
  switch (slug) {
    case 'singapore':
      return (
        <g>
          {/* supertrees */}
          <rect x="36" y="72" width="4" height="58" /><ellipse cx="38" cy="70" rx="15" ry="8" />
          <rect x="70" y="62" width="4" height="68" /><ellipse cx="72" cy="60" rx="17" ry="9" />
          {/* Marina Bay Sands — three towers + boat deck */}
          <polygon points="148,130 154,60 166,60 170,130" />
          <polygon points="174,130 179,56 191,56 196,130" />
          <polygon points="200,130 205,60 217,60 222,130" />
          <path d="M138,58 Q185,40 234,54 L230,62 Q185,50 144,66 Z" />
        </g>
      );
    case 'malaysia':
      return (
        <g>
          {/* Petronas twin towers */}
          <polygon points="118,130 122,44 134,44 138,130" />
          <polygon points="176,130 180,44 192,44 196,130" />
          <polygon points="122,44 128,30 134,44" /><rect x="127" y="16" width="2" height="14" />
          <polygon points="180,44 186,30 192,44" /><rect x="185" y="16" width="2" height="14" />
          <rect x="138" y="70" width="38" height="5" />
          {/* KL Tower */}
          <rect x="232" y="52" width="3" height="78" /><circle cx="233.5" cy="50" r="8" />
        </g>
      );
    case 'taiwan':
      return (
        <g>
          {/* Taipei 101 */}
          <polygon points="150,130 152,48 156,42 168,42 172,48 174,130" />
          <polygon points="149,60 175,60 173,66 151,66" />
          <polygon points="149,74 175,74 173,80 151,80" />
          <polygon points="149,88 175,88 173,94 151,94" />
          <rect x="160" y="22" width="4" height="20" />
          <rect x="120" y="104" width="16" height="26" /><rect x="188" y="98" width="16" height="32" />
        </g>
      );
    case 'south-korea':
      return (
        <g>
          {/* N Seoul Tower on Namsan */}
          <path d="M110,130 Q190,92 270,130 Z" />
          <polygon points="185,110 187,58 193,58 195,110" />
          <ellipse cx="190" cy="56" rx="9" ry="6" />
          <rect x="189" y="32" width="2" height="24" />
        </g>
      );
    case 'thailand':
      return (
        <g>
          {/* Wat Arun — central prang + flanking spires */}
          <polygon points="150,130 158,44 162,44 170,130" />
          <polygon points="155,48 165,48 160,30" />
          <rect x="153" y="70" width="14" height="3" /><rect x="154" y="86" width="12" height="3" />
          <polygon points="126,130 131,76 135,76 140,130" /><polygon points="129,78 137,78 133,66" />
          <polygon points="180,130 185,76 189,76 194,130" /><polygon points="183,78 191,78 187,66" />
        </g>
      );
    case 'vietnam':
      return (
        <g>
          {/* Landmark 81 */}
          <polygon points="188,130 190,46 194,36 202,36 206,46 208,130" />
          <rect x="193" y="24" width="2" height="12" />
          {/* tiered pagoda */}
          <polygon points="56,98 104,98 80,84" /><polygon points="60,110 100,110 80,98" />
          <rect x="78" y="110" width="4" height="20" />
          <rect x="140" y="106" width="14" height="24" />
        </g>
      );
    case 'australia':
      return (
        <g>
          {/* Harbour Bridge */}
          <path d="M30,122 Q128,60 226,122 L226,116 Q128,70 30,116 Z" />
          <rect x="30" y="112" width="5" height="18" /><rect x="222" y="112" width="5" height="18" />
          {/* Opera House sails */}
          <path d="M236,122 Q250,90 264,122 Z" />
          <path d="M252,122 Q268,82 284,122 Z" />
          <path d="M270,122 Q286,92 302,122 Z" />
        </g>
      );
    case 'indonesia':
      return (
        <g>
          {/* Candi bentar split gate */}
          <polygon points="120,130 120,72 124,66 128,66 128,58 132,58 132,130" />
          <polygon points="200,130 200,58 204,58 204,66 208,66 212,72 212,130" />
          {/* palm */}
          <rect x="166" y="80" width="4" height="50" />
          <path d="M168,80 Q150,70 138,76 Q154,72 168,82 Z" />
          <path d="M168,80 Q186,70 198,76 Q182,72 168,82 Z" />
          <path d="M168,80 Q162,62 150,58 Q164,66 168,82 Z" />
          <path d="M168,80 Q174,62 186,58 Q172,66 168,82 Z" />
        </g>
      );
    default:
      return (
        <g>
          <rect x="120" y="80" width="18" height="50" /><rect x="146" y="64" width="20" height="66" />
          <rect x="174" y="88" width="16" height="42" /><rect x="196" y="74" width="18" height="56" />
        </g>
      );
  }
}

export function CitySkyline({ slug }: { slug: string }) {
  return (
    <svg className="sky-svg" viewBox="0 0 320 130" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <circle className="sky-sun" cx="250" cy="46" r="22" />
      {BACK}
      <g className="sky-front">{front(slug)}</g>
    </svg>
  );
}

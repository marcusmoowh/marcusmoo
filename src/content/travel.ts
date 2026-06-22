// Travel content — countries on the map, each with a montage of trips.
// Edit freely; bodies are markdown. Swap for a CMS fetch later if you wish.
//
// `code`   = ISO 3166-1 alpha-2 (drives the flag marker via flagcdn).
// `coords` = [longitude, latitude] — real geographic position on the map.

export type Trip = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string; // markdown
};

export type Country = {
  slug: string;
  name: string;
  meta: string;
  code: string;             // ISO2, e.g. 'sg' -> flag
  coords: [number, number]; // [lng, lat]
  home?: boolean;
  image?: string;           // optional skyline photo (/photos/travel/<slug>.jpg); else a silhouette is drawn
  synopsis: string;
  trips: Trip[];
};

export const countries: Country[] = [
  {
    slug: 'singapore', name: 'Singapore', meta: 'Home base',
    code: 'sg', coords: [103.82, 1.35], home: true,
    synopsis: 'Where the journey begins and returns — family, practice, and the launchpad for every trip across the region.',
    trips: [
      { slug: 'home-ground', title: 'Home Ground', date: '2026-01-04',
        excerpt: 'The city that resets me between flights — hawker suppers, river runs, and quiet study.',
        body: `Singapore is my centre of gravity. Between trips I run along the river at dawn, share suppers with family, and study in the evenings.\n\nEverything I build out in the region, I bring home and pressure-test here first.` },
    ],
  },
  {
    slug: 'malaysia', name: 'Malaysia', meta: 'Just across the causeway',
    code: 'my', coords: [102.0, 3.5],
    synopsis: 'The closest neighbour and the easiest yes — food, family ties and ideas that travel well across the border.',
    trips: [
      { slug: 'kl-nights', title: 'Kuala Lumpur Nights', date: '2025-05-09',
        excerpt: 'Towers, night markets and long conversations — a city that feels like an extension of home.',
        body: `Kuala Lumpur is the easiest trip I make — close enough to feel like home, different enough to refresh me.\n\nNight markets, towers against the dark, and conversations that stretch past midnight over teh tarik.` },
    ],
  },
  {
    slug: 'taiwan', name: 'Taiwan', meta: 'Hardware & heart',
    code: 'tw', coords: [120.96, 23.7],
    synopsis: 'Where world-class hardware meets genuine warmth — night markets, mountains, and makers who ship.',
    trips: [
      { slug: 'taipei-makers', title: 'Taipei, City of Makers', date: '2025-07-14',
        excerpt: 'Night markets and hardware brilliance — a place that builds the future and feeds you well doing it.',
        body: `Taipei runs on making things. World-class hardware by day, the best night markets on earth by night.\n\nWhat stayed with me was the warmth — generous, curious people who just want to build something good.` },
    ],
  },
  {
    slug: 'south-korea', name: 'South Korea', meta: 'Design & momentum',
    code: 'kr', coords: [127.5, 36.5],
    synopsis: 'A culture that ships and keeps improving — design, discipline and relentless momentum.',
    trips: [
      { slug: 'seoul-velocity', title: 'Seoul Velocity', date: '2025-09-18',
        excerpt: 'Hardware, design and late-night ideas — a city that iterates faster than its own skyline.',
        body: `Seoul moves. Design everywhere, hardware brilliance, and a generosity that shows up in late-night conversations.\n\nThe lesson: ship, listen, improve — then do it again before anyone asks.` },
    ],
  },
  {
    slug: 'thailand', name: 'Thailand', meta: 'Hustle & hospitality',
    code: 'th', coords: [100.5, 13.75],
    synopsis: 'Startup hustle wrapped in deep hospitality — conversations that turn into collaborations.',
    trips: [
      { slug: 'bangkok-warmth', title: 'Bangkok Warmth', date: '2025-03-12',
        excerpt: 'Energy everywhere, softened by a hospitality that makes strangers into partners.',
        body: `Bangkok blends startup hustle with a hospitality so warm it disarms you. Ideas flow easily over long dinners.\n\nPartnerships here are built on relationship first, contract second.` },
    ],
  },
  {
    slug: 'vietnam', name: 'Vietnam', meta: 'Sprinting into the future',
    code: 'vn', coords: [106.3, 16.0],
    synopsis: 'Coffee, motorbikes and serious ambition — a country building at full tilt.',
    trips: [
      { slug: 'ho-chi-minh-energy', title: 'Ho Chi Minh Energy', date: '2025-06-22',
        excerpt: 'A city sprinting into the future, fuelled by strong coffee and stronger ambition.',
        body: `Ho Chi Minh City runs on energy — strong coffee, a thousand motorbikes, and builders with real ambition.\n\nEvery conversation seemed to start with "what if we just built it ourselves?"` },
    ],
  },
  {
    slug: 'australia', name: 'Australia', meta: 'A fresh angle',
    code: 'au', coords: [151.2, -33.87],
    synopsis: 'Harbour runs at dawn and candid conversations — a fresh perspective on the region.',
    trips: [
      { slug: 'sydney-harbour', title: 'Sydney at Dawn', date: '2025-11-15',
        excerpt: 'Harbour runs and honest conversations — distance that brings the region into focus.',
        body: `Sydney gives me distance — and distance gives perspective. Harbour runs at dawn, candid conversations, a fresh angle on everything happening up north.` },
    ],
  },
  {
    slug: 'indonesia', name: 'Indonesia', meta: 'Bali & beyond',
    code: 'id', coords: [115.19, -8.41],
    synopsis: 'Where I go to slow down and zoom out — Bali rhythm is a reset button for clearer thinking.',
    trips: [
      { slug: 'bali-reset', title: 'Bali Reset', date: '2025-10-08',
        excerpt: 'Rice terraces, slow mornings and clearer thinking — the region best place to step back.',
        body: `Bali is my reset button. Rice terraces, slow mornings, and just enough distance from the inbox to think clearly again.\n\nI come back with a calmer head and sharper priorities every single time.` },
    ],
  },
];

export const homeCountry = () => countries.find((c) => c.home) || countries[0];
export const getCountry = (slug?: string) => countries.find((c) => c.slug === slug);
export const getTrip = (countrySlug?: string, tripSlug?: string) => {
  const c = getCountry(countrySlug);
  return { country: c, trip: c?.trips.find((t) => t.slug === tripSlug) };
};

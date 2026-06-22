// Career timeline — "the capital forged". Chronological (earliest first).
// Edit freely; `kind` drives the small accent chip on each entry.

export type Role = {
  company: string;
  role: string;
  period: string;
  kind: string;
  summary: string;
  highlights: string[];
};

export const career: Role[] = [
  {
    company: 'Kayzel Design',
    role: 'Founder',
    period: '2014 — 2015',
    kind: 'Entrepreneurship',
    summary:
      'Founded a local creative team delivering web solutions and digital marketing to SMEs, MNCs and overseas clients.',
    highlights: [
      'Ran branding, content and digital campaigns — closing clients at an estimated 80% conversion and ~$100K revenue.',
      'Took ~30 tech projects from prototype to product, gathering requirements and conceptualising end-to-end.',
      'Built strategic alliances to widen outreach and pipeline, and trained team members for delivery excellence.',
    ],
  },
  {
    company: 'Singapore Armed Forces',
    role: 'Bionix Gunner (CFC)',
    period: '2015 — 2016',
    kind: 'National Service',
    summary:
      '1st Law gunner in Armour Infantry (Bionix), including two one-month overseas exercises in Queensland.',
    highlights: [
      'Mobile Column gunner at Singapore\u2019s 50th NDP; vehicle crew (1st Law).',
      'Best Soldier of the Month; SAF Commando Gold, Armour Follow-Me, Company Best PT, Battalion Best PT runner-up (94 pts).',
      'Marksman (max); REDCON-1 across SAR21 & Bionix weapon assembly, grenade and more; NS Excellence Award.',
    ],
  },
  {
    company: 'Samsung',
    role: 'TV/AV Product Specialist & Free-Style Ambassador',
    period: '2017 — 2020',
    kind: 'Ambassadorship',
    summary:
      'Communicated TV/AV technologies and product value propositions to drive pre-purchase decisions and high conversion.',
    highlights: [
      'Appointed TV Ambassador at flagship events — the Samsung\u2013Commune partnership and Korea National Day.',
      'Closed approximately SGD $1M in revenue through strong customer relationship management.',
      'Created original social content (e.g. CapCut) to maximise the outreach of product use-cases.',
    ],
  },
  {
    company: 'Cognizant',
    role: 'Associate Consultant \u2192 Senior Software Engineer',
    period: '2020 — 2025',
    kind: 'Engineering',
    summary:
      'Joined the Gen C Graduate Programme, building citizen- and organisation-facing public-sector products with Appian, SQL, Java and Ansible in agile teams.',
    highlights: [
      'Delivered case-management systems with payment APIs to disburse funds to the public; built features, fixed bugs and ran functional & regression testing.',
      'Scrum Master and stakeholder lead; rotated across flagship platforms including the Business Grant Portal and OurSG Grants Portal.',
      'Excel skills trainer for CSR Digital Clinics (Vietnam to Nigeria), conference speaker, youth mentor — and winner of the Best Article, BPM KNote Series 2022.',
    ],
  },
  {
    company: 'Ministry of Digital Development & Information',
    role: 'Senior Manager (Technology)',
    period: '2025 — Present',
    kind: 'Tech Policy',
    summary:
      'Plans and executes policies, strategies and roadmaps to drive technology access and adoption across Whole-of-Government.',
    highlights: [
      'Designs measures to assess policy effectiveness and implements interventions when obstacles arise.',
      'Maintains deep expertise across the Government ICT landscape with active, multi-agency stakeholder management.',
      'Spans central cloud & on-prem hosting, infrastructure & application platforms, engineering productivity, endpoint devices, governance, automation and Agentic AI.',
    ],
  },
];

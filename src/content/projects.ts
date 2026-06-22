export type Project = {
  no: string;
  title: string;
  scale: string;
  blurb: string;
  meta: string[];
};

export const projects: Project[] = [
  {
    no: 'P01',
    title: 'Business Grant Portal',
    scale: '$ multi-million · Whole-of-Government',
    blurb:
      'A single front door for businesses to discover, apply for and manage government grants — replacing fragmented agency processes with one streamlined journey.',
    meta: ['Software Engineer', 'Tech Consultant', 'Gov digital services', 'Thousands of SMEs served'],
  },
  {
    no: 'P02',
    title: 'OurSG Grant Portal',
    scale: '$ multi-million · Citizen-facing',
    blurb:
      'A community grants platform that lets citizens and groups propose and fund ground-up projects — designed for trust, transparency and ease of participation.',
    meta: ['Senior Software Engineer', 'Associate Consultant', 'Citizen engagement', 'National rollout'],
  },
  {
    no: 'P03',
    title: 'Government Paid Leave System',
    scale: '$ multi-million · National scheme',
    blurb:
      'A national platform handling paid-leave claims and disbursements — orchestrating complex eligibility rules and integrations across agencies with reliability at its core.',
    meta: ['Senior Software Engineer', 'Associate Consultant', 'BPM Automation', 'Whole-of-population'],
  },
  {
    no: 'P04',
    title: 'OpenClaw Workflow Automation',
    scale: 'Multi-Agent AI · Automation',
    blurb:
      'A multi-agent AI system that orchestrates specialised agents to plan, execute and verify complex, multi-step workflows end-to-end — turning manual operations into reliable autonomous pipelines, with human-in-the-loop checkpoints for trust and control.',
    meta: ['Multi-Agent AI System', 'Workflow orchestration', 'Senior Manager (Technology)'],
  },
  {
    no: 'P05',
    title: '30+ Website Projects',
    scale: '30+ sites · SME → MNC · Overseas',
    blurb:
      'More than thirty websites and online stores delivered for SMEs, MNCs and overseas clients — built on CMS platforms like WordPress and Shopify for fast launch, easy self-service editing and conversion-focused design.',
    meta: ['Entrepreneurship', 'WordPress & Shopify', 'SME · MNC · Overseas', 'Conversion-focused'],
  },
  {
    no: 'P06',
    title: 'Dedicated Digital Marketing',
    scale: 'SEO / SEM · Growth',
    blurb:
      'End-to-end SEO and SEM delivery — technical optimisation, content and paid search — engineered to lift conversion rates, grow qualified traffic and drive a steady pipeline of sales leads.',
    meta: ['Entrepreneurship', 'SEO & SEM', 'Conversion optimisation', 'Lead generation'],
  },
];

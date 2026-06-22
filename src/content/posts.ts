// Local, typed blog content. Manual posts below + anything imported from Notion.
import notionImported from './notion-posts.json';

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  cover?: string; // OG/social preview image
  body: string; // markdown
};

const manualPosts: Post[] = [
  {
    slug: 'hello-world',
    title: 'Hello World',
    date: '2026-06-17',
    excerpt: 'Welcome to my world — the first landing.',
    tags: ['beginnings', 'mindset', 'discipline'],
    cover: '/photos/worldview.jpg',
    body: `Welcome to my world.

![A map of my world — ambition, discipline, curiosity and faith under one roof](/photos/worldview.jpg)

This is my **first landing** — the *hello world* of this space.

It's a place to think out loud: the things I'm building, the questions I keep returning to, and the disciplines that hold it all together — strong body, sharp mind, and a little faith.

More to come. Thanks for being here.`,
  },
  {
    slug: 'ibm-apptio-cloudec-finops-roundtable',
    title: 'IBM Apptio/Cloudec Singapore IT Leaders Roundtable',
    date: '2026-06-12',
    excerpt:
      'Takeaways from a cloud cost-governance and FinOps roundtable with IBM Apptio and Cloudec — and why an optimisation layer now matters.',
    tags: ['finops', 'cloud cost management', 'ai', 'cloud', 'tech leadership'],
    cover: '/photos/ibm-roundtable.jpg',
    body: `*FinOps · cloud cost governance · AI — an evening with IBM Apptio & Cloudec.*

![IBM Apptio / Cloudec Singapore IT Leaders Roundtable in session](/photos/ibm-roundtable.jpg)

A few takeaways from a cloud-governance and FinOps event I recently attended, hosted by **Cloudec** and **IBM Apptio**.

## Background

A few years back, the cloud-adoption wave started, and the industry lacked the expertise to migrate to cloud systems. As demand for cloud rose, a huge ecosystem of knowledge for developers became available — ranging from playbooks and certifications to a wide talent pool. Today, most of our systems have been modernised and are operating in the cloud. The question now is whether we need an additional layer for optimisation.

## Cloud trajectory

Cloud's origins date back to the 1990s. Workstations, desktops and servers are not always operated at their maximum capacity, which gave rise to grid computing — the concept of sharing computing resources (Alves, 2023). Companies were incentivised to provide computing resources as commodities, delivering IT infrastructure on request — known as cloud computing — thanks to cost savings and elasticity.

In early 2006, companies like Amazon and Google began offering on-demand cloud computing services, so users could have instant access to near-infinite resources (Alves, 2023). Users no longer had to worry about the cumbersome physical constraints of space and implementation. In Q4 2022, total spend on cloud infrastructure services reached **US\$65.8 billion** for the quarter — a 23% increase year on year.

Cloud essentially solves the sacred space constraint and optimises resources by distributing workloads across physical servers. Computing power and storage are the fundamental building blocks of any application. Despite being a pandemic, Covid had one perk: it bolstered digitalisation globally. The latest technological trends — generative and agentic AI applications — carry massive use cases and potential, and they lean heavily on cloud servers. That points to a sustainable rise in cloud demand for decades to come.

![Conversations continuing after the session](/photos/ibm-roundtable-outside.jpg)

## FinOps benefits

AWS provides built-in cost-measurement tools such as Cost Explorer, which help organisations understand their cloud spending and system usage. These offer essential features including service-level cost metrics — for example, how much EC2 instances cost per usage period.

A new category called **Technology Business Management (TBM)** has emerged, with IBM Apptio as its founder and leader. This complements existing cloud capabilities by providing a technology value-management framework designed to reduce costs through identification and optimisation — essentially, a dedicated layer on top of existing cloud infrastructure.

> The potential benefits are significant: tentative savings of **1–3%** of total cloud spend initially, with projections of **10–20%** total cloud savings after implementing cost-optimisation measures.

## Procurement vs build

We can consider *procuring* this capability rather than building our own. We can tap on subject-matter experts' experience to help shape our strategic digital-transformation roadmap. There is also a healthy check and balance between the requirement provider and the vendor, which encourages openness and transparency. A market leader has already spent enormous resources building FinOps capability — so, a food for thought: why not outsource?

## References

- Alves, M. M. (2023). *What Is Cloud Computing?* In A. Melo, E. Borin, J.-L. Gaudiot, P. O. A. Navaux, L. M. A. Drummond, & M. Melo Alves (Eds.), *High Performance Computing in Clouds* (pp. 9–25). Springer International Publishing. https://doi.org/10.1007/978-3-031-29769-4_2`,
  },
];

// Merge hand-written posts with anything imported from Notion (newest first, slugs unique).
const notionPosts = (notionImported as Post[]) ?? [];
const bySlug = new Map<string, Post>();
[...manualPosts, ...notionPosts].forEach((p) => { if (p?.slug && !bySlug.has(p.slug)) bySlug.set(p.slug, p); });
export const posts: Post[] = Array.from(bySlug.values()).sort((a, b) => b.date.localeCompare(a.date));

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

// ~200 words/minute, minimum 1 min.
export const readingTime = (body: string) =>
  Math.max(1, Math.round(body.trim().split(/\s+/).length / 200));

// all unique tags across posts (sorted), for the filter row.
export const allTags = Array.from(new Set(posts.flatMap((p) => p.tags ?? []))).sort();

// Testimonials / LinkedIn recommendations shown under "The Career Capital forged"
// as a drag-to-shuffle stack of glass cards.
//
// Photos live in public/photos/testimonials/ (square images look best — shown in a
// circle). Omit `photo` to show an elegant monogram of the person's initials.
// Order = strongest / most senior first (that's the first card in the stack).

export type Testimonial = {
  name: string;
  title: string; // position / rank
  company: string;
  quote: string;
  photo?: string;
};

export const testimonials: Testimonial[] = [
  {
    name: 'Francois Teo',
    title: 'Director, Channels SENA',
    company: 'CrowdStrike',
    quote: `It is hard to find someone that has that tenacity for perfection and success at such a young age, with a foresight to his career goals and future achievements. I personally feel that he belongs to the rare breed of future leaders that we are looking for, to nurture today.`,
    photo: '/photos/testimonials/francois-teo.jpg',
  },
  {
    name: 'Lucas Seah',
    title: 'Managing Director',
    company: 'Excellence Singapore',
    quote:
      `In our professional relationship, I have had the unique opportunity to work with him as a vendor, and his energy, dedication, and positivity have made a lasting impression.

Marcus possesses a professional maturity and initiative that is truly commendable. His ability to understand our needs, proactively solve challenges and deliver solutions consistently was well beyond his years. Every interaction with him was charged with positivity and enthusiasm which made even the most complex tasks feel like a breeze.

He was always ready and eager to put in the extra effort when necessary, ensuring our satisfaction at every turn — apparent not only in the quality of his work but also in his communication and respect for deadlines.

In a world that often seems dominated by seasoned professionals, Marcus stands out as an exceptionally talented young individual who has an incredibly bright future ahead of him. Any organisation would be fortunate to work with such a promising and positive individual.`,
    photo: '/photos/testimonials/lucas-seah.jpg',
  },
  {
    name: 'Woon Fei Xiang',
    title: 'Senior Director, Asia Pacific Marketing',
    company: 'BlackLine',
    quote:
      `Marcus was a delight to work with! He provided web design, marketing collaterals and digital marketing (SEO) services as part of my technology roadmap in Sitecore and Sight to Sky NGO. It has been a pleasure working with Marcus with his pleasant personality and service excellence to ensure high quality deliverables for my requirements. I am sure he will be a valuable asset to any company hiring.`,
    photo: '/photos/testimonials/fei-xiang-woon.jpg',
  },
  {
    name: 'Song Jingwen',
    title: 'Project Manager',
    company: 'GovTech',
    quote:
      `I was a product manager under the same squad as Marcus, who does not stop at just the role of a software engineer. He is willing and goes above and beyond to contribute values directly impacting the business. For each implementation he worked on, he would strive to understand and articulate the business benefits, and foresee the potential operational changes required. No doubt capable, he's also a pleasure to work with. He would certainly be a valuable addition to any team!`,
    photo: '/photos/testimonials/song-jingwen.jpg',
  },
  {
    name: 'Yralle Gimpaya',
    title: 'Quality Engineer',
    company: 'GovTech',
    quote:
      `Marcus stands out for his exceptional skills and adaptability in diverse tech projects. His invaluable support navigating complex software, like Appian, boosted team proficiency significantly. His mastery of technologies streamlined processes, evident in his creation of a Telegram bot for deployment notifications and log retrieval.

Consistently displaying unwavering dedication, Marcus's Appian expertise brought innovative solutions and a 45% data querying efficiency boost to our Intranet platform, alongside high-impact features like the Intranet dashboard.

Beyond technical brilliance, Marcus's positive demeanour and exceptional communication fostered team cohesion — a rare blend of skills, making him an invaluable addition to any team.`,
    photo: '/photos/testimonials/yralle-gimpaya.jpg',
  },
  {
    name: 'Darryl Tan',
    title: 'Technology Consultant',
    company: 'Cognizant',
    quote:
      `Marcus is the kind of colleague who makes things happen. His ability to connect with people, inspire teams, and drive initiatives forward is truly remarkable. With his proactive energy and collaborative spirit, he consistently helped turn ideas into action.

What stands out most about Marcus is his natural leadership. He has a gift for motivating others, fostering teamwork, and keeping everyone focused on shared goals. His enthusiasm is contagious, and his solutions-oriented approach makes him an invaluable asset to any organization.

I'd highly recommend Marcus for roles that require strong interpersonal skills, initiative, and the ability to bring out the best in a team.`,
    photo: '/photos/testimonials/darryl-tan.jpg',
  },
];

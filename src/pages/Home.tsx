import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollExpandIntro } from '../components/ScrollExpandIntro';
import { Hero } from '../sections/Hero';
import { About } from '../sections/About';
import { Work } from '../sections/Work';
import { TravelSynopsis } from '../sections/TravelSynopsis';
import { Philosophy } from '../sections/Philosophy';
import { Contact } from '../sections/Contact';
import { scrollTo } from '../lib/scroll';
import { useSeo } from '../lib/seo';

export default function Home() {
  useSeo();
  const location = useLocation();
  useEffect(() => {
    const anchor = (location.state as { anchor?: string } | null)?.anchor;
    if (anchor) {
      const id = setTimeout(() => scrollTo('#' + anchor), 140);
      return () => clearTimeout(id);
    }
  }, [location]);

  return (
    <>
      <ScrollExpandIntro bg="/photos/singapore.jpg" titleA="Marcus" titleB="Moo" tagline="APAC Technology Evangelist" />
      <Hero />
      <About />
      <Work />
      <TravelSynopsis />
      <Philosophy />
      <Contact />
    </>
  );
}

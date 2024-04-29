'use client';

import { useState, useEffect, useRef, useDeferredValue, useCallback } from "react";
import { Inter } from 'next/font/google';
import { useSection } from "@/contexts/SectionContext";
import useWindowSize from "@/hooks/useWindowSize";
import { useRouter } from 'next/navigation';

import Section from "@/components/common/section";
import Intro from '@/components/sections/intro';
import AboutMe from "@/components/sections/about-me";
import Technologies from '@/components/sections/technologies';
import Projects from '@/components/sections/projects';
import ContactForm from '@/components/sections/contact-form';

import styles from './page.module.css';

// const inter = Inter({ subsets: ['latin'] })

const SECTIONS = [
  '',
  'about-me',
  'technologies',
  'projects',
  'contact-form'
];

export default function Home({ params: { section } }) {
  const [scrolling, setScrolling] = useState(false);
  const {
    section: currentSection,
    setSection,
    nextSection,
    previousSection
  } = useSection();

  const size = useWindowSize();

  const introRef = useRef(null);
  const aboutMeRef = useRef(null);
  const technologiesRef = useRef(null);
  const projectsRef = useRef(null);
  const contactFormRef = useRef(null);

  const refs = [
    introRef,
    aboutMeRef,
    technologiesRef,
    projectsRef,
    contactFormRef
  ];

  const onWheel = (e) => {
    if (!scrolling) {
      if (e.deltaY < 0) previousSection();
      else if (e.deltaY > 0) nextSection(refs.length);
      setScrolling(true);
      setTimeout(() => {
        setScrolling(false);
      }, 800);
    }
  };

  useEffect(() => {
    const firstSection = section && SECTIONS.indexOf(section[0]) >= 0 ? SECTIONS.indexOf(section[0]) : 0;
    setSection(firstSection);
  }, []);

  useEffect(() => {
    window.addEventListener('wheel', onWheel);
    return () => window.removeEventListener('wheel', onWheel);
  }, [scrolling, onWheel]);

  useEffect(() => {
    // window.history.pushState(null, null, `/${SECTIONS[currentSection]}`);
    refs[currentSection].current.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }, [currentSection, size]);

  return (
    <main className={styles.main}>
      <Section ref={introRef} >
        <Intro active={refs[currentSection] === introRef} />
      </Section>
      <Section ref={aboutMeRef} >
        <AboutMe active={refs[currentSection] === aboutMeRef} />
      </Section>
      <Section ref={technologiesRef} >
        <Technologies active={refs[currentSection] === technologiesRef} />
      </Section>
      <Section ref={projectsRef} >
        <Projects active={refs[currentSection] === projectsRef} />
      </Section>
      <Section ref={contactFormRef} >
        <ContactForm active={refs[currentSection] === contactFormRef} />
      </Section>
    </main>
  )
}

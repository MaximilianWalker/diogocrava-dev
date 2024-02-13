'use client';

import { useState, useEffect, useRef, useDeferredValue } from "react";
import { Inter } from 'next/font/google';
import styles from './page.module.css';
import Section from "@/components/sections/section";
import Intro from '@/components/sections/intro';
import AboutMe from "@/components/sections/aboutMe";
import Technologies from '@/components/sections/technologies';
import Projects from '@/components/sections/projects';
import ContactForm from '@/components/sections/contactForm';
import { useSection } from "@/contexts/SectionContext";
import useWindowSize from "@/hooks/useWindowSize";
import { useRouter } from 'next/navigation';

// const inter = Inter({ subsets: ['latin'] })

const SECTIONS = [
  '',
  'about-me',
  'technologies',
  'projects',
  'contact-form'
];

export default function Home({ params: { section } }) {
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
    if (e.deltaY < 0)
      previousSection();
    else if (e.deltaY > 0)
      nextSection(refs.length);
  }

  useEffect(() => {
    const firstSection = section && SECTIONS.indexOf(section[0]) >= 0 ? SECTIONS.indexOf(section[0]) : 0;
    setSection(firstSection);
  }, []);

  useEffect(() => {
    window.addEventListener('wheel', onWheel);
    return () => window.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  useEffect(() => {
    // window.history.pushState(null, null, `/${SECTIONS[currentSection]}`);
    refs[currentSection].current.scrollIntoView({ behavior: 'smooth' });
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

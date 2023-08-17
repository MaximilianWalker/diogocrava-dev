'use client';

import { useState, useEffect, useRef, useDeferredValue } from "react";
import { Inter } from 'next/font/google';
import styles from './page.module.css';
import Section from "@/components/Sections/section";
import Intro from '@/components/Sections/intro';
import AboutMe from "@/components/Sections/aboutMe";
import Technologies from '@/components/Sections/technologies';
import Projects from '@/components/Sections/projects';
import ContactForm from '@/components/Sections/contactForm';
import { useSection } from "@/contexts/SectionContext";

// const inter = Inter({ subsets: ['latin'] })

export default function Home({ section }) {
  const {
    section: currentSection,
    setSection,
    nextSection,
    previousSection
  } = useSection();

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

  // const [currentSection, setCurrentSection] = useState(0);
  // const currentSectionDeferred = useDeferredValue(currentSection);

  const onWheel = (e) => {
    if (e.deltaY < 0)
      previousSection();
    else if (e.deltaY > 0)
      nextSection(refs.length);
  }

  useEffect(() => {
    if (section === 'intro')
      setSection(0);
    else if (section === 'about-me')
      setSection(1);
    else if (section === 'technologies')
      setSection(2);
    else if (section === 'projects')
      setSection(3);
    else if (section === 'contact-form')
      setSection(4);
  }, []);

  useEffect(() => {
    refs[currentSection].current.scrollIntoView({ behavior: 'smooth' });
  }, [currentSection]);

  return (
    <main
      className={styles.main}
      onWheel={onWheel}
    >
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

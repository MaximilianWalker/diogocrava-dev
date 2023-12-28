'use client';

import { useState } from 'react';
import Navbar from '@/components/Layout/navbar';
import Footer from '@/components/Layout/footer';
import ParticlesBackground from '@/components/Layout/particlesBackground';
import { SectionProvider } from '@/contexts/SectionContext';
import Terminal from '@/components/TypeIt/terminal';
import { TerminalProvider } from '@/contexts/TerminalContext';
import './global.css';

export default function RootLayout({ children }) {
  const [terminalOpen, setTerminalOpen] = useState(false);

  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <TerminalProvider>
          <SectionProvider>
            <ParticlesBackground />
            <Terminal />
            <Navbar />
            {children}
            <Footer />
          </SectionProvider>
        </TerminalProvider>
      </body>
    </html>
  )
}

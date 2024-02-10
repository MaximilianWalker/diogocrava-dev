import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import ParticlesBackground from '@/components/layout/particlesBackground';
import { SectionProvider } from '@/contexts/SectionContext';
import Terminal from '@/components/type-it/terminal';
import { TerminalProvider } from '@/contexts/TerminalContext';
import './global.css';
import { WindowManagerProvider } from '@/contexts/WindowManagerContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <WindowManagerProvider>
          <TerminalProvider>
            <SectionProvider>
              <ParticlesBackground />
              <Terminal />
              <Navbar />
              {children}
              <Footer />
            </SectionProvider>
          </TerminalProvider>
        </WindowManagerProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html >
  )
}

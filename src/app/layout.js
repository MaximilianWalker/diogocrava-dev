import './globals.css';
import Navbar from '@/components/Layout/navbar';
import Footer from '@/components/Layout/footer';
import ParticlesBackground from '@/components/Layout/particlesBackground';
import { SectionProvider } from '@/contexts/SectionContext';
import Terminal from '@/components/TypeIt/terminal';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <SectionProvider>
          <ParticlesBackground />
          <Terminal />
          <Navbar />
          {children}
          <Footer />
        </SectionProvider>
      </body>
    </html>
  )
}

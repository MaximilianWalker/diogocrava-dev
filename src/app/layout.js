import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ParticlesBackground from '@/components/particlesBackground';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <ParticlesBackground />
        <Navbar />
        {children}
        <Footer />
        {/* </ParticlesBackground> */}
      </body>
    </html>
  )
}

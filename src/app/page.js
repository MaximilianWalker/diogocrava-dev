import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from './page.module.css';
import Intro from '@/components/Sections/intro';

const inter = Inter({ subsets: ['latin'] })

export default function Home({ section }) {
  return (
    <main className={styles.main}>
      <Intro />
    </main>
  )
}

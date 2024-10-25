import { Suspense, lazy } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SectionProvider } from '@/contexts/SectionContext';
import { WindowManagerProvider } from '@/contexts/WindowManagerContext';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Inconsolata, Source_Code_Pro } from 'next/font/google'
import Particles from '@/components/animations/particles';
// import Terminal from '@/components/type-it/terminal';
const Terminal = lazy(() => import('@/components/system/windows/terminal'));
import Loading from '@/components/typing-animations/loading';
import './global.css';

const sourceCodePro = Source_Code_Pro({ subsets: ['latin'] })

export default function RootLayout({ children }) {
	return (
		<html lang="en" className={sourceCodePro.className}>
			<head />
			<body>
				<WindowManagerProvider>
					<SectionProvider>
						{/* <Suspense fallback={<Loading style={{ margin: 'auto' }} />}> */}
						<Particles className="background" />
						<Terminal />
						<Navbar />
						{children}
						<Footer />
						{/* </Suspense> */}
					</SectionProvider>
				</WindowManagerProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html >
	)
}

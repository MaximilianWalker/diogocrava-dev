import { Suspense, lazy } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SectionProvider } from '@/contexts/SectionContext';
import { TerminalProvider } from '@/contexts/TerminalContext';
import { WindowManagerProvider } from '@/contexts/WindowManagerContext';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
// import ParticlesBackground from '@/components/layout/particlesBackground';
import Particles from '@/components/animations/particles';
// import Terminal from '@/components/type-it/terminal';
const Terminal = lazy(() => import('@/components/system/windows/terminal'));
import Loading from '@/components/type-it/loading';
import './global.css';

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head />
			<body>
				<WindowManagerProvider>
					{/* <TerminalProvider> */}
					<SectionProvider>
						{/* <Suspense fallback={<Loading style={{ margin: 'auto' }} />}> */}
						{/* <ParticlesBackground /> */}
						<Particles className="background" />
						<Terminal />
						<Navbar />
						{children}
						{/* <Footer /> */}
						{/* </Suspense> */}
					</SectionProvider>
					{/* </TerminalProvider> */}
				</WindowManagerProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html >
	)
}

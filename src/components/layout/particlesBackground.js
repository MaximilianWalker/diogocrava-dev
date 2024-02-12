'use client';

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import useWindowSize from "@/hooks/useWindowSize";
import styles from './particlesBackground.module.css';

const ParticlesBackground = () => {
    const [init, setInit] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const size = useWindowSize();

    const particlesInit = async (engine) => {
        await loadSlim(engine);
        setInit(true);
    };

    const options = useMemo(() => ({
        background: {
            color: "#000000",
        },
        fullScreen: {
            enable: true,
            zIndex: 0
        },
        particles: {
            links: {
                distance: 125,
                enable: true,
                triangles: {
                    enable: true,
                    opacity: 0.1,
                },
            },
            move: {
                enable: true,
                speed: 1,
            },
            size: {
                value: 1,
            },
            shape: {
                type: "circle",
            },
            number: {
                value: 0.00002617252 * size.width * size.height
            }
        }
    }), [size]);

    useEffect(() => {
        initParticlesEngine(particlesInit);
    }, []);

    return (
        <Particles
            className={styles.particles}
            particlesLoaded={() => setLoaded(true)}
            options={options}
        />
    );

};

export default ParticlesBackground;
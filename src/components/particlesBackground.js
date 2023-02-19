'use client';

import { useEffect, useState } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
// import { loadLinksPreset } from "tsparticles-preset-links";
import { loadTrianglesPreset } from "tsparticles-preset-triangles";
import styles from './particlesBackground.module.css';

// const options = {
//     fullScreen: {
//         enable: true,
//         zIndex: 0
//     },
//     particles: {
//         number: {
//             value: 200,
//             limit: 300,
//             density: {
//                 enable: true,
//                 value_area: 800
//             }
//         },
//         color: {
//             value: "#ffffff"
//         },
//         shape: {
//             type: "circle",
//             stroke: {
//                 width: 0,
//                 color: "#000000"
//             },
//             polygon: {
//                 nb_sides: 5
//             },
//             image: {
//                 src: "images/github.svg",
//                 width: 100,
//                 height: 100
//             }
//         },
//         opacity: {
//             value: 0.5,
//             random: true,
//             anim: {
//                 enable: true,
//                 speed: 1,
//                 opacity_min: 0.5,
//                 sync: false
//             }
//         },
//         size: {
//             value: 30,
//             random: true,
//             anim: {
//                 enable: true,
//                 speed: 10,
//                 size_min: 10,
//                 sync: false
//             }
//         },
//         line_linked: {
//             enable: true,
//             distance: 100,
//             color: "#ffffff",
//             opacity: 1,
//             width: 1
//         },
//         move: {
//             enable: true,
//             speed: 3,
//             direction: "none",
//             random: false,
//             straight: false,
//             out_mode: "out",
//             bounce: false,
//             attract: {
//                 enable: false,
//                 rotateX: 600,
//                 rotateY: 1200
//             }
//         }
//     },
//     interactivity: {
//         detect_on: "canvas",
//         events: {
//             onHover: {
//                 enable: true,
//                 mode: "bubble",
//                 parallax: {
//                     enable: false,
//                     force: 60,
//                     smooth: 10
//                 }
//             },
//             onClick: {
//                 enable: true,
//                 mode: "push"
//             },
//             resize: true
//         },
//         modes: {
//             grab: {
//                 distance: 400,
//                 lineLinked: {
//                     opacity: 1
//                 }
//             },
//             bubble: {
//                 distance: 400,
//                 size: 100,
//                 duration: 2,
//                 opacity: 1,
//                 speed: 2
//             },
//             repulse: {
//                 distance: 200
//             },
//             push: {
//                 particles_nb: 4
//             },
//             remove: {
//                 particles_nb: 2
//             }
//         }
//     },
//     backgroundMask: {
//         enable: true,
//         cover: {
//             color: {
//                 value: {
//                     r: 0,
//                     g: 0,
//                     b: 0
//                 }
//             }
//         }
//     },
//     retina_detect: true,
//     fps_limit: 60,
//     background: {
//         image: "url('https://particles.js.org/images/background3.jpg')"
//     }
// }

const ParticlesBackground = ({ ...props }) => {
    const [options, setOptions] = useState({ preset: "triangles" });

    const particlesInit = async (engine) => {
        // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadTrianglesPreset(engine);
    };

    const getNumberOfParticles = () => ({
        preset: "triangles",
        particles: {
            number: {
                value: 0.00002617252 * window.innerWidth * window.innerHeight
            }
        }
    });

    const onResize = () => setOptions(getNumberOfParticles());

    useEffect(() => {
        onResize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <Particles
            className={styles.particles}
            init={particlesInit}
            options={options}
        />
    );

};

export default ParticlesBackground;
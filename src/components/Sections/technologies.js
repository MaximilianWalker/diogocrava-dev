import Image from 'next/image';
import Window from '../Other/window';
import styles from './technologies.module.css';

const technologies = [
    {
        alt: 'FastAPI',
        src: '/technologies/fastapi.png'
    },
];

const Technologies = ({ children, ...props }) => {
    return (
        <div className={styles.container}>
            <Window
                className={styles['mask-window']}
                name=">_ ? ? ?"
                initialPosition={{
                    x: 'var(--window-gap)',
                    y: 'var(--window-gap)'
                }}
                draggable
            >
            </Window>
            <Window
                className={styles['about-me-window']}
                name=">_ About Me"
                initialPosition={{
                    x: 'var(--window-gap)',
                    y: 'calc((2 * var(--window-gap)) + var(--mask-window-height))'
                }}
                draggable
            >
            </Window>
            <Window
                className={styles['location-window']}
                name=">_ Location"
                initialPosition={{
                    x: 'var(--windows-gap)',
                    y: 'calc(100% - var(--window-gap) - var(--location-window-height))'
                }}
                draggable
            >
            </Window>
            <Window
                className={styles['location-window']}
                name=">_ Location"
                initialPosition={{
                    x: 'var(--windows-gap)',
                    y: 'calc(100% - var(--window-gap) - var(--location-window-height))'
                }}
                draggable
            >
            </Window>
        </div>
    );
};

export default Technologies;
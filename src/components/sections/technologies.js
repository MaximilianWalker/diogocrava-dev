import Image from 'next/image';
import Window from '../system/common/window';
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
            {/* <Window
                className={styles['mask-window']}
                name="? ? ?"
                draggable
            >
            </Window>
            <Window
                className={styles['about-me-window']}
                name="About Me"
                draggable
            >
            </Window>
            <Window
                className={styles['location-window']}
                name="Location"
                initialPosition={{
                    x: 'var(--windows-gap)',
                    y: 'calc(100% - var(--window-gap) - var(--location-window-height))'
                }}
                draggable
            >
            </Window>
            <Window
                className={styles['location-window']}
                name="Location"
                draggable
            >
            </Window> */}
        </div>
    );
};

export default Technologies;
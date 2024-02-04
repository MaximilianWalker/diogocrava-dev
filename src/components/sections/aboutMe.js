import styles from './aboutMe.module.css';
import Window from '../system/window';
import Mask from '../3d-models/mask';
import GoogleMap from '../google-map';
import Explorer from '../system/explorer';

const AboutMe = ({ active, ...props }) => {
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
                resizable
            >
                <Mask />
            </Window>
            <Window
                className={styles['about-me-window']}
                name=">_ About Me"
                initialPosition={{
                    x: 'var(--window-gap)',
                    y: 'calc((2 * var(--window-gap)) + var(--mask-window-height))'
                }}
                draggable
                resizable
            >
            </Window>

            <Explorer
                className={styles['explorer-window']}
            />

            <Window
                className={styles['status-window']}
                name=">_ Status"
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
                resizable
            >
                <GoogleMap />
            </Window>
        </div>
    );
};

export default AboutMe;
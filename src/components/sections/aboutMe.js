import styles from './aboutMe.module.css';
import Window from '../system/window';
import Mask from '../3d-models/mask';
import GoogleMap from '../map';
import Explorer from '../system/explorer';

const AboutMe = ({ active, ...props }) => {
    return (
        <div className={styles.container}>
            <Window
                className={styles['mask-window']}
                name=">_ ? ? ?"
                draggable
                resizable
            >
                <Mask />
            </Window>
            <Window
                className={styles['about-me-window']}
                name=">_ About Me"
                draggable
                resizable
            >
            </Window>

            <Explorer
                className={styles['explorer-window']}
                draggable
                resizable
            />

            <Window
                className={styles['status-window']}
                name=">_ Status"
                draggable
                resizable
            >
            </Window>
            <Window
                className={styles['location-window']}
                name=">_ Location"
                draggable
                resizable
            >
                <GoogleMap />
            </Window>
        </div>
    );
};

export default AboutMe;
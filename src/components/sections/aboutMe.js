import styles from './aboutMe.module.css';
import Window from '../system/common/window';
import Mask from '../3d-models/mask';
import GoogleMap from '../map';
import Explorer from '../system/windows/explorer';

const AboutMe = ({ active, ...props }) => {
    return (
        <div className={styles.container}>
            <Window
                className={styles['mask-window']}
                name=">_ ? ? ?"
                defaultOpen
                draggable
                resizable
            >
                <Mask />
            </Window>
            <Window
                className={styles['about-me-window']}
                name=">_ About Me"
                defaultOpen
                draggable
                resizable
            >
            </Window>

            <Explorer
                className={styles['explorer-window']}
                defaultOpen
                draggable
                resizable
            />

            <Window
                className={styles['status-window']}
                name=">_ Status"
                defaultOpen
                draggable
                resizable
            >
            </Window>
            <Window
                className={styles['location-window']}
                name=">_ Location"
                defaultOpen
                draggable
                resizable
            >
                <GoogleMap />
            </Window>
        </div>
    );
};

export default AboutMe;
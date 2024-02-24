import { useState, useEffect } from 'react';
import Window from '../system/common/window';
import Mask from '../3d-models/mask';
import GoogleMap from '../map';
import Explorer from '../system/windows/explorer';
import PrismViewer from '../common/PrismViewer';
import styles from './aboutMe.module.css';

const AboutMe = ({ active, ...props }) => {
    const [aboutMe, setAboutMe] = useState();

    const getAboutMe = async () => {
        const response = await fetch('/api/input?id=about_me');
        const result = await response.json();
        setAboutMe(result[0].value);
    };

    useEffect(() => {
        getAboutMe();
    }, []);

    return (
        <div className={styles.container}>
            <Window
                className={styles['mask-window']}
                id="mask-window"
                name="? ? ?"
                defaultOpen
                draggable
                resizable
            >
                <Mask />
            </Window>
            <Window
                className={styles['about-me-window']}
                id="about-me-window"
                name="About Me"
                style={{ justifyContent: 'space-around' }}
                defaultOpen
                draggable
                resizable
            >
                {/* <PrismViewer
                    className={styles['about-me-text']}
                    code={aboutMe}
                    language="xml"
                /> */}
                {/* {
                    aboutMe ?
                        Object.entries(aboutMe).map(([key, value]) => (
                            <p key={key}><b>{key}:</b> {
                                typeof value === 'string' ?
                                    value
                                    :

                            }</p>
                        ))
                        :
                        null
                } */}
            </Window>

            <Explorer
                className={styles['explorer-window']}
                id="explorer-window"
                defaultOpen
                draggable
                resizable
            />

            <Window
                className={styles['status-window']}
                id="status-window"
                name="Status"
                defaultOpen
                draggable
                resizable
            >
            </Window>
            <Window
                className={styles['location-window']}
                id="location-window"
                name="Location"
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
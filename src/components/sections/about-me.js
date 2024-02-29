import { useState, useEffect } from 'react';
import { MapPin, Eye, EyeOff } from 'react-feather';
import ObjectToText from '../common/object-to-text';
import Window from '../system/common/window';
import Mask from '../3d-models/mask';
import GoogleMap from '../map';
import Explorer from '../system/windows/explorer';
import PrismViewer from '../common/PrismViewer';
import './about-me.css';

const AboutMe = ({ active, ...props }) => {
    const [aboutMe, setAboutMe] = useState();
    const [show, setShow] = useState(false);

    const getAboutMe = async () => {
        const response = await fetch('/api/input?id=about_me');
        const result = await response.json();
        setAboutMe(result[0].value);
    };

    useEffect(() => {
        getAboutMe();
    }, []);

    return (
        <div className="container">
            <Window
                className="mask-window"
                id="mask-window"
                name="? ? ?"
                defaultOpen
                draggable
                resizable
            >
                <Mask />
            </Window>
            <Window
                className="about-me-window"
                id="about-me-window"
                name="About Me"
                style={{ justifyContent: 'space-around' }}
                defaultOpen
                draggable
                resizable
            >
                {
                    show ?
                        <EyeOff style={{ position: 'absolute', right: '10px', top: '10px', zIndex: 1 }} onClick={() => setShow(!show)} />
                        :
                        <Eye style={{ position: 'absolute', right: '10px', top: '10px', zIndex: 1 }} onClick={() => setShow(!show)} />
                }
                <ObjectToText className={`about-me-text ${show ? 'visible' : 'secure'}`} value={aboutMe} />
            </Window>

            <Explorer
                className="explorer-window"
                id="explorer-window"
                defaultOpen
                draggable
                resizable
            />

            <Window
                className="status-window"
                id="status-window"
                name="Status"
                defaultOpen
                draggable
                resizable
            >
            </Window>
            <Window
                className="location-window"
                id="location-window"
                name="Location"
                icon={MapPin}
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
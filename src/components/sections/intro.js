import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { TypeWave } from '@typewavejs/react';
import './intro.css';

const getEvents = (onComplete) => [
    {
        type: "type",
        value: "> Hello World!"
    },
    {
        type: "pause",
        value: 1000
    },
    {
        type: "delete",
        value: 6
    },
    {
        type: "type",
        value: "ups..."
    },
    {
        type: "pause",
        value: 500
    },
    {
        type: "delete",
        value: 6
    },
    {
        type: "type",
        value: "user! ヽ(´▽`)/"
    },
    {
        type: "pause",
        value: 600
    },
    {
        type: "type",
        value: "\n"
    },
    {
        type: "type",
        value: (
            <>
                {"> My name is "}
                <b style={{ color: "#4EC9B0" }}>
                    Diogo Crava
                </b>
                {"!"}
            </>
        )
    },
    {
        type: "pause",
        value: 500
    },
    {
        type: "type",
        value: (
            <>
                {"\n> And I'm a "}
                <b>
                    <span style={{ color: '#808080' }}>{"<"}</span>
                    <span style={{ color: '#569CD6' }}>FullStack Developer</span>
                    <span style={{ color: '#808080' }}>{">"}</span>
                </b>
            </>
        )
    },
    {
        type: "execute",
        value: onComplete
    },
    {
        type: "pause",
        value: 20000
    },
    {
        type: "type",
        value: "\n> Use the menu to continue..."
    },
    {
        type: "pause",
        value: 20000
    },
    {
        type: "type",
        value: "\n> Knock knock... is anyone there?"
    }
];

const Intro = ({ active, ...props }) => {
    const [complete, setComplete] = useState(false);
    const [afk, setAfk] = useState(true);

    const events = useMemo(() => getEvents(() => setComplete(true)), []);

    useEffect(() => {
        if (!complete && !active)
            setAfk(false);
    }, [complete, active]);


    return (
        <div className="intro__container">
            <TypeWave
                className="hi"
                component="h1"
                play={!complete || afk}
                typeSpeed={50}
                deleteSpeed={50}
                cursorCharacter="_"
                events={events}
            />
            <div className="intro__portrait-container">
                <Image
                    className="intro__portrait"
                    src="/portraits/portrait_with_border.png"
                    alt="Diogo Crava"
                    fill
                    priority
                    quality={100}
                />
            </div>
        </div>
    );

};

export default Intro;
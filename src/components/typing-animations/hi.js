'use client';

import { useState, useEffect } from "react";
import { TypeWave } from '@typewavejs/react';
import './hi.css';

const events = [
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
        type: "pause",
        value: 20000
    },
    {
        type: "type",
        value: "\n> Scroll to continue..."
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

export default ({ freeze: freezeProp }) => {
    const [instance, setInstance] = useState();
    const [freeze, setFreeze] = useState(freezeProp);
    const [isComplete, setComplete] = useState(false);

    useEffect(() => {
        if (instance && isComplete && freeze) instance.destroy(false);
    }, [instance, isComplete, freeze]);

    useEffect(() => {
        if (freezeProp) setFreeze(true);
    }, [freezeProp]);

    return (
        <TypeWave
            className="hi"
            component="h1"
            typeSpeed={50}
            deleteSpeed={50}
            cursorCharacter="_"
            events={events}
        />
    );
};
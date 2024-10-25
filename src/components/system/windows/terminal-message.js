// https://sdk.vercel.ai/docs
'use client';

import { useState, useMemo } from "react";
import { TypeWave } from '@typewavejs/react';
import parse from 'html-react-parser';
import './terminal.css';

const LOADING_EVENTS = [
    {
        type: "type",
        instant: true,
        value: "Loading"
    },
    {
        type: "type",
        value: "..."
    },
    {
        type: "delete",
        value: 3
    },
    {
        type: "loop",
        value: 1
    }
];

function TerminalMessage({
    prefix,
    isPrefixHtml = false,
    loading = false,
    animated = false,
    cursorCharacter,
    message
}) {
    const [showCursor, setShowCursor] = useState(true);

    const events = useMemo(() => {
        if (loading) return LOADING_EVENTS;

        return [
            {
                type: "type",
                instant: true,
                value: isPrefixHtml ? parse(prefix) : prefix
            },
            {
                type: "type",
                instant: !animated,
                value: message
            }
        ];
    }, [prefix, isPrefixHtml, loading, animated, message]);

    return (
        <TypeWave
            component="pre"
            events={events}
            cursorCharacter={cursorCharacter}
            showCursor={showCursor}
            onEnd={() => setShowCursor(false)}
        />
    );
}

export default TerminalMessage;
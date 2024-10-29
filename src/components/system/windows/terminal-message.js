// https://sdk.vercel.ai/docs
'use client';

import { useState, useMemo, memo } from "react";
import { TypeWave } from '@typewavejs/react';
import parse from 'html-react-parser';
import './terminal.css';

function TerminalMessage({
    prefix,
    isPrefixHtml = false,
    loading = false,
    animated = false,
    cursorCharacter,
    isMessageHtml = false,
    message,
    onAnimateEnd
}) {
    const [showCursor, setShowCursor] = useState(true);

    const loadingEvents = useMemo(() => [
        {
            type: "type",
            instant: true,
            value: isPrefixHtml ? parse(prefix) : prefix
        },
        {
            type: "type",
            instant: true,
            value: "Loading"
        },
        {
            type: "type",
            value: "...",
            speed: 200
        },
        {
            type: "delete",
            value: 3,
            speed: 200
        },
        {
            type: "loop",
            value: 2
        }
    ], [prefix, isPrefixHtml]);

    const events = useMemo(() => [
        {
            type: "type",
            instant: true,
            value: isPrefixHtml ? parse(prefix) : prefix
        },
        {
            type: "type",
            instant: !animated,
            value: isMessageHtml ? parse(message) : message
        }
    ], [prefix, isPrefixHtml, animated, message]);

    console.log(events)
    console.log(message)

    return (
        <TypeWave
            component="pre"
            events={loading ? loadingEvents : events}
            cursorCharacter={cursorCharacter}
            showCursor={showCursor}
            typeSpeed={30}
            onEnd={() => {
                setShowCursor(false);
                onAnimateEnd && onAnimateEnd();
            }}
        />
    );
}

export default memo(TerminalMessage);
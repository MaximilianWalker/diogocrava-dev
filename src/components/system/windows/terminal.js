// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useLayoutEffect, useMemo } from "react";
import { TypeWave } from '@typewavejs/react';
import { useChat } from 'ai/react';
import Window from "@/components/system/common/window";
// import useGPT from "@/hooks/useGPT";
import { splitText } from "@/utils/stringExtensions";
import { useWindowManager } from "@/contexts/WindowManagerContext";
import TerminalIcon from '@/icons/custom/terminal';
import TerminalInput from "./terminal-input";
import './terminal.css';

const INPUTS = [
    'linux_startup',
    'os_logo',
    'primary_user',
    'ai_user'
];

const CURSOR_CHARACTER = '_';

function convertToCamelCase(name) {
    return name
        .split('_')
        .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

export default function Terminal({ }) {
    const { bringToFront, } = useWindowManager();

    const { messages, isLoading: isLoadingResponse } = useChat();

    const [open, setOpen] = useState(false);
    const [inputs, setInputs] = useState();
    const [booting, setBooting] = useState(true);

    const bootEvents = useMemo(() => {
        if (!inputs) return null;

        const events = [];

        for (const line of splitText(inputs.linuxStartup)) {
            events.push({
                type: 'type',
                value: `${line}\n`,
                instant: true
            });
            events.push({
                type: 'pause',
                value: Math.random() * 400
            });
        }

        events.push({ type: 'type', value: inputs.osLogo, instant: true });

        return events;
    }, [inputs]);

    const getInputs = async () => {
        const searchParams = new URLSearchParams();
        INPUTS.forEach((input) => searchParams.append('id', input));

        const response = await fetch(`/api/input?${searchParams}`);
        const result = await response.json();

        const newInputs = {};
        for (const input of result)
            newInputs[convertToCamelCase(input.name)] = input.value;

        setInputs(newInputs);
    };

    const writeReply = () => {
        const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1] : null;
        if (lastMessage && lastMessage.role === 'assistant') {
            const response = lastMessage.content;
            splitText(response).forEach((line) => {
                // instance.type(line, { instant: true }).break();
            });
            // instance.type(inputs.primaryUser, { instant: true });
            // instance.flush();
        }
    };

    useLayoutEffect(() => {
        getInputs();
    }, []);

    useEffect(() => {
        bringToFront('terminal')
    }, [open]);

    useEffect(() => {
        if (!isLoadingResponse)
            writeReply();
    }, [isLoadingResponse, messages]);

    return (
        <Window
            className="terminal"
            id="terminal"
            name="Terminal"
            icon={TerminalIcon}
            draggable
            maximizable
            closable
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
        >
            <div>
                {
                    bootEvents &&
                    <TypeWave
                        events={bootEvents}
                        component="pre"
                        play={open}
                        showCursor={booting}
                        cursorCharacter={CURSOR_CHARACTER}
                        onEnd={() => setBooting(false)}
                    />
                }
                {
                    !booting && messages.map((message, index) => (
                        <TerminalMessage
                            key={`message-${index}`}
                            cursorCharacter={CURSOR_CHARACTER}
                            message={message}
                        />
                    ))
                }
                {
                    !booting && !isLoadingResponse &&
                    <TerminalInput
                        prefix={inputs.primaryUser}
                        isPrefixHtml
                        cursorCharacter={CURSOR_CHARACTER}
                    />
                }
            </div>
        </Window>
    );
}
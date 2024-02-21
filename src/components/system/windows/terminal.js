// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, useLayoutEffect } from "react";
import TypeIt from "typeit-react";
import { Maximize, X } from 'react-feather';
import { useChat } from 'ai/react';
import styles from './terminal.module.css';
import { useTerminal } from "@/contexts/TerminalContext";
import useDrag from "@/hooks/useDrag";
import Window from "@/components/system/common/window";
// import useGPT from "@/hooks/useGPT";
import { splitText } from "@/utils/stringExtensions";
import { useWindowManager } from "@/contexts/WindowManagerContext";

const AI_LOADING_INTERVAL = 400;

const BOOT_STATES = {
    OFF: 'off',
    BOOTING: 'booting',
    READY: 'ready'
};

const INPUTS = [
    'linux_startup',
    'os_logo',
    'primary_user',
    'ai_user'
];

function convertToCamelCase(name) {
    return name
        .split('_')
        .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

export default function Terminal({ }) {
    const textareaRef = useRef();
    const cursorRef = useRef(0);

    const intervalRef = useRef();
    const dotCounterRef = useRef(0);
    const isIncrementingRef = useRef(true);

    const { bringToFront } = useWindowManager();

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading: isLoadingResponse,
    } = useChat();

    const [open, setOpen] = useState(false);
    const [instance, setInstance] = useState();
    const [inputs, setInputs] = useState();
    const [bootState, setBootState] = useState(BOOT_STATES.OFF);

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

    const writeInputs = () => {
        setBootState(BOOT_STATES.BOOTING);
        splitText(inputs.linuxStartup).forEach((line) => {
            if (line.trim().length > 0)
                instance.type(line, { instant: true }).pause(Math.random() * 600).break();
            else
                instance.type(line, { instant: true }).break();
        });
        splitText(inputs.osLogo).forEach((line) => {
            instance.type(line, { instant: true }).break();
        });

        instance.break();
        instance.type(inputs.primaryUser, { instant: true });
        instance.exec(() => setBootState(BOOT_STATES.READY));
        instance.flush();
    };

    const writeReply = () => {
        const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1] : null;
        if (instance && lastMessage && lastMessage.role === 'assistant') {
            const response = lastMessage.content;
            splitText(response).forEach((line) => {
                instance.type(line, { instant: true }).break();
            });
            instance.type(inputs.primaryUser, { instant: true });
            instance.flush();
        }
    };

    const startLoading = () => {
        instance
            .break()
            .type(inputs.aiUser, { instant: true })
            .type('Loading', { instant: true })
            .flush();

        intervalRef.current = setInterval(() => {
            if (isIncrementingRef.current) {
                instance.type('.').flush();
                dotCounterRef.current += 1;
            } else {
                instance.delete(1).flush();
                dotCounterRef.current -= 1;
            }

            if (dotCounterRef.current === 3)
                isIncrementingRef.current = false;
            else if (dotCounterRef.current === 0)
                isIncrementingRef.current = true;
        }, AI_LOADING_INTERVAL);
    };

    const stopLoading = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            instance.delete('Loading'.length + dotCounterRef.current, { instant: true });
            intervalRef.current = null;
            dotCounterRef.current = 0;
            isIncrementingRef.current = true;
        }
    };

    const setInput = (value) => handleInputChange({ target: { value } });

    const onKeyDown = useCallback((e) => {
        if (open && bootState == BOOT_STATES.READY && !isLoadingResponse) {
            textareaRef.current.focus();
            if (e.key === 'Enter' && !e.shiftKey) {
                // e.preventDefault();
                handleSubmit(e);
                // handleInputChange('');
            } else if (e.key === 'ArrowLeft') {
                if (cursorRef.current < input.length) {
                    cursorRef.current += 1;
                    instance.move(-1).flush();
                }
            } else if (e.key === 'ArrowRight') {
                if (cursorRef.current > 0) {
                    cursorRef.current -= 1;
                    instance.move(1).flush();
                }
            }
        }
    }, [open, bootState, instance, input, isLoadingResponse]);

    const onInput = useCallback((e) => {
        if (open && bootState == BOOT_STATES.READY && !isLoadingResponse) {
            const value = e.target.value;
            const delta = value.length - input.length;
            const typed = value.substring(
                input.length - cursorRef.current,
                input.length - cursorRef.current + delta
            );

            if (cursorRef.current > 0) instance.move(1).move(-1);

            if (delta === 0) return;
            else if (delta > 0) instance.type(typed, { instant: true });
            else instance.delete(Math.abs(delta), { instant: true });

            console.log(delta)

            instance.flush();
            setInput(value);
        }
    }, [open, bootState, instance, input, isLoadingResponse]);

    useLayoutEffect(() => {
        getInputs();
        return () => {
            if (instance) instance.flush();
        };
    }, []);

    useEffect(() => {
        bringToFront('terminal');
        if (open) textareaRef.current.focus();
        else textareaRef.current.blur();
    }, [open]);

    useEffect(() => {
        if (instance && open && inputs && bootState == BOOT_STATES.OFF)
            writeInputs();
    }, [instance, inputs, open]);

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        }
    }, [onKeyDown]);

    useEffect(() => {
        if (!instance) return;

        if (!isLoadingResponse) {
            stopLoading();
            writeReply();
        } else if (!intervalRef.current) {
            startLoading();
        }
    }, [instance, isLoadingResponse, messages]);

    return (
        <Window
            className={styles.container}
            id="terminal"
            name=">_ Terminal"
            // open={open}
            draggable
            maximizable
            closable
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
        >
            <TypeIt
                className={styles.terminal}
                as="pre"
                options={{
                    cursorChar: "_",
                    speed: 1,
                    nextStringDelay: 0
                }}
                getBeforeInit={(instance) => {
                    setInstance(instance);
                    return instance;
                }}
            />
            <textarea
                ref={textareaRef}
                className={styles.textarea}
                value={input}
                onInput={onInput}
            />
        </Window>
    );
}
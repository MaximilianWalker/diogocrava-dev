// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, useLayoutEffect } from "react";

import Prism from "prismjs";

// Languages
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-python";

// Themes
import "./darkPlusPrismTheme.css";

import TypeIt from "typeit-react";
import { Maximize, X } from 'react-feather';
import { useChat } from 'ai/react';
import styles from './terminal.module.css';
import { useTerminal } from "@/contexts/TerminalContext";
import useDrag from "@/hooks/useDrag";
import Window from "@/components/Other/window";
// import useGPT from "@/hooks/useGPT";
import { splitText } from "@/utils/stringExtensions";

const AI_LOADING_INTERVAL = 400;

const BOOT_STATES = {
    OFF: 'off',
    BOOTING: 'booting',
    READY: 'ready'
};

export default function Terminal({ }) {
    const textareaRef = useRef();
    const cursorRef = useRef(0);

    const intervalRef = useRef();
    const dotCounterRef = useRef(0);
    const isIncrementingRef = useRef(true);

    const {
        open,
        toggleTerminal,
        toggleMaximized
    } = useTerminal();

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading: isLoadingResponse,
    } = useChat();

    const [instance, setInstance] = useState();
    const [inputs, setInputs] = useState();
    const [bootState, setBootState] = useState(BOOT_STATES.OFF);

    const getInputs = async () => {
        let newInputs = {};

        let response = await fetch('/api/input/linux_startup');
        let result = await response.json();
        newInputs.linuxStartup = result.value;

        response = await fetch('/api/input/os_logo');
        result = await response.json();
        newInputs.osLogo = result.value;

        response = await fetch('/api/input/primary_user');
        result = await response.json();
        newInputs.primaryUser = result.value;

        response = await fetch('/api/input/ai_user');
        result = await response.json();
        newInputs.aiUser = result.value;

        setInputs(newInputs);
    }

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
            name=">_ Terminal"
            initialized={{
                x: 'calc(50vh - (var(--terminal-height) / 2))',
                y: 'calc(50vw - (var(--terminal-width) / 2))'
            }}
            open={open}
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
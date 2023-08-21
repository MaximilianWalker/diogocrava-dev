// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback } from "react";

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
// import useGPT from "@/hooks/useGPT";
import { splitText } from "@/utils/stringExtensions";

const AI_LOADING_INTERVAL = 400;

export default function Terminal({ }) {
    const containerRef = useRef();
    const tabRef = useRef();
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
        isDragging,
        position: containerPosition,
        onMouseDown
    } = useDrag(containerRef);

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading: isLoadingResponse,
    } = useChat();

    const [instance, setInstance] = useState();
    const [inputs, setInputs] = useState();
    const [isInitalized, setInitialized] = useState(false);

    const getInputs = async () => {
        let newInputs = {};

        let response = await fetch('/inputs/linux_startup.txt');
        newInputs.linuxStartup = await response.text();

        response = await fetch('/inputs/os.txt');
        newInputs.osMessage = await response.text();

        response = await fetch('/inputs/primary_user.txt');
        newInputs.primaryUser = await response.text();

        response = await fetch('/inputs/ai_user.txt');
        newInputs.aiUser = await response.text();

        setInputs(newInputs);
    }

    const writeInputs = async () => {
        instance.reset();

        splitText(inputs.linuxStartup).forEach((line) => {
            if (line.trim().length > 0)
                instance.type(line, { instant: true }).pause(Math.random() * 600).break();
            else
                instance.type(line, { instant: true }).break();
        });
        splitText(inputs.osMessage).forEach((line) => {
            instance.type(line, { instant: true }).break();
        });

        instance.break();

        instance.type(inputs.primaryUser, { instant: true });

        instance.options({
            afterComplete: () => setInitialized(true)
        }).go();
    };

    const setInput = (value) => handleInputChange({ target: { value } });

    const onKeyDown = useCallback((e) => {
        if (open && isInitalized && !isLoadingResponse) {
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
    }, [open, isInitalized, instance, input, isLoadingResponse]);

    const onInput = useCallback((e) => {
        if (open && isInitalized && !isLoadingResponse) {
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
    }, [open, isInitalized, instance, input, isLoadingResponse]);

    useEffect(() => {
        getInputs();
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        }
    }, [onKeyDown]);

    useEffect(() => {
        if (open) textareaRef.current.focus();
        else textareaRef.current.blur();
    }, [open]);

    useEffect(() => {
        if (open && instance && inputs && !isInitalized) writeInputs();
    }, [open, instance, inputs]);

    useEffect(() => {
        if (!instance) return;

        if (!isLoadingResponse) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                instance.delete('Loading'.length + dotCounterRef.current, { instant: true });
                intervalRef.current = null;
                dotCounterRef.current = 0;
                isIncrementingRef.current = true;
            }

            const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1] : null;
            if (instance && lastMessage && lastMessage.role === 'assistant') {
                const response = lastMessage.content;
                splitText(response).forEach((line) => {
                    instance.type(line, { instant: true }).break();
                });
                instance.type(inputs.primaryUser, { instant: true });
                instance.flush();
            }
        } else if (!intervalRef.current) {
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
        }
    }, [instance, isLoadingResponse, messages]);

    return (
        <div
            ref={containerRef}
            className={styles.container}
            style={{
                top: containerPosition?.y ?? undefined,
                left: containerPosition?.x ?? undefined,
                visibility: open ? 'visible' : 'hidden'
            }}
        >
            <div
                ref={tabRef}
                className={styles.tab}
                onMouseDown={onMouseDown}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
                <span><b>{'>_ Terminal'}</b></span>
                <button onClick={toggleMaximized}><Maximize /></button>
                <button onClick={toggleTerminal}><X /></button>
            </div>
            <div className={styles.terminalContainer}>
                <TypeIt
                    className={styles.terminal}
                    as="pre"
                    options={{
                        cursorChar: "_",
                        speed: 1,
                        nextStringDelay: 0
                    }}
                    getAfterInit={(instance) => {
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
            </div>
        </div>
    );
}
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


const controlKeys = [
    "Shift",
    "Enter",
    "Control",
    "Alt",
    "Meta",
    "Tab",
    "Escape",
    "ArrowRight",
    "ArrowLeft",
    "ArrowUp",
    "ArrowDown",
    "Dead"
];

const deadKeys = {
    // Common
    'DeadGrave': '`',          // ` (Grave accent)
    'DeadAcute': '´',          // ´ (Acute accent)
    'DeadCircumflex': 'ˆ',     // ˆ (Circumflex accent)
    'DeadTilde': '~',          // ~ (Tilde)
    'DeadMacron': '¯',         // ¯ (Macron)
    'DeadBreve': '˘',          // ˘ (Breve)
    'DeadAboveDot': '˙',       // ˙ (Dot above, or overdot)
    'DeadUmlaut': '¨',         // ¨ (Umlaut or diaeresis)
    'DeadAboveRing': '˚',      // ˚ (Ring above)
    'DeadDoubleacute': '˝',    // ˝ (Double acute accent)
    'DeadCaron': 'ˇ',          // ˇ (Caron, or háček)

    // Portuguese
    'DeadCedilla': '¸',        // ¸ (Cedilla)

    // German (some overlap with common accents)
    'DeadBelowDot': '̣',       // ̣ (Dot below, used in transliteration)

    // Nordic languages
    'DeadStroke': '̸',         // ̸ (Stroke, bar)
    'DeadOgonek': '˛',         // ˛ (Ogonek, used in Polish but also for transliteration in some Nordic contexts)
    'DeadHook': '̉',           // ̉ (Hook above, used in some Saami languages)
    'DeadHorn': '̛',           // ̛ (Horn, used in some Saami languages)

    // Other
    'DeadBelowComma': '̦',     // ̦ (Comma below, used for transliteration or Romanian)
    'DeadBelowRing': '̥',      // ̥ (Ring below, used in Uralic phonetic alphabet and transliteration)
    'DeadBelowMacron': '̱',    // ̱ (Macron below, used in Uralic phonetic alphabet and transliteration)
    'DeadBelowCircumflex': '̭' // ̭ (Circumflex below, used for transliteration)
};

export default function Terminal({ }) {
    const containerRef = useRef();
    const tabRef = useRef();
    const textareaRef = useRef();
    // const valueRef = useRef('');
    const cursorRef = useRef(0);
    const deadKeyRef = useRef();

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
        isLoading: isLoadingMessages,
    } = useChat();

    // Startup
    const [instance, setInstance] = useState();
    const [isInitalized, setInitialized] = useState(false);
    const [inputs, setInputs] = useState();
    const [loading, setLoading] = useState(true);

    // Messages
    // const [messages, setMessages] = useState([]);
    // const [input, handleInputChange] = useState('');

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

        console.log(inputs)

        instance.break();

        instance.type(inputs.primaryUser, { instant: true });

        instance.options({
            afterComplete: () => setLoading(false)
        }).go();
    };

    const setInput = (value) => handleInputChange({ target: { value } });

    // const onKeyDown = useCallback((e) => {

    //     if (open && isInitalized && !loading) {
    //         e.preventDefault();
    //         console.log(e.key);
    //         console.log(e.code);
    //         if (e.key === 'Enter' && !e.shiftKey) {
    //             if (e.shiftKey) {
    //                 handleInputChange(input + '\n');
    //                 instance.break().flush();
    //             } else {
    //                 sendMessage(input);
    //                 handleInputChange('');
    //             }
    //         } else if (e.key === 'Backspace') {
    //             if (input.length > 0) {
    //                 handleInputChange(input.substring(0, input.length - 1));
    //                 instance.delete(1).flush();
    //             }
    //         } else if (e.key === 'ArrowLeft') {
    //             if (cursorRef.current < input.length) {
    //                 cursorRef.current -= 1;
    //                 instance.move(-1).flush();
    //             }
    //         } else if (e.key === 'ArrowRight') {
    //             if (cursorRef.current > 0) {
    //                 cursorRef.current += 1;
    //                 instance.move(1).flush();
    //             }
    //         } else if (e.key === 'Dead') {
    //             console.log(e)
    //             if (deadKeyRef.current) {
    //                 handleInputChange(input + deadKeys[deadKeyRef.current] + deadKeys[e.code]);
    //                 instance.type(deadKeys[deadKeyRef.current] + deadKeys[e.code], { instant: true }).flush();
    //                 deadKeyRef.current = null;
    //             } else {
    //                 deadKeyRef.current = e.code;
    //             }
    //         } else if (!controlKeys.includes(e.key)) {
    //             handleInputChange(input + e.key);
    //             instance.type(e.key, { instant: true }).flush();
    //         }
    //     }
    // }, [open, instance, isInitalized, loading, input]);

    const onKeyDown = useCallback((e) => {
        if (open && isInitalized && !loading) {
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
    }, [open, isInitalized, loading, instance, input]);

    const onInput = useCallback((e) => {
        if (open && isInitalized && !loading) {
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
    }, [open, isInitalized, loading, instance, input]);

    // const onCompositionStart = (e) => {
    //     console.log(e);
    // }

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
        if (open && instance && inputs && !isInitalized) {
            writeInputs();
            setInitialized(true);
        }
    }, [open, instance, inputs]);

    useEffect(() => {
        console.log(messages)
        const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1] : null;
        if (instance && !isLoadingMessages && lastMessage && lastMessage.role === 'assistant') {
            instance
                .break()
                .type(inputs.aiUser, { instant: true });
            const response = lastMessage.content;
            splitText(response).forEach((line) => {
                instance.type(line, { instant: true }).break();
            });
            instance.type(inputs.primaryUser, { instant: true });
            instance.flush();
        }
    }, [instance, isLoadingMessages, messages]);

    console.log(isLoadingMessages);

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
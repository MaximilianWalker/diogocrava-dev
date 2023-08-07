'use client';

import { useEffect, useState, useRef } from "react";

import Prism from "prismjs";

// Languages
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-python";

// Themes
import "./darkPlusPrismTheme.css";

import TypeIt from "typeit-react";
import { Maximize, X } from 'react-feather';
import styles from './terminal.module.css';
import { useTerminal } from "@/contexts/TerminalContext";

function splitText(text) {
    const lines = text.split(/\r?\n/);
    // for (let i = 0; i < lines.length; i++) {
    //     const line = lines[i];
    //     if (line.length > 100) {
    //         lines[i] = line.substring(0, 100);
    //         lines.splice(i + 1, 0, line.substring(100));
    //     }
    // }
    return lines;
}

export default function Terminal({ }) {
    const containerRef = useRef();
    const tabRef = useRef();
    const mouseDelta = useRef();

    const {
        open,
        toggleTerminal,
        toggleMaximized
    } = useTerminal();

    // Terminal
    const [containerPosition, setContainerPosition] = useState();
    const [isDragging, setDragging] = useState();

    // Startup
    const [instance, setInstance] = useState();
    const [isInitalized, setInitialized] = useState(false);
    // const [linuxStartup, setLinuxStartup] = useState();
    // const [osMessage, setOsMessage] = useState();
    const [inputs, setInputs] = useState();

    // Messages
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);

    const getLinuxStartup = async () => {
        const response = await fetch('/inputs/linux_startup.txt');
        const text = await response.text();
        setLinuxStartup(splitText(text));
    }

    const getOsMessage = async () => {
        const response = await fetch('/inputs/os.txt');
        const text = await response.text();
        setOsMessage(splitText(text));
    }

    const getInputs = async () => {
        let newInputs = {};

        let response = await fetch('/inputs/linux_startup.txt');
        newInputs.linuxStartup = splitText(await response.text());

        response = await fetch('/inputs/os.txt');
        newInputs.osMessage = splitText(await response.text());

        response = await fetch('/inputs/primary_user.txt');
        newInputs.primaryUser = splitText(await response.text());

        response = await fetch('/inputs/ai_user.txt');
        newInputs.aiUser = splitText(await response.text());

        setInputs(newInputs);
    }

    const onMouseDown = (e) => {
        mouseDelta.current = {
            x: e.clientX - containerRef.current.offsetLeft,
            y: e.clientY - containerRef.current.offsetTop
        };
        setDragging(true);
    };

    const onMouseUp = () => {
        mouseDelta.current = null;
        setDragging(false);
    };

    const onMouseMove = (e) => {
        if (!mouseDelta.current) return;
        setDragging(true);
        setContainerPosition({
            x: e.clientX - mouseDelta.current.x,
            y: e.clientY - mouseDelta.current.y
        });
    };

    useEffect(() => {
        getInputs();
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    useEffect(() => {
        if (open && !isInitalized && instance && inputs) {
            instance.reset();
            inputs.linuxStartup.forEach((line) => {
                if (line.trim().length > 0)
                    instance.type(line, { instant: true }).pause(Math.random() * 600).break();
                else
                    instance.type(line, { instant: true }).break();
            });
            inputs.osMessage.forEach((line) => {
                instance.type(line, { instant: true }).break();
            });
            instance.go();
            setInitialized(true);
        } else if(isInitalized){
            instance.go();
        }
    }, [open, instance, inputs]);

    useEffect(() => {
        if (instance) {
            instance.reset();
            messages.forEach((message) => {
                message.forEach((line) => {
                    instance.type(line, { instant: true }).break().pause(300);
                });
            });
            instance.go();
        }
    }, [instance, messages]);

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
            </div>
        </div>
    );
}
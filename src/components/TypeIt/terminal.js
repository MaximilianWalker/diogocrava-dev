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
import styles from './terminal.module.css';

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

export default function Terminal({ background = false }) {
    const containerRef = useRef();
    const tabRef = useRef();
    const mouseDelta = useRef();

    const [instance, setInstance] = useState();
    const [containerPosition, setContainerPosition] = useState();
    const [isDragging, setDragging] = useState();

    const [isInitalized, setInitialized] = useState(false);
    const [linuxStartup, setLinuxStartup] = useState();
    const [osMessage, setOsMessage] = useState();
    const [messages, setMessages] = useState([]);

    const getLinuxStartup = async () => {
        const response = await fetch('/texts/linux_startup.txt');
        const text = await response.text();
        setLinuxStartup(splitText(text));
    }

    const getOsMessage = async () => {
        const response = await fetch('/texts/os.txt');
        const text = await response.text();
        setOsMessage(splitText(text));
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
        getLinuxStartup();
        getOsMessage();

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    useEffect(() => {
        if (!isInitalized && instance && linuxStartup && osMessage) {
            console.log(linuxStartup);
            console.log(osMessage);
            instance.reset();
            linuxStartup.forEach((line) => {
                if (line.trim().length > 0)
                    instance.type(line, { instant: true }).pause(Math.random() * 600).break();
                else
                    instance.type(line, { instant: true }).break();
            });
            osMessage.forEach((line) => {
                instance.type(line, { instant: true }).break();
            });
            instance.go();
            setInitialized(true);
        }
    }, [instance, linuxStartup, osMessage]);

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
                left: containerPosition?.x ?? undefined
            }}
        >
            <div
                ref={tabRef}
                className={styles.tab}
                onMouseDown={onMouseDown}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
                <span><b>{'>_ Terminal'}</b></span>
                <button>x</button>
            </div>
            <div className={styles.terminalContainer}>
                <TypeIt
                    className={styles.terminal}
                    as="pre"
                    options={{
                        cursorChar: "_",
                        speed: 1,
                        nextStringDelay: 0,
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
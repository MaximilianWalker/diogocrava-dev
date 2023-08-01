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

export default function Terminal({ background = false }) {
    const containerRef = useRef();
    const tabRef = useRef();
    const mouseDelta = useRef();

    const [instance, setInstance] = useState();
    const [containerPosition, setContainerPosition] = useState();
    const [isDragging, setDragging] = useState();

    const [messages, setMessages] = useState([]);

    const getInitialMessage = async () => {
        const response = await fetch('/texts/diogocrava_os.txt');
        const initialMessage = await response.text();
        console.log(response.body);
        console.log(initialMessage);

        const messageLines = initialMessage.split('\n');
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            if (message.length > 100) {
                messages[i] = message.substring(0, 100);
                messages.splice(i + 1, 0, message.substring(100));
            }
        }

        setMessages([...messages, messageLines]);
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
        getInitialMessage();
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    useEffect(() => {
        if (instance) {
            instance.reset();
            messages.forEach((message) => {
                message.forEach((line) => {
                    instance.type(line).break();
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
                        // loop: true,
                        // lifeLike: true,
                        // deleteSpeed: 100,
                        // html: true
                    }}
                    // getBeforeInit={(instance) => {
                    //     // messages.forEach((message) => {
                    //     //     message.forEach((line) => {
                    //     //         instance.type(line);
                    //     //         instance.break();
                    //     //     })
                    //     // })
                    //     setInstance(instance);
                    //     return instance;
                    // }}
                    getAfterInit={(instance) => {
                        setInstance(instance);
                        return instance;
                    }}

                />
            </div>
        </div>
    );
}
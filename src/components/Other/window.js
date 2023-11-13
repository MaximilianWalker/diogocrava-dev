// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback } from "react";

import { Maximize, X } from 'react-feather';
import styles from './window.module.css';
import useDrag from "@/hooks/useDrag";

export default function Window({
    className,
    name,
    open,
    initialPosition,
    maximized,
    draggable,
    hasMaximize,
    hasClose,
    onOpen,
    onClose,
    onMaximize,
    onRestore,
    children
}) {
    const containerRef = useRef();
    const tabRef = useRef();

    const {
        isDragging,
        position: containerPosition,
        onMouseDown
    } = useDrag(containerRef, initialPosition);

    return (
        <div
            ref={containerRef}
            className={styles.window}
            style={{
                top: containerPosition.y,
                left: containerPosition.x,
                visibility: open ? 'visible' : 'hidden'
            }}
        >
            <div
                ref={tabRef}
                className={styles.tab}
                onMouseDown={draggable ? onMouseDown : undefined}
                style={{ cursor: draggable ? 'pointer' : isDragging ? 'grabbing' : 'grab' }}
            >
                <span><b>{name}</b></span>
                {hasMaximize ? <button onClick={onMaximize}><Maximize /></button> : null}
                {hasClose ? <button onClick={onClose}><X /></button> : null}
            </div>
            <div className={`${styles.content} ${className ?? ''}`}>
                {children}
            </div>
        </div>
    );
}
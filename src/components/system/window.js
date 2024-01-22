// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import { Maximize, Minimize, X } from 'react-feather';
import useDrag from "@/hooks/useDrag";
import './window.css';

const Window = forwardRef(({
    className,
    name,
    open = true,
    initialPosition,
    maximized,
    draggable,
    maximizable,
    closable,
    onOpen,
    onClose,
    onMaximize,
    onRestore,
    style,
    children
}, ref) => {
    const containerRef = useRef(ref);
    const tabRef = useRef();

    const {
        isDragging,
        position,
        onMouseDown
    } = useDrag(containerRef, initialPosition);

    const preventWheel = (e) => {
        // e.preventDefault();
        e.stopPropagation();
    };

    useEffect(() => {
        if (containerRef.current)
            containerRef.current.addEventListener("wheel", preventWheel);

        return () => {
            containerRef.current.removeEventListener("wheel", preventWheel);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`window ${className ?? ''}`}
            style={{
                top: position.y,
                left: position.x,
                visibility: open ? 'visible' : 'hidden'
            }}
        >
            <div
                ref={tabRef}
                className="window__tab"
                onMouseDown={draggable ? onMouseDown : undefined}
                style={{ cursor: draggable ? isDragging ? 'grabbing' : 'grab' : 'default' }}
            >
                <span><b>{name}</b></span>
                {
                    maximizable ?
                        <button onClick={onMaximize}>
                            {maximized ? <Minimize /> : <Maximize />}
                        </button>
                        :
                        null
                }
                {
                    closable ?
                        <button onClick={onClose}>
                            <X />
                        </button>
                        :
                        null
                }
            </div>
            <div className="window__content">
                {children}
            </div>
        </div>
    );
});

export default Window;
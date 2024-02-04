// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import { Maximize, Minimize, X } from 'react-feather';
import useDrag from "@/hooks/useDrag";
import useResizable from "@/hooks/useResizable";
import useMousePositionEdge from "@/hooks/useMousePositionEdge";
import { getCursorForEdgePosition } from "@/utils/systemUtils";
import './window.css';

const Window = forwardRef(({
    className,
    name,
    open = true,
    initialPosition,
    maximized,
    draggable,
    resizable,
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
        onMouseDown: onDragMouseDown
    } = useDrag(containerRef, initialPosition);

    const {
        edge: mouseEdge,
        onMouseMove
    } = useMousePositionEdge();

    const {
        size,
        onMouseDown: onResizeMouseDown
    } = useResizable(containerRef);

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
                width: size.width,
                height: size.height,
                cursor: resizable ? getCursorForEdgePosition(mouseEdge) : 'default',
                visibility: open ? 'visible' : 'hidden'
            }}
        >
            <div
                ref={tabRef}
                className="window__tab"
                onMouseDown={draggable ? onDragMouseDown : undefined}
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
            <div
                className="window__content"
                onMouseMove={onMouseMove}
                onMouseDown={resizable && mouseEdge ? onResizeMouseDown : undefined}
            >
                {children}
            </div>
        </div>
    );
});

export default Window;
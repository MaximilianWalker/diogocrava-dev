// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef, useLayoutEffect, useContext } from "react";
import { Maximize, Minimize, X } from 'react-feather';
import useDrag from "@/hooks/useDrag";
import useResizable from "@/hooks/useResizable";
import { getCursorForEdgePosition } from "@/utils/systemUtils";
import './window.css';
import { useWindowManager } from "@/contexts/WindowManagerContext";

const Window = forwardRef(({
    className,
    name,
    defaultOpen,
    open: openProp,
    initialPosition,
    defaultMaximized,
    maximized: maximizedProp,
    draggable,
    resizable,
    maximizable,
    closable,
    onOpen: onOpenProp,
    onClose: onCloseProp,
    onMaximize: onMaximizeProp,
    onRestore: onRestoreProp,
    style,
    children
}, ref) => {
    const containerRef = useRef(ref);
    const tabRef = useRef();
    const contentRef = useRef();

    const [internalOpen, setOpen] = useState(defaultOpen);
    const open = openProp !== undefined ? openProp : internalOpen;

    const [internalMaximized, setMaximized] = useState(defaultMaximized);
    const maximized = maximizedProp !== undefined ? maximizedProp : internalMaximized;

    const {
        layers,
        registerWindow,
        unregisterWindow,
        bringToFront
    } = useWindowManager();

    const {
        isDragging,
        position,
        onMouseDown: onDragMouseDown
    } = useDrag(containerRef, initialPosition);

    const {
        size,
        mouseEdge,
        onMouseDown: onResizeMouseDown
    } = useResizable(contentRef);

    const preventWheel = (e) => {
        // e.preventDefault();
        e.stopPropagation();
    };

    const onOpen = () => {
        setOpen(true);
        if (onOpenProp) onOpenProp();
    };

    const onClose = () => {
        setOpen(false);
        if (onCloseProp) onCloseProp();
    };

    const onMaximize = () => {
        setMaximized(true);
        if (onMaximizeProp) onMaximizeProp();
    };
    
    const onRestore = () => {
        setMaximized(false);
        if (onRestoreProp) onRestoreProp();
    };

    useEffect(() => {
        registerWindow(name);
        return () => unregisterWindow(name);
    }, []);

    useEffect(() => {
        if (containerRef.current)
            containerRef.current.addEventListener("wheel", preventWheel);

        return () => {
            if (containerRef.current)
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
                visibility: open  ? 'visible' : 'hidden'
            }}
        >
            <div className="window__header">
                <div
                    ref={tabRef}
                    className="window__tab"
                    onMouseDown={draggable ? onDragMouseDown : undefined}
                    style={{ cursor: draggable ? isDragging ? 'grabbing' : 'grab' : 'default' }}
                >
                    <span><b>{name}</b></span>
                    {
                        maximizable ?
                            <button className="window__icon-button" onClick={maximized ? onRestore : onMaximize}>
                                {maximized ? <Minimize /> : <Maximize />}
                            </button>
                            :
                            null
                    }
                    {
                        closable ?
                            <button className="window__icon-button" onClick={onClose}>
                                <X />
                            </button>
                            :
                            null
                    }
                </div>
            </div>
            <div
                ref={contentRef}
                className="window__content"
                onMouseDown={resizable ? onResizeMouseDown : undefined}
            >
                {children}
            </div>
        </div>
    );
});

export default Window;
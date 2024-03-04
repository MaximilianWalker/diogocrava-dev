// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef, useLayoutEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Maximize, Minimize, X } from 'react-feather';
import useDrag from "@/hooks/useDrag";
import useResizable from "@/hooks/useResizable";
import { getCursorForEdgePosition } from "@/utils/systemUtils";
import { useWindowManager, ACTIONS } from "@/contexts/WindowManagerContext";
import './window.css';

const Window = forwardRef(({
    className,
    id,
    name,
    icon: Icon,
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
        action,
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

    const onToggle = () => {
        setOpen((prevOpen) => !prevOpen);
        if (open) onClose();
        else onOpen();
    }

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
        registerWindow(id);
        return () => unregisterWindow(id);
    }, []);

    useEffect(() => {
        if (containerRef.current)
            containerRef.current.addEventListener("wheel", preventWheel);

        return () => {
            if (containerRef.current)
                containerRef.current.removeEventListener("wheel", preventWheel);
        };
    }, []);

    useEffect(() => {
        if (!action.id || action.id === id) {
            switch (action.type) {
                case ACTIONS.TOGGLE:
                    onToggle();
                    break;
                case ACTIONS.OPEN:
                    onOpen();
                    break;
                case ACTIONS.CLOSE:
                    onClose();
                    break;
                case ACTIONS.MAXIMIZE:
                    onMaximize();
                    break;
                case ACTIONS.RESTORE:
                    onRestore();
                    break;
                case ACTIONS.MOVE:
                    break;
                case ACTIONS.RESIZE:
                    break;
                default:
                    break;
            }
        }
    }, [action]);

    return (
        <div
            ref={containerRef}
            className={`window ${className ?? ''}`}
            onMouseDown={() => bringToFront(id)}
            style={{
                top: position.y,
                left: position.x,
                width: size.width,
                height: size.height,
                zIndex: layers.indexOf(id),
                cursor: resizable ? getCursorForEdgePosition(mouseEdge) : 'default',
                visibility: open ? 'visible' : 'hidden'
            }}
        >
            <div className="window__header">
                <div
                    ref={tabRef}
                    className="window__tab"
                    data-icon={!!Icon}
                    onMouseDown={draggable ? onDragMouseDown : undefined}
                    style={{ cursor: draggable ? isDragging ? 'grabbing' : 'grab' : 'default' }}
                >
                    {Icon ? <Icon /> : null}
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
            <div className="window__body">
                <div
                    ref={contentRef}
                    className="window__content"
                    onMouseDown={resizable ? onResizeMouseDown : undefined}
                >
                    {children}
                </div>
            </div>
        </div>
    );
});

Window.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    draggable: PropTypes.bool,
    resizable: PropTypes.bool,
    defaultOpen: PropTypes.bool,
    defaultMaximized: PropTypes.bool,
    className: PropTypes.string,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onMaximize: PropTypes.func,
    onRestore: PropTypes.func
};

export default Window;
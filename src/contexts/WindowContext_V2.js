'use client';

import { useState, useContext, createContext } from "react";

export const WindowProvider = ({ context: Context, children }) => {
    const [open, setOpen] = useState(false);
    const [maximized, setMaximized] = useState(false);

    const { 
        registerWindow, 
        unregisterWindow 
    } = useWindowManager();

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

    return (
        <Context.Provider value={{
            windows,
            registerWindow,
            unregisterWindow,
            setWindow,
            setOpen,
            setMaximized,
            bringToFront
        }}>
            {children}
        </Context.Provider>
    );
};
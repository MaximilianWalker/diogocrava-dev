'use client';

import useDrag from "@/hooks/useDrag";
import useResizable from "@/hooks/useResizable";
import { useState, useContext, createContext, useMemo, useRef } from "react";

const WindowManagerContext = createContext();

const WindowProvider = ({ context: Context, children }) => {
    // const  = useContext(WindowManagerContext);
    const containerRef = useRef(ref);
    const tabRef = useRef();

    const [open, setOpen] = useState(false);
    const [maximized, setMaximized] = useState(false);

    const {
        isDragging,
        position,
        onMouseDown: onDragMouseDown
    } = useDrag(containerRef, initialPosition);

    const {
        size,
        onMouseDown: onResizeMouseDown
    } = useResizable(containerRef);

    return (
        <Context.Provider value={{
            open,
            maximized,
            isDragging,
            position,
            size,
            mouseEdge,
            onMouseMove,
            setOpen,
            setMaximized,
            onDragMouseDown,
            onResizeMouseDown//,
            // bringToFront
        }}>
            {children}
        </Context.Provider>
    );
};

export const WindowManagerProvider = ({ children }) => {
    const [windows, setWindows] = useState([]);

    const registerWindow = (id) => {
        const context = createContext();
        setWindows((prevState) => [
            ...prevState,
            { id, context }
        ]);
        return context;
    };

    const unregisterWindow = (id) => setWindows((prevState) => (
        prevState.filter((window) => window.id !== id)
    ));

    const useWindow = (id) => {
        const window = windows.find((window) => window.id === id);
        return window ? useContext(window.context) : null;
    }

    const AccumulatedContext = useMemo(() => (
        windows.reduce(
            (Accumulator, window) => (
                ({ children }) => (
                    <Accumulator>
                        <WindowProvider context={window.context}>
                            {children}
                        </WindowProvider>
                    </Accumulator>
                )
            ),
            ({ children }) => <>{children}</>
        )
    ));

    console.log(windows)

    return (
        <WindowManagerContext.Provider value={{
            windows,
            useWindow,
            registerWindow,
            unregisterWindow
        }}>
            <AccumulatedContext>
                {children}
            </AccumulatedContext>
        </WindowManagerContext.Provider>
    );
};

export const WindowManagerConsumer = WindowManagerContext.Consumer;

export const useWindowManager = () => useContext(WindowManagerContext);
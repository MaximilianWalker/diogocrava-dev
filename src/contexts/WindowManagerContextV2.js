'use client';

import useDrag from "@/hooks/useDrag";
import useResizable from "@/hooks/useResizable";
import { useState, useContext, createContext, useMemo, useRef } from "react";

const WindowManagerContext = createContext();

const WindowProvider = ({ context: Context, children }) => {
    // const  = useContext(WindowManagerContext);
    const containerRef = useRef();
    const tabRef = useRef();
    const contentRef = useRef();

    const [open, setOpen] = useState(false);
    const [maximized, setMaximized] = useState(false);

    const {
        isDragging,
        position,
        onMouseDown: onDragMouseDown
    } = useDrag(containerRef);

    const {
        size,
        mouseEdge,
        onMouseDown: onResizeMouseDown
    } = useResizable(contentRef);

    return (
        <Context.Provider value={{
            open,
            maximized,
            isDragging,
            position,
            size,
            mouseEdge,
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
    const [contexts, setContexts] = useState({});

    const registerWindow = (id, defaults) => {
        console.log('registering', id)
        console.log(Object.values(contexts).length)
        const context = createContext();
        setContexts((prevState) => ({
            ...prevState,
            [id]: context
        }));
        return context;
    };

    const unregisterWindow = (id) => {
        console.log('unregistering', id);
        setContexts((prevState) => {
            delete prevState[id];
            return prevState;
        });
    };

    const useWindow = (id, defaults = {}) => {
        const context = contexts[id];
        console.log(context)
        console.log(context ? useContext(context) : null)
        console.log(contexts)
        // if (!context) return registerWindow(id, defaults);
        return context ? useContext(context) : null;
    };

    const AccumulatedContext = useMemo(() => (
        Object.values(contexts).reduce(
            (Accumulator, context) => (
                ({ children }) => (
                    <Accumulator>
                        <WindowProvider context={context}>
                            {children}
                        </WindowProvider>
                    </Accumulator>
                )
            ),
            ({ children }) => <>{children}</>
        )
    ));

    return (
        <WindowManagerContext.Provider value={{
            contexts,
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
'use client';

import { useState, useContext, createContext } from "react";

const WindowContext = createContext();

export const WindowProvider = ({ children }) => {
    const [windows, setWindows] = useState([]);

    const registerWindow = (window) => setWindows((prevState) => [...prevState, window]);

    const unregisterWindow = (id) => setWindows((prevState) => prevState.filter((window) => window.id !== id));

    const setWindow = (id, window) => {
        setWindows((prevState) => prevState.map((w) => {
            if (w.id === id) return window;
            return w;
        }));
    };

    const setOpen = (id, open) => {
        setWindows((prevState) => prevState.map((window) => {
            if (window.id === id) window.open = open;
            return window;
        }));
    };

    const setMaximized = (id, maximized) => {
        setWindows((prevState) => prevState.map((window) => {
            if (window.id === id) window.maximized = maximized;
            return window;
        }));
    };

    const bringToFront = (id) => {
        const { zIndex } = windows.find((window) => window.id === id);
        setWindows((prevState) => {
            prevState.map((window) => {
                if (window.id === id) window.zIndex = prevState.length;
                else if (window.zIndex > zIndex) window.zIndex -= 1;
                return window;
            });
        });
    };

    return (
        <WindowContext.Provider value={{
            windows,
            registerWindow,
            unregisterWindow,
            setWindow,
            setOpen,
            setMaximized,
            bringToFront
        }}>
            {children}
        </WindowContext.Provider>
    );
};

export const WindowConsumer = WindowContext.Consumer;

export const useWindowManager = () => useContext(WindowContext);

export const useWindow = (id) => {
    const {
        windows,
        setWindow: setWindowById,
        setOpen: setOpenById,
        setMaximized: setMaximizedById,
        bringToFront: bringToFrontById
    } = useContext(WindowContext);

    const window = useMemo(() => windows.find(
        (window) => window.id === id
    ), [windows, id]);

    const setWindow = useCallback((window) => setWindowById(id, window), [windows, id]);

    const setOpen = useCallback((open) => setOpenById(id, open), [windows, id]);

    const setMaximized = useCallback((maximized) => setMaximizedById(id, maximized), [windows, id]);

    const bringToFront = useCallback(() => bringToFrontById(id), [windows, id]);

    return {
        ...window,
        setWindow,
        setOpen,
        setMaximized,
        bringToFront
    };
};
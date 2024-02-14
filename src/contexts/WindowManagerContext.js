'use client';

import { useState, useContext, createContext } from "react";

export const ACTIONS = {
    TOGGLE: 'toggle',
    OPEN: 'open',
    CLOSE: 'close',
    MAXIMIZE: 'maximize',
    RESTORE: 'restore',
    MOVE: 'move',
    RESIZE: 'resize'
};

const WindowManagerContext = createContext();

export const WindowManagerProvider = ({ children }) => {
    const [layers, setLayers] = useState([]);
    const [action, setAction] = useState({});

    const registerWindow = (id) => {
        if (layers.includes(id)) throw new Error('Window already registered!');
        setLayers((prevState) => [id, ...prevState]);
    };

    const unregisterWindow = (id) => setLayers((prevState) => prevState.filter((layer) => layer !== id));

    const bringToFront = (id) => setLayers((prevState) => prevState.filter((layer) => layer !== id).concat(id));

    const toggle = (id) => setAction({ id, type: ACTIONS.TOGGLE });

    const open = (id) => setAction({ id, type: ACTIONS.OPEN });

    const close = (id) => setAction({ id, type: ACTIONS.CLOSE });

    const maximize = (id) => setAction({ id, type: ACTIONS.MAXIMIZE });

    const restore = (id) => setAction({ id, type: ACTIONS.RESTORE });

    const move = (id) => setAction({ id, type: ACTIONS.MOVE });

    const resize = (id) => setAction({ id, type: ACTIONS.RESIZE });

    console.log({ layers, action });

    return (
        <WindowManagerContext.Provider value={{
            layers,
            action,
            registerWindow,
            unregisterWindow,
            bringToFront,
            toggle,
            open,
            close,
            maximize,
            restore,
            move,
            resize
        }}>
            {children}
        </WindowManagerContext.Provider>
    );
}

export const WindowManagerConsumer = WindowManagerContext.Consumer;

export const useWindowManager = () => useContext(WindowManagerContext);
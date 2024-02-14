'use client';

import { useState, useContext, createContext } from "react";

const ACTIONS = {
    OPEN: 'open',
    CLOSE: 'close',
    MAXIMIZE: 'maximize',
    MOVE: 'move',
    RESIZE: 'resize'
};

const WindowManagerContext = createContext();

export const WindowManagerProvider = ({ children }) => {
    const [layers, setLayers] = useState([]);
    const [action, setAction] = useState(null);

    const registerWindow = (id) => setLayers((prevState) => [id, ...prevState]);

    const unregisterWindow = (id) => setLayers((prevState) => prevState.filter((layer) => layer !== id));

    const bringToFront = (id) => setLayers((prevState) => prevState.filter((layer) => layer !== id).concat(id));

    const open = (id) => setAction({ id, type: ACTIONS.OPEN });

    const close = (id) => setAction({ id, type: ACTIONS.CLOSE });

    const maximize = (id) => setAction({ id, type: ACTIONS.MAXIMIZE });

    const move = (id) => setAction({ id, type: ACTIONS.MOVE });

    const resize = (id) => setAction({ id, type: ACTIONS.RESIZE });

    return (
        <WindowManagerContext.Provider value={{
            layers,
            action,
            registerWindow,
            unregisterWindow,
            bringToFront,
            open,
            close,
            maximize,
            move,
            resize
        }}>
            {children}
        </WindowManagerContext.Provider>
    );
}

export const WindowManagerConsumer = WindowManagerContext.Consumer;

export const useWindowManager = () => useContext(WindowManagerContext);
'use client';

import { useState, useContext, createContext } from "react";

const TerminalContext = createContext();

export const TerminalProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [maximized, setMaximized] = useState(false);

    const toggleTerminal = () => setOpen((prevState) => !prevState);

    const toggleMaximized = () => setMaximized((prevState) => !prevState);

    return (
        <TerminalContext.Provider value={{
            open,
            setOpen,
            toggleTerminal,
            toggleMaximized
        }}>
            {children}
        </TerminalContext.Provider>
    );
};

export const TerminalConsumer = TerminalContext.Consumer;

export const useTerminal = () => useContext(TerminalContext);
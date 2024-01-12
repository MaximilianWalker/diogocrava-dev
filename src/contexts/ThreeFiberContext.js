'use client';

import { useState, useContext, createContext } from "react";

const ThreeFiberContext = createContext();

export const ThreeFiberProvider = ({ children }) => {
    const [three, setThreeFiber] = useState(0);

    const nextThreeFiber = (size) => {
        if (three < size - 1) setThreeFiber(three + 1);
    }

    const previousThreeFiber = () => {
        if (three > 0) setThreeFiber(three - 1);
    }

    return (
        <ThreeFiberContext.Provider value={{
            three,
            setThreeFiber,
            nextThreeFiber,
            previousThreeFiber
        }}>
            {children}
        </ThreeFiberContext.Provider>
    );
};

export const ThreeFiberConsumer = ThreeFiberContext.Consumer;

export const useThreeFiber = () => useContext(ThreeFiberContext);
'use client';

import { useState, useContext, createContext } from "react";

const SectionContext = createContext();

export const SectionProvider = ({ children }) => {
    const [size, setSize] = useState(0);
    const [section, setSection] = useState(0);

    const nextSection = () => {
        if (section < size - 1) setSection(section + 1);
    }

    const previousSection = () => {
        if (section > 0) setSection(section - 1);
    }

    return (
        <SectionContext.Provider value={{
            section,
            size,
            setSection,
            setSize,
            nextSection,
            previousSection
        }}>
            {children}
        </SectionContext.Provider>
    );
};

export const SectionConsumer = SectionContext.Consumer;

export const useSection = () => useContext(SectionContext);
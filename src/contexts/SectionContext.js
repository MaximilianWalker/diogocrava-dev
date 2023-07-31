'use client';

import { useState, useContext, createContext } from "react";

const SectionContext = createContext();

export const SectionProvider = ({ children }) => {
    const [section, setSection] = useState(0);

    const nextSection = (size) => {
        if (section < size - 1) setSection(section + 1);
    }

    const previousSection = () => {
        if (section > 0) setSection(section - 1);
    }

    return (
        <SectionContext.Provider value={{
            section,
            setSection,
            nextSection,
            previousSection
        }}>
            {children}
        </SectionContext.Provider>
    );
};

export const SectionConsumer = SectionContext.Consumer;

export const useSection = () => useContext(SectionContext);
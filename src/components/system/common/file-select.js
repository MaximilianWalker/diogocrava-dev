'use client';

import { createContext } from "react";
import './select.css';

// create context

const FileSelectContext = createContext({
    size: 0
});

const FileSelect = ({ children }, ref) => {
    return (
        <div>
            {children}
            <div className="select__box" />
        </div>
    );
};

export default { FileSelect,  };
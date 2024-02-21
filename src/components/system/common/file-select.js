'use client';

import { createContext } from "react";
import PropTypes from "prop-types";
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

Select.propTypes = {
    
};

export default { FileSelect,  };
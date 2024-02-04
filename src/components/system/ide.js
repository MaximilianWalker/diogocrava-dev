// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import PropTypes from "prop-types";
import { Home, ChevronLeft, ChevronRight } from 'react-feather';
import usePrevious from "@/hooks/usePrevious";
import './ide.css';

const IDE = forwardRef(({
    className,
    mode,
    name,
    icon: Icon,
    selected,
    onSelect,
    onOpen,
    ...props
}, ref) => {
    return (
        <div 
            ref={ref} 
            className={`file ${className}`} 
            {...props}
        >
            {Icon ? <Icon /> : null}
            <span className="file__text">{name}</span>
        </div>
    );
});

File.propTypes = {
    mode: PropTypes.oneOf(["grid", "list"]).isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,
    onOpen: PropTypes.func
};

export default IDE;
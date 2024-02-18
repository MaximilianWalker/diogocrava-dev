import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import { Home, ChevronLeft, ChevronRight } from 'react-feather';
import usePrevious from "@/hooks/usePrevious";
import './input.css';

const Input = forwardRef(({
    className,
    type = 'text',
    value,
    onChange,
    onKeyDown,
    onKeyUp,
    startIcon: StartIcon,
    endIcon: EndIcon,
    onStartIconClick,
    onEndIconClick
}, ref) => {

    return (
        <div className={`input__wrapper ${className}`}>
            {StartIcon && (
                onStartIconClick ?
                    <button
                        className="input__button"
                        onClick={onStartIconClick}
                    >
                        <StartIcon className="input__icon" />
                    </button>
                    :
                    <StartIcon className="input__icon" />
            )}
            <input
                ref={ref}
                className="input"
                type={type}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
            />
            {EndIcon && (
                onEndIconClick ?
                    <button
                        className="input__button"
                        onClick={onEndIconClick}
                    >
                        <EndIcon className="input__icon" />
                    </button>
                    :
                    <EndIcon className="input__icon" />
            )}
        </div>
    );
});

export default Input;
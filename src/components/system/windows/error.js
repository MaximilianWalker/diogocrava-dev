// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import { Home, ChevronLeft, ChevronRight } from 'react-feather';
import usePrevious from "@/hooks/usePrevious";
import './error.css';

const Error = forwardRef(({ className, rootDirectory, props }, ref) => {

    return (
        <Window
            ref={ref}
            className={`error-window ${className}`}
            {...props}
        >
            
        </Window>
    );
});

export default Error;
// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import { Home, ChevronLeft, ChevronRight } from 'react-feather';
import usePrevious from "@/hooks/usePrevious";
import './notepad.css';

const Notepad = forwardRef(({ className, name, mimetype, content_url, ...props }, ref) => {
    return (
        <Window ref={ref} className={`file-viewer ${className}`} {...props}>
        </Window>
    );
});

export default Notepad;
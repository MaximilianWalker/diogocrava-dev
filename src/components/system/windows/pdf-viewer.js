// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import { Home, ChevronLeft, ChevronRight } from 'react-feather';
import usePrevious from "@/hooks/usePrevious";
import './file-viewer.css';

const FileViewer = forwardRef(({ className, name, mimetype, content_url, ...props }, ref) => {
    const [data, setData] = useState();

    useEffect(() => {
        getFile();
    }, []);

    return (
        <Window ref={ref} className={`file-viewer ${className}`} {...props}>
        </Window>
    );
});

export default FileViewer;
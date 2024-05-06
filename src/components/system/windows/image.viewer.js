// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import { Home, ChevronLeft, ChevronRight } from 'react-feather';
import usePrevious from "@/hooks/usePrevious";
import './notepad.css';

const ImageViewer = forwardRef(({ className, name, mimetype, content_url, ...props }, ref) => {
    const [text, setText] = useState();

    const getFile = async () => {
        try {
            const response = await fetch(contentUrl);
            const responseType = response.headers.get("Content-Type");

            if (mimetype && mimetype !== responseType)
                throw new Error('Mimetype mismatch: ' + mimetype);

            setText(await response.text());
        } catch (error) {
            console.error("Error fetching or parsing content:", error);
        }
    };

    useEffect(() => {
        getFile();
    }, []);

    return (
        <Window ref={ref} className={`file-viewer ${className}`} {...props}>
        </Window>
    );
});

export default ImageViewer;
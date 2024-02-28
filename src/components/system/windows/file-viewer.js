// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef, useMemo } from "react";
import PdfViewer from './pdf-viewer';
import './file-viewer.css';

const FileViewer = forwardRef(({ className, name, mimetype, contentUrl, ...props }, ref) => {
    const [data, setData] = useState();

    const Component = useMemo(() => {
        if (mimetype.includes("application/pdf"))
            return PdfViewer;
        
    })

    const getFile = async () => {
        //         if (jsonData.encoding && jsonData.content) {
        //             const { encoding, content } = jsonData;
        //             if (encoding === 'base64')
        //                 processedContent = atob(content);
        //             else
        //                 throw new Error('Unsupported encoding: ' + encoding);
        //         }

        try {
            const response = await fetch(contentUrl);
            const responseType = response.headers.get("Content-Type");

            if (mimetype && mimetype !== responseType)
                throw new Error('Mimetype mismatch: ' + mimetype);

            if (mimetype.includes("application/json")) {
                return await response.json();
            } else if (mimetype.includes("application/pdf")) {
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();
                return new Uint8Array(arrayBuffer);
            } else if (mimetype.includes("image")) {
                const blob = await response.blob();
                return URL.createObjectURL(blob);
            } else if (mimetype.includes("text")) {
                return await response.text();
            } else {
                return await response.blob();
            }
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

export default FileViewer;
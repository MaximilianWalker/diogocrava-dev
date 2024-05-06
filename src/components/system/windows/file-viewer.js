// https://sdk.vercel.ai/docs
'use client';

import {
    useEffect,
    useState,
    useRef,
    useCallback,
    useMemo,
    useId,
    forwardRef
} from "react";
import PropTypes from "prop-types";
import Window from "../common/window";
import Notepad from './notepad';
import PdfViewer from './pdf-viewer';
import MarkdownViewer from './markdown-viewer';
import ImageViewer from "./image.viewer";
import IDE from "./ide";
import './file-viewer.css';

const FileViewer = forwardRef(({ className, name, mimetype, contentUrl, ...props }, ref) => {
    const id = useId();
    const [data, setData] = useState();

    const Component = useMemo(() => {
        if (mimetype.includes("application/pdf"))
            return PdfViewer;
        else if (mimetype.includes("application/json"))
            return IDE;
        else if (mimetype.includes("image"))
            return ImageViewer;
        else if (mimetype.includes("text"))
            return MarkdownViewer;
        else
            return Notepad;
    })

    const getData = async () => {
        //         if (jsonData.encoding && jsonData.content) {
        //             const { encoding, content } = jsonData;
        //             if (encoding === 'base64')
        //                 processedContent = atob(content);
        //             else
        //                 throw new Error('Unsupported encoding: ' + encoding);
        //         }

        try {
            const response = await fetch(contentUrl);
            // const responseType = response.headers.get("Content-Type");

            // if (mimetype && mimetype !== responseType)
            //     throw new Error('Mimetype mismatch: ' + mimetype);

            if (mimetype.includes("application/json")) {
                setData(await response.json());
            } else if (mimetype.includes("application/pdf")) {
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();
                setData(new Uint8Array(arrayBuffer));
            } else if (mimetype.includes("image")) {
                const blob = await response.blob();
                setData(URL.createObjectURL(blob));
            } else if (mimetype.includes("text")) {
                setData(response.text());
            } else {
                setData(await response.blob());
            }
        } catch (error) {
            console.error("Error fetching or parsing content:", error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Window
            ref={ref}
            id={id}
            className={`file-viewer ${className}`}
            name={name}
            defaultOpen
            draggable
            maximizable
            resizable
            closable
            {...props}
        >
            <Component
                mimetype={mimetype}
                data={data}
            />
        </Window>
    );
});

FileViewer.propTypes = {
    name: PropTypes.string.isRequired,
    mimetype: PropTypes.string.isRequired,
    contentUrl: PropTypes.string.isRequired
};

export default FileViewer;
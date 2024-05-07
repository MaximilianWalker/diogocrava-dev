'use client';

import {
    useEffect,
    useState,
    useRef,
    useCallback,
    useMemo,
    useId,
    forwardRef
} from 'react';
import PropTypes from 'prop-types';
import Window from '@/components/system/common/window';
import Loading from '@/components/type-it/loading';
import { getProgrammingLanguage } from '@/utils/mimeToLanguage.js';
import Notepad from './notepad';
import PdfViewer from './pdf-viewer';
import MarkdownViewer from './markdown-viewer';
import ImageViewer from "./image.viewer";
import IDE from "./ide";
import './file-viewer.css';

const FileViewer = forwardRef(({ className, name, mimetype, contentUrl, ...props }, ref) => {
    const id = useId();
    const [data, setData] = useState();

    const ProgrammingLanguage = useMemo(() => getProgrammingLanguage(mimetype), [mimetype]);

    const Component = useMemo(() => {
        if (mimetype.includes("application/pdf"))
            return PdfViewer;
        else if (ProgrammingLanguage)
            return IDE;
        else if (mimetype.includes("image"))
            return ImageViewer;
        else if (mimetype.includes("text"))
            return MarkdownViewer;
        else
            return Notepad;
    }, [mimetype]);

    console.log(mimetype);
    console.log(ProgrammingLanguage);
    console.log(Component);

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

            // console.log(mimetype);
            // console.log(response)
            // console.log(response.body)
            // const kek = response.text();

            // console.log(kek)
            // console.log('lmao')
            // kek.then(() => console.log('super keks maximus'))
            // const lol = await kek;
            // console.log(lol)
            // console.log('kek')

            if (getProgrammingLanguage(mimetype)) {
                setData(await response.text());
            } else if (mimetype.includes("application/pdf")) {
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();
                setData(new Uint8Array(arrayBuffer));
            } else if (mimetype.includes("image")) {
                const blob = await response.blob();
                setData(URL.createObjectURL(blob));
            } else if (mimetype.includes("text")) {
                setData(await response.text());
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

    console.log(data);

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
            {
                data ?
                    <Component
                        mimetype={mimetype}
                        data={data}
                    />
                    :
                    <Loading />
            }
        </Window>
    );
});

FileViewer.propTypes = {
    name: PropTypes.string.isRequired,
    mimetype: PropTypes.string.isRequired,
    contentUrl: PropTypes.string.isRequired
};

export default FileViewer;
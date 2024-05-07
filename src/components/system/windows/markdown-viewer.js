'use client';

import { forwardRef } from 'react';
import Markdown from '@/components/common/markdown';
import './markdown-viewer.css';

const FileViewer = forwardRef(({ className, mimetype, data, ...props }, ref) => {
    return (
        <Markdown
            ref={ref}
            className={`markdown-viewer ${className}`}
            {...props}
        >
            {data}
        </Markdown>
    );
});

export default FileViewer;
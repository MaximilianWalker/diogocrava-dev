'use client';

import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import Code from "@/components/common/code";
import './markdown-viewer.css';

const FileViewer = forwardRef(({ className, mimetype, data, ...props }, ref) => {
    return (
        <Markdown
            ref={ref}
            className={`markdown-viewer ${className}`}
            children={data}
            components={{
                code({ children, className, node, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                        <Code
                            children={String(children).replace(/\n$/, '')}
                            language={match[1]}
                            code={node}
                            {...props}
                        />
                    ) : (
                        <code {...rest} className={className}>
                            {children}
                        </code>
                    )
                }
            }}
            {...props}
        />
    );
});

export default FileViewer;
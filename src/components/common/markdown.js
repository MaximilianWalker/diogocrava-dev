'use client';

import { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Code from "./code";
import './markdown.css';

// https://github.com/remarkjs/react-markdown
const Markdown = forwardRef(({ className, children, ...props }, ref) => {
    return (
        <ReactMarkdown
            ref={ref}
            className={`markdown ${className}`}
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

export default Markdown;
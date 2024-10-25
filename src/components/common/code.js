
'use client';

import { useEffect, useMemo } from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { lioshi } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import "./code.css";

// Github
// https://github.com/react-syntax-highlighter/react-syntax-highlighter

// Styles
// https://react-syntax-highlighter.github.io/react-syntax-highlighter/demo/

function Code({ className, code, language, showLineNumbers }) {
    return (
        <SyntaxHighlighter
            className={`code ${className ?? ''}`}
            language={language}
            style={lioshi}
            showLineNumbers={showLineNumbers}
        >
            {code}
        </SyntaxHighlighter>
    );
};

export default Code;
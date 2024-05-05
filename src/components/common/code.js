
'use client';

import { useEffect, useMemo } from "react";
import PropTypes from 'prop-types';
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
            className={className}
            language={language}
            style={lioshi}
            // PreTag="div"
            showLineNumbers={showLineNumbers}
            // useInlineStyles
        >
            {code}
        </SyntaxHighlighter>
    );
};

Code.propTypes = {
    className: PropTypes.string,
    code: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    showLineNumbers: PropTypes.bool
};

export default Code;
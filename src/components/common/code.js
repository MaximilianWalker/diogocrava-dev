import { useEffect } from "react";

import Prism from "prismjs";
import "./code.css";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-xml-doc";
import "prismjs/components/prism-python";

export default function Code({ className, code, language, showLineNumbers }) {
    useEffect(() => {
        Prism.highlightAll();
    }, [code, language]);
    return (
        <div className="code__container">
            {
                showLineNumbers &&
                <div className="code__line-numbers">
                    {
                        code.split('\n').map((line, index) => <p key={index} className="code__line-number">{index + 1}</p>)
                    }
                </div>
            }
            <pre className={`language-${language} ${className}`}>
                <code className={`language-${language}`}>
                    {code}
                </code>
            </pre>
        </div>
    );
}
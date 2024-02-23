import { useEffect } from "react";

import Prism from "prismjs";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-xml-doc";
import "prismjs/components/prism-python";

export default function PrismViewer({ className, code, language }) {
    useEffect(() => {
        Prism.highlightAll();
    }, [code, language]);
    return (
        <pre className={`language-${language} ${className}`}>
            <code className={`language-${language}`}>
                {code}
            </code>
        </pre>
    );
}
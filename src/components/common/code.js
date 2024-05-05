
'use client';

import { useEffect, useMemo } from "react";
import PropTypes from 'prop-types';
// import Prism from "prismjs";
import SyntaxHighlighter from 'react-syntax-highlighter';

// import { SyntaxHighlighter } from 'react-syntax-highlighter';
import { lioshi } from 'react-syntax-highlighter/dist/esm/styles/hljs';


import "./code.css";

// import "prismjs/components/prism-javascript";
// import "prismjs/components/prism-jsx";
// import "prismjs/components/prism-json";
// import "prismjs/components/prism-xml-doc";
// import "prismjs/components/prism-python";
// import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
// import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

// function Code({ className, code, language, showLineNumbers }) {
//     useEffect(() => {
//         Prism.highlightAll();
//     }, [code, language]);
//     return (
//         <div className="code__container">
//             <pre className={`line-numbers language-${language} ${className ?? ''}`}>
//                 <code>
//                     {code}
//                 </code>
//             </pre>
//         </div>
//     );
// };

// function Code({ className, code, language, showLineNumbers }) {
//     // const highlightedCode = useMemo(() => Prism.highlight(code, Prism.languages[language], language), [code, language]);
//     // useEffect(() => {
//     //     Prism.highlightAll();
//     // }, [code, language]);
//     // console.log(highlightedCode);
//     return (
//         <div className="code__container">
//             {/* <SyntaxHighlighter language={language} showLineNumbers>
//                 {code}
//             </SyntaxHighlighter> */}
//             <Markdown
//                 children={code}
//                 components={{
//                     code({ children, className, node, ...rest }) {
//                         return (
//                             <SyntaxHighlighter
//                                 {...rest}
//                                 // PreTag="div"
//                                 // children={String(children).replace(/\n$/, '')}
//                                 language={language}
//                                 style={twilight}
//                             />
//                         );
//                     }
//                 }}
//             />
//         </div>
//     );
// };

function Code({ className, code, language, showLineNumbers }) {
    // const highlightedCode = useMemo(() => Prism.highlight(code, Prism.languages[language], language), [code, language]);
    // useEffect(() => {
    //     Prism.highlightAll();
    // }, [code, language]);
    // console.log(highlightedCode);
    return (
        <div className="code__container">
            <SyntaxHighlighter
                language={language}
                style={lioshi}
                PreTag="div"
                showLineNumbers
                useInlineStyles
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

// function Code({ className, code, language, showLineNumbers }) {
//     const highlightedCode = useMemo(() => Prism.highlight(code, Prism.languages[language], language), [code, language]);
//     // useEffect(() => {
//     //     Prism.highlightAll();
//     // }, [code, language]);
//     // console.log(highlightedCode);
//     return (
//         <div className="code__container">
//             {/* <SyntaxHighlighter language={language} showLineNumbers>
//                 {code}
//             </SyntaxHighlighter> */}
//             <Markdown
//                 children={highlightedCode}
//             />
//         </div>
//     );
// };

// function Code({ className, code, language, showLineNumbers }) {
//     // const highlightedCode = useMemo(() => Prism.highlight(code, Prism.languages[language], language), [code, language]);
//     // useEffect(() => {
//     //     Prism.highlightAll();
//     // }, [code, language]);
//     // console.log(highlightedCode);
//     const highlightedCode = useMemo(() => {
//         const result = unified()
//             .use(remarkParse)
//             .use(remarkRehype, { allowDangerousHtml: true })
//             .use(rehypeSanitize)
//             .use(rehypeStringify)
//             .processSync(code);
//         return result.toString();
//     })
//     return (
//         <div className="code__container">
//             {/* <SyntaxHighlighter language={language} showLineNumbers>
//                 {code}
//             </SyntaxHighlighter> */}
//             <Markdown
//                 children={highlightedCode}
//             />
//         </div>
//     );
// };

Code.propTypes = {
    className: PropTypes.string,
    code: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    showLineNumbers: PropTypes.bool
};

export default Code;
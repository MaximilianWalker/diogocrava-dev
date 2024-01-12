'use client';

import { useEffect } from "react";

import Prism from "prismjs";

// Languages
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-python";

// Themes
import "./darkPlusPrismTheme.css";

import TypeIt from "typeit-react";
import styles from './code.module.css';

function htmlEncode(text) {
    return text.replace(/[\u00A0-\u9999<>\&]/gim, (i) => `&#${i.charCodeAt(0)};`);
}

const addPrismHtml = (code, language) => {
    return `<pre><code className="${language}">${htmlEncode(code)}</code></pre>`;
};

export default function Code({ code, language }) {
    useEffect(() => {
        console.log(Prism.highlight(code, Prism.languages[language], language));
    }, []);
    return (
        <TypeIt
            className={styles.hi}
            options={{
                loop: true,
                lifeLike: true,
                deleteSpeed: 100,
                // html: false
            }}
            getAfterInit={(instance) => {
                // instance.type("<b styles=\"color: white\">&lt;Diogo Cava /&gt;</b>").pause(2000).delete().type("&lt;Fullstack /&gt;").pause(2000);
                instance.type(Prism.highlight(code, Prism.languages[language], language));
                // setInstance(instance);
                return instance;
            }}
        />
    );
}
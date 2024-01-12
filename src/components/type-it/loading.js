'use client';

import { useState, useEffect } from "react";
import TypeIt from "typeit-react";

import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "./darkPlusPrismTheme.css";

import styles from './hi.module.css';

let messages = [
    "Initializing system protocols...",
    "Establishing secure connections...",
    "Synchronizing data streams...",
    "Optimizing performance parameters...",
    "Validating system integrity...",
    `Loading ${section}...`,
    `${section} Loaded Successfully.`
];


export default () => {
    const [buttonText, setButtonText] = useState("Freeze");
    const [instance, setInstance] = useState(null);

    return (
        <h1 className={styles.hi}>
            <TypeIt
                options={{
                    speed: 50,
                    deleteSpeed: 50,
                    cursorChar: "_"
                }}
                getBeforeInit={(instance) => {
                    instance
                    .type("> Hello, World!").pause(1000).delete(6).type("ups...").pause(500).delete(6).type("user! ヽ(´▽`)/").pause(600).break()
                    .type("> My name is <b style=\"color:#4EC9B0;\">Diogo Crava</b>!").pause(500).break()
                    .type(`> And I'm a ${Prism.highlight("<FullStack-Developer />", Prism.languages.jsx, "jsx")}`).pause(20000).break()
                    .type("> Scroll to continue...").pause(20000).break()
                    .type("> Knock knock... is anyone there?");
                    setInstance(instance);
                    return instance;
                }}
            />
        </h1>
    );
};
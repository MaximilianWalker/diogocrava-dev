'use client';

import { useState, useEffect } from "react";
import TypeIt from "typeit-react";

import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "./darkPlusPrismTheme.css";

import styles from './hi.module.css';

export default ({ freeze: freezeProp }) => {
    const [instance, setInstance] = useState();
    const [freeze, setFreeze] = useState(freezeProp);
    const [isComplete, setComplete] = useState(false);

    useEffect(() => {
        if (instance && isComplete && freeze) instance.destroy(false);
    }, [instance, isComplete, freeze]);

    useEffect(() => {
        if (freezeProp) setFreeze(true);
    }, [freezeProp]);

    return (
        <h1 className={styles.hi}>
            <TypeIt
                className={styles.text}
                options={{
                    speed: 50,
                    deleteSpeed: 50,
                    cursorChar: "_"
                }}
                getBeforeInit={(instance) => {
                    instance
                        .type("> Hello, World!").pause(1000).delete(6).type("ups...").pause(500).delete(6).type("user! ヽ(´▽`)/").pause(600).break()
                        .type("> My name is <b style=\"color:#4EC9B0;\">Diogo Crava</b>!").pause(500).break()
                        .type(`> And I'm a ${Prism.highlight("<FullStack-Developer />", Prism.languages.jsx, "jsx")}`)
                        .exec(() => setComplete(true)).pause(20000).break()
                        .type("> Scroll to continue...").pause(20000).break()
                        .type("> Knock knock... is anyone there?");
                    setInstance(instance);
                    return instance;
                }}
            />
        </h1>
    );
};
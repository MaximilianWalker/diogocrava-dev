'use client';

import { useState, useEffect } from "react";
import TypeIt from "typeit-react";
import styles from './logo.module.css';

const LOOP_PAUSE = 5000;

function htmlEncode(text) {
    return text.replace(/[\u00A0-\u9999<>\&]/gim, (i) => `&#${i.charCodeAt(0)};`);
}

export default () => {
    const [buttonText, setButtonText] = useState("Freeze");
    const [instance, setInstance] = useState(null);

    // const toggleFreeze = () => {
    //   if (instance.is("frozen")) {
    //     instance.unfreeze();
    //     setButtonText("Freeze");
    //     return;
    //   }

    //   instance.freeze();
    //   setButtonText("Unfreeze");
    // };

    return (
        <h1 className={styles.logo}>
            <TypeIt
                options={{
                    loop: true,
                    lifeLike: true,
                    deleteSpeed: 100,
                    cursorChar: '_'
                    // html: false
                }}
                getAfterInit={(instance) => {
                    instance
                    .type(htmlEncode("<DiogoCrava />")).pause(LOOP_PAUSE).delete()
                    .type(htmlEncode("<FullStack />")).pause(LOOP_PAUSE).delete()
                    .type(htmlEncode("<Dev />")).pause(LOOP_PAUSE).delete()
                    .type(htmlEncode("<Code />")).pause(LOOP_PAUSE);
                    setInstance(instance);
                    return instance;
                }}
            />
        </h1>
    );
};
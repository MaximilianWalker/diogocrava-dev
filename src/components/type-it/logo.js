'use client';

import { useState, useEffect } from "react";
import TypeIt from "typeit-react";
import styles from './logo.module.css';

const LOOP_PAUSE = 5000;

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
                className={styles.text}
                options={{
                    // loop: true,
                    lifeLike: true,
                    deleteSpeed: 50,
                    cursorChar: '_',
                    html: false
                }}
                getBeforeInit={(instance) => {
                    instance
                        .type("<DiogoCrava />").pause(LOOP_PAUSE).delete()
                        .type("<FullStack />").pause(LOOP_PAUSE).delete()
                        .type("<Dev />").pause(LOOP_PAUSE).delete()
                        .type("<Code />").pause(LOOP_PAUSE).delete()
                        .go();

                    setInstance(instance);
                    return instance;
                }}
            />
        </h1>
    );
};
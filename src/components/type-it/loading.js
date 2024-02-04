'use client';

import { useState, useEffect } from "react";
import TypeIt from "typeit-react";
import styles from './loading.module.css';

const PAUSE_TIME = 600;

export default ({ message = "LOADING" }) => {
    const onAnimation = (instance) => {
        instance
            .type(".")
            .pause(PAUSE_TIME)
            .type(".")
            .pause(PAUSE_TIME)
            .type(".")
            .pause(PAUSE_TIME);
    };

    return (
        <h1 className={styles.container}>
            <TypeIt
                className={styles.text}
                options={{
                    lifeLike: true,
                    loop: true,
                    loopDelay: 0,
                    cursorChar: "",
                    // afterComplete: (instance) => {
                    //     onAnimation(instance);
                    //     instance.flush();
                    // }
                }}
                getBeforeInit={(instance) => {
                    instance
                        .type(message, { instant: true })
                        .type(".")
                        .pause(PAUSE_TIME)
                        .type(".")
                        .pause(PAUSE_TIME)
                        .type(".")
                        .pause(PAUSE_TIME)
                        .delete(1)
                        .pause(PAUSE_TIME)
                        .delete(1)
                        .pause(PAUSE_TIME)
                        .delete(1)
                        .pause(PAUSE_TIME)
                        .empty({ instant: true });

                    // onAnimation(instance);
                    return instance;
                }}
            />
        </h1>
    );
};
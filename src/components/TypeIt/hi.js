'use client';

import { useState, useEffect } from "react";
import TypeIt from "typeit-react";
import styles from './hi.module.css';

export default () => {
    const [buttonText, setButtonText] = useState("Freeze");
    const [instance, setInstance] = useState(null);

    return (
        <h3>
            <TypeIt
                className={styles.hi}
                options={{
                    loop: true,
                    lifeLike: true,
                    deleteSpeed: 100,
                    // html: false
                }}
                getAfterInit={(instance) => {
                    instance.type("<b styles=\"color: white\">&lt;Diogo Cava /&gt;</b>").pause(2000).delete().type("&lt;Fullstack /&gt;").pause(2000);
                    setInstance(instance);
                    return instance;
                }}
            />
        </h3>
    );
};
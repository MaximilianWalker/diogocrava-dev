'use client';

import TypeItLogo from "../TypeIt/logo";
import GlitchyButton from "../Buttons/glitchyButton";
import styles from './navbar.module.css';
import { useSection } from "@/contexts/SectionContext";

export default () => {
    const {
        section,
        setSection
    } = useSection();
    return (
        <nav className={styles.navbar}>
            <TypeItLogo />
            <div className={styles.buttonsDiv}>
                <GlitchyButton
                    selected={section === 1}
                    onClick={() => setSection(1)}
                >
                    1. About Me
                </GlitchyButton>
                <GlitchyButton
                    selected={section === 2}
                    onClick={() => setSection(2)}
                >
                    2. Tecnologies
                </GlitchyButton>
                <GlitchyButton
                    selected={section === 3}
                    onClick={() => setSection(3)}
                >
                    3. Projects
                </GlitchyButton>
                <GlitchyButton
                    selected={section === 4}
                    onClick={() => setSection(4)}
                >
                    4. Contact Form
                </GlitchyButton>
            </div>
        </nav>
    );
};
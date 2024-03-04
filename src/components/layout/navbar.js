'use client';

import TypeItLogo from "../type-it/logo";
import GlitchyButton from "../buttons/glitchyButton";
import { useSection } from "@/contexts/SectionContext";
import Networks from "./networks";
import './navbar.css';

export default () => {
    const {
        section,
        setSection
    } = useSection();
    return (
        <nav className="navbar__container">
            <TypeItLogo />
            <div className="navbar__buttons">
            <GlitchyButton
                    selected={section === 0}
                    onClick={() => setSection(0)}
                >
                    0. Intro
                </GlitchyButton>
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
            <Networks />
        </nav>
    );
};
'use client';

import { useEffect } from "react";
import TypeItLogo from "../type-it/logo";
import GlitchyButton from "../buttons/glitchy-button";
import { useSection } from "@/contexts/SectionContext";
// import Networks from "./networks";
import './navbar.css';

const sections = ['0. Intro', '1. About Me', '2. Tecnologies', '3. Projects'];

export default () => {
    const {
        section,
        setSection,
        setSize
    } = useSection(sections.length);

    useEffect(() => {
        setSize(sections.length);
    }, []);

    return (
        <nav className="navbar__container">
            <TypeItLogo />
            <div className="navbar__buttons">
                {
                    sections.map((sectionName, index) => (
                        <GlitchyButton
                            key={index}
                            selected={section === index}
                            onClick={() => setSection(index)}
                        >
                            {sectionName}
                        </GlitchyButton>
                    ))
                }
            </div>
            {/* <Networks /> */}
        </nav>
    );
};
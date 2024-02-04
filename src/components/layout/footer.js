'use client';

import styles from './footer.module.css';
import TileButton from "../buttons/tileButton";
import CyberpunkButton from "../buttons/cyberpunkButtonV2";
// import { Terminal, GitHub } from 'react-feather';
import { useTerminal } from '@/contexts/TerminalContext';
import Networks from './networks';
import Terminal from '@/icons/custom/terminal';
import Apps from '@/icons/custom/apps';

export default ({ }) => {
    const { toggleTerminal } = useTerminal();
    return (
        <footer className={styles.footer}>
            {/* <div className={styles.buttonsDiv}>
                <TileButton icon={<GitHub />} text="GitHub" />
            </div> */}
            <Networks />
            <div className={styles.buttonsDiv}>
                <CyberpunkButton
                    icon={Apps}
                    text="APP STORE"
                    tag="1.0"
                />
                <CyberpunkButton
                    icon={Terminal}
                    text="TERMINAL"
                    tag="1.0"
                    onClick={toggleTerminal}
                />
            </div>
        </footer>
    );
};
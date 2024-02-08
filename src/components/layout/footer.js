'use client';

import styles from './footer.module.css';
import TileButton from "../buttons/tileButton";
import MenuButton from "../buttons/menu-button";
// import { Terminal, GitHub } from 'react-feather';
import { useTerminal } from '@/contexts/TerminalContext';
import Networks from './networks';
import Terminal from '@/icons/custom/terminal';
import Apps from '@/icons/custom/apps';

export default ({ }) => {
    const { toggleTerminal } = useTerminal();
    return (
        <footer className={styles.footer}>
            <Networks />
            <div className={styles.buttonsDiv}>
                <MenuButton
                    icon={Apps}
                    text="APP STORE"
                    tag="1.0"
                />
                <MenuButton
                    icon={Terminal}
                    text="TERMINAL"
                    tag="1.0"
                    onClick={toggleTerminal}
                />
            </div>
        </footer>
    );
};
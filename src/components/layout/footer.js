'use client';

import { useWindowManager } from '@/contexts/WindowManagerContext';
import TileButton from "../buttons/tileButton";
import MenuButton from "../buttons/menu-button";
// import { Terminal, GitHub } from 'react-feather';
// import { useTerminal } from '@/contexts/TerminalContext';
import Networks from './networks';
import Terminal from '@/icons/custom/terminal';
import Apps from '@/icons/custom/apps';
import styles from './footer.module.css';

export default ({ }) => {
    const { toggle } = useWindowManager();
    return (
        <footer className={styles.footer}>
            <Networks />
            <div className={styles.buttonsDiv}>
                <MenuButton
                    icon={Apps}
                    text="APP STORE"
                    expandable
                />
                <MenuButton
                    icon={Terminal}
                    text="TERMINAL"
                    expandable
                    onClick={() => toggle('terminal')}
                />
            </div>
        </footer>
    );
};
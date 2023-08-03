import styles from './footer.module.css';
import TileButton from "../Buttons/tileButton";
import CyberpunkButton from "../Buttons/cyberpunkButton";
import { Terminal, GitHub } from 'react-feather';

export default ({ toggleTerminal }) => {

    return (
        <footer className={styles.footer}>
            <div className={styles.buttonsDiv}>
                <TileButton icon={<GitHub />} text="GitHub" />
            </div>
            <CyberpunkButton
                // icon={<Terminal />}
                text=">_ Terminal"
                tag="1.0"
                onClick={toggleTerminal}
            />
        </footer>
    );
};
import styles from './footer.module.css';
import TileButton from "../Buttons/tileButton";
import CyberpunkButton from "../Buttons/cyberpunkButton";

export default () => {

    return (
        <footer className={styles.footer}>
            <div className={styles.buttonsDiv}>
                <TileButton href="#">
                    1. About Me
                </TileButton>
            </div>
            <CyberpunkButton>

            </CyberpunkButton>
        </footer>
    );
};
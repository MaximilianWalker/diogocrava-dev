import TypeItLogo from "./TypeIt/logo";
import GlitchyButton from "./Buttons/glitchyButton";
import styles from './navbar.module.css';

export default () => {

    return (
        <nav className={styles.navbar}>
            <TypeItLogo />
            <div className={styles.buttonsDiv}>
                <GlitchyButton>1. About Me</GlitchyButton>
                <GlitchyButton>2. Tecnologies</GlitchyButton>
                <GlitchyButton>3. Projects</GlitchyButton>
                <GlitchyButton>4. Contact Form</GlitchyButton>
            </div>
        </nav>
    );
};
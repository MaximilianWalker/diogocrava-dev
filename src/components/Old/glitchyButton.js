import styles from './glitchyButton.module.css';

const GlitchyButton = ({ children, ...props }) => {

    return (
        <button className={styles["btn-glitch"]}>
            <span className={styles["text"]}>// Initialize</span><span className={styles["text-decoration"]}>_</span><span className={styles["decoration"]}>&rArr;</span>
        </button>
    );

};

export default GlitchyButton;
import styles from './glitchyButton.module.css';

const GlitchyButton = ({ children, selected, ...props }) => {
    return (
        <button className={`${styles["btn-glitch"]} ${selected ? styles.selected : ''}`} {...props}>
            <span className={styles["text"]}>// {children}</span><span className={styles["text-decoration"]}>_</span><span className={styles["decoration"]}></span>
        </button>
    );

};

export default GlitchyButton;
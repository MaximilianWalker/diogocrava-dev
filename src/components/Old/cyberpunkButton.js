import styles from './cyberpunkButton.module.css';

const CyberpunkButton = ({ children, ...props }) => {

    return (
        <button className={styles["cybr-btn"]}>
            {children}<span aria-hidden>_</span>
            <span aria-hidden className={styles["cybr-btn__glitch"]}>{children}_</span>
            <span aria-hidden className={styles["cybr-btn__tag"]}>R25</span>
        </button>
    );

};

export default CyberpunkButton;
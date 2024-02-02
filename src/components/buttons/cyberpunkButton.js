import { Children } from 'react';
import styles from './cyberpunkButton.module.css';

// https://codepen.io/jh3y/pen/PoGbxLp
const CyberpunkButton = ({ icon, text, tag, selected, ...props }) => {
    return (
        <button className={styles.cyberpunkButton} {...props}>
            {icon}
            {text}
            <span aria-hidden className={styles.cyberpunkButtonGlitch}>{text}</span>
            <span aria-hidden className={styles.cyberpunkButtonTag}>{tag ?? 'R25'}</span>
        </button>
    );

};

CyberpunkButton.propTypes = {
    icon: PropTypes.element,
    text: PropTypes.string,
    tag: PropTypes.string
};


export default CyberpunkButton;
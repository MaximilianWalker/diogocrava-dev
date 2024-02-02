import PropTypes from "prop-types";
import { Children } from 'react';
import styles from './cyberpunkButtonV2.module.css';

// https://codepen.io/jh3y/pen/PoGbxLp
const CyberpunkButton = ({ icon: Icon, text, tag, selected, ...props }) => {
    return (
        <div className={styles.wrapper}>
            <button className={styles.button} {...props}>
                <Icon />
                <span className={styles.text}>{text}</span>
                {/* <span aria-hidden className={styles.cyberpunkButtonGlitch}>{text}</span> */}
                {/* <span aria-hidden className={styles.tag}>{tag ?? 'R25'}</span> */}
            </button>
            <div className={styles.shadow} />
        </div>
    );

};

CyberpunkButton.propTypes = {
    icon: PropTypes.element,
    text: PropTypes.string,
    tag: PropTypes.string
};

export default CyberpunkButton;
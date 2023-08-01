import { Children } from 'react';
import styles from './glitchyButton.module.css';

const GlitchyButton = ({ children, selected, ...props }) => {
    return (
        <button className={styles.cyberpunkButton} {...props}>
            {
                Children.map(children, (child, index) => (
                    
                ))
            }
            <span></span>
        </button>
    );

};

export default GlitchyButton;
import styles from './networks.module.css';
import { FileText, GitHub, Linkedin } from 'react-feather';


// https://codepen.io/Limbian/pen/WGeNBO
const Networks = ({ }) => {
    return (
        <div className={styles.networks}>
            <div className={styles.labelContainer}>
                <span className={styles.label}>Find me on my Networks!</span>
                <div className={styles.line} />
            </div>
            <div className={styles.netbox}>
                <div className={styles.iconContainer}>
                    <FileText
                    // className={styles.icon}
                // tip
                />
                </div>

                <div className={styles.iconContainer}>
                    <GitHub />
                </div>

                <div className={styles.iconContainer}>
                    <Linkedin />
                </div>

                <div className={styles.iconContainer}>
                    <Linkedin />
                </div>
            </div>
        </div>
    );
};

export default Networks;
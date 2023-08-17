import Image from 'next/image';
import styles from './networks.module.css';
import { FileText, GitHub, Linkedin, Disc } from 'react-feather';


// https://codepen.io/Limbian/pen/WGeNBO
const Networks = ({ }) => {
    return (
        <div className={styles.networks}>
            <div className={styles.tooltip}>

            </div>
            <div className={styles.labelContainer}>
                <span className={styles.label}>Find me on my Networks!</span>
                <div className={styles.line} />
            </div>
            <div className={styles.netbox}>
                <div className={styles.iconContainer}>
                    <Image
                        src="/icons/networks/cv.svg"
                        alt="Diogo Crava" 
                        fill
                        priority={false}
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
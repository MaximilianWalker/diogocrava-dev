import styles from './networks.module.css';
import { FileText, GitHub } from 'react-feather';


// https://codepen.io/Limbian/pen/WGeNBO
const Networks = ({ }) => {
    return (
        <div className={styles.networks}>
            <div className={styles.netbox}>
                <FileText 
                className={styles.icon} 
                // tip
                />
                <GitHub className={styles.icon} />
            </div>
        </div>
    );
};

export default Networks;
import Image from 'next/image';
import styles from './networks.module.css';
// import { FileText, GitHub, Linkedin, Disc } from 'react-feather';
import CV from '../../../public/icons/networks/cv.svg';
import GitHub from '../../../public/icons/networks/github.svg';
import Linkedin from '../../../public/icons/networks/linkedin.svg';
import Hackthebox from '../../../public/icons/networks/hackthebox.svg';
import Codewars from '../../../public/icons/networks/codewars.svg';

const NETWORKS = [
    {
        icon: CV,
        description: 'Curriculum Vitae',
        link: '/documents/cv.pdf'
    },
    {
        icon: Linkedin,
        description: 'LinkedIn',
        link: 'https://www.linkedin.com/in/diogo-crava/'
    },
    {
        icon: GitHub,
        description: 'GitHub',
        link: 'https://github.com/MaximilianWalker'
    },
    {
        icon: Hackthebox,
        description: 'HackTheBox',
        link: 'https://app.hackthebox.com/users/1404176'
    },
    {
        icon: Codewars,
        description: 'Codewars',
        link: 'https://www.codewars.com/users/MaximilianWalker'
    }
];

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
                {NETWORKS.map(({ icon: Icon, description, link }) => (
                    <a
                        key={description}
                        className={styles.iconContainer}
                        href={link}
                        target="_blank"
                        description={description}
                    >
                        <Icon />
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Networks;
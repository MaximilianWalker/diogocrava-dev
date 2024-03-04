import {
    CV,
    LinkedIn,
    GitHub,
    HackTheBox,
    Codewars
} from '@/icons/networks';
import './networks.css';

const NETWORKS = [
    {
        icon: GitHub,
        description: 'GitHub',
        link: 'https://github.com/MaximilianWalker'
    },
    {
        icon: LinkedIn,
        description: 'LinkedIn',
        link: 'https://www.linkedin.com/in/diogo-crava/'
    },
    {
        icon: HackTheBox,
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
const Networks = ({ className }) => {
    return (
        <div className={`networks ${className ?? ''}`}>
            <div className="networks__netbox">
                {
                    NETWORKS.map(({ icon: Icon, description, link }) => (
                        <a
                            key={description}
                            className="networks__icon-container"
                            href={link}
                            target="_blank"
                            description={description}
                        >
                            <Icon />
                        </a>
                    ))
                }
            </div>
            <div className="networks__tooltip">

            </div>
            <div className="networks__label-container">
                <div className="networks__line" />
                <span className="networks__label">
                    Find me on my Networks!
                </span>
            </div>
        </div>
    );
};

export default Networks;
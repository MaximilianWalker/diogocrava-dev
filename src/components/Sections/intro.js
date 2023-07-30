import Image from 'next/image';
import styles from './intro.module.css';
import Section from './section';
import Hi from '../TypeIt/hi';

const Intro = ({ active, ...props }) => {
    return (
        <div className={styles.container}>
            <Hi freeze={!active} />
            <div className={styles.portraitContainer}>
                <Image
                    src="/portraits/portrait_with_border.png"
                    alt="Diogo Crava"
                    fill
                    priority={false}
                    style={{
                        objectFit: 'contain',
                        objectPosition: 'right center'
                    }}
                />
            </div>
        </div>
    );

};

export default Intro;
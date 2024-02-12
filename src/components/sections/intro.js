import Image from 'next/image';
import styles from './intro.module.css';
import Section from './section';
import Hi from '../type-it/hi';

const Intro = ({ active, ...props }) => {
    return (
        <div className={styles.container}>
            <Hi freeze={!active} />
            <div className={styles.portraitContainer}>
                <Image
                    className={styles.portrait}
                    src="/portraits/portrait_with_border.png"
                    alt="Diogo Crava"
                    fill
                    priority
                    quality={100}
                />
            </div>
        </div>
    );

};

export default Intro;
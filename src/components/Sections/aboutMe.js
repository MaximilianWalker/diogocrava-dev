import Image from 'next/image';
import styles from './aboutMe.module.css';
import { Navigation, Pagination, A11y, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import ComingSoon from '../TypeIt/comingSoon';

const AboutMe = ({ children, ...props }) => {
    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>

            </div>
            <div className={styles.content}>

            </div>
        </div>
    );
};

export default AboutMe;
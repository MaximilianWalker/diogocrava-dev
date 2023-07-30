import Image from 'next/image';
import styles from './aboutMe.module.css';
import { Navigation, Pagination, A11y, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import Terminal from '../TypeIt/terminal';

const AboutMe = ({ children, ...props }) => {
    return (
        <>
            <div className={styles.container}>
                <Terminal />
            </div>

        </>
    );
};

export default AboutMe;
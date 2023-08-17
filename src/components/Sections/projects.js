import Image from 'next/image';
import styles from './projects.module.css';
import { Navigation, Pagination, A11y, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import ComingSoon from '../TypeIt/comingSoon';

const AboutMe = ({ children, ...props }) => {
    return (
        <>
            <ComingSoon />
        </>
    );
};

export default AboutMe;
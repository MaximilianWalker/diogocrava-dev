import Image from 'next/image';
import styles from './projects.module.css';
import { Navigation, Pagination, A11y, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Loading from '../type-it/loading';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const AboutMe = ({ children, ...props }) => {
    return (
        <>
            <Loading message="COMING SOON" />
        </>
    );
};

export default AboutMe;
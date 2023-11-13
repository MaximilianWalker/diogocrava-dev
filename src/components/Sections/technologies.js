import Image from 'next/image';
import styles from './technologies.module.css';
import { Navigation, Pagination, A11y, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const technologies = [
    {
        alt: 'FastAPI',
        src: '/technologies/fastapi.png'
    },
];

const Technologies = ({ children, ...props }) => {
    return (<></>
        // <Swiper
        //     modules={[Navigation, Mousewheel, Pagination, A11y]}
        //     mousewheel
        //     spaceBetween={50}
        //     navigation
        //     grabCursor
        //     centeredSlides
        //     slidesPerView="auto"
        //     coverflowEffect={{
        //         rotate: -20,
        //         stretch: 0,
        //         depth: 100,
        //         modifier: 1,
        //         scale: 0.8,
        //         slideShadows: true,
        //     }}
        //     pagination={{ clickable: true }}
        //     onSwiper={(swiper) => console.log(swiper)}
        //     onSlideChange={() => console.log('slide change')}
        // >
        //     {
        //         technologies.map(technology => (
        //             <SwiperSlide>
        //                 <Image
        //                     src={technology.src}
        //                     alt={technology.alt}
        //                     fill
        //                     style={{
        //                         objectFit: 'contain',
        //                         objectPosition: 'right center'
        //                     }}
        //                 />
        //             </SwiperSlide>
        //         ))
        //     }

        // </Swiper>
    );
};

export default Technologies;
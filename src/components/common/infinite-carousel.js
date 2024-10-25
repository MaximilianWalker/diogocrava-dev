import { Children } from 'react';

// https://medium.com/@divyakoneti0001/how-to-create-an-autoplay-or-infinite-carousel-in-react-d9f9bff11048
// https://codepen.io/jh3y/pen/LYaLBVX

function InfiniteCarousel({ children: childrenProp, className, direction, speed }) {
    const children = Children.map(childrenProp, (child, index) => (
        <div className="infinite-carousel__slide" key={index}>
            {child}
        </div>
    ));
    return (
        <div className="infinite-carousel__container">
            <div className="infinite-carousel__track">
                {children}
                {children}
            </div>
        </div>
    );
}

export default InfiniteCarousel;
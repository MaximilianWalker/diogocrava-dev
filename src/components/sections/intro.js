import Image from 'next/image';
import Section from './section';
import Hi from '../type-it/hi';

import './intro.css';


const Intro = ({ active, ...props }) => {
    return (
        <div className="intro__container">
            <Hi freeze={!active} />
            <div className="intro__portrait-container">
                <Image
                    className="intro__portrait"
                    src="/portraits/portrait_with_border.png"
                    // src="/portraits/portrait.png"
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
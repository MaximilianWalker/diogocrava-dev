import styles from './section.module.css';
import Section from './section';
import Hi from '../TypeIt/hi';

const Intro = ({ children, ...props }) => {

    return (
        <Section>
            <Hi />
        </Section>
    );

};

export default Intro;
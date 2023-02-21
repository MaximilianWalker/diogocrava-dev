import styles from './section.module.css';

const Section = ({ children, ...props }) => {

    return (
        <div className={styles.section} {...props}>
            {children}
        </div>
    );

};

export default Section;
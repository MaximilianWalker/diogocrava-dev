import { forwardRef } from 'react';
import styles from './section.module.css';

export default forwardRef(({ children, ...props }, ref) => {
    return (
        <div ref={ref} className={styles.section} {...props}>
            {children}
        </div>
    );
});
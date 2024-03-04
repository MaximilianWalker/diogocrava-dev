import { forwardRef } from 'react';
import './section.css';

export default forwardRef(({ children, ...props }, ref) => {
    return (
        <div ref={ref} className="section" {...props}>
            {children}
        </div>
    );
});
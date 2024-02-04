import { useState, useRef, useCallback } from 'react';

function useResizable(ref, initialWidth, initialHeight) {
    const resizableRef = ref || useRef();
    const [size, setSize] = useState({ width: initialWidth, height: initialHeight });

    const onMouseMove = useCallback((event) => {
        if (resizableRef.current) {
            const newWidth = event.clientX - resizableRef.current.getBoundingClientRect().left;
            const newHeight = event.clientY - resizableRef.current.getBoundingClientRect().top;
            setSize({ width: newWidth, height: newHeight });
        }
    }, []);

    const onMouseUp = useCallback(() => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }, [onMouseMove]);

    const onMouseDown = useCallback((event) => {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }, [onMouseMove, onMouseUp]);

    return { size, resizableRef, onMouseDown };
};

export default useResizable;
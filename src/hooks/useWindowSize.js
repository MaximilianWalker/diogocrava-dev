import React, { useLayoutEffect, useState } from 'react';

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);

    const updateSize = () => setSize([window.innerWidth, window.innerHeight]);

    useLayoutEffect(() => {
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return size;
};

export default useWindowSize;
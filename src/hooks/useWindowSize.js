import React, { useLayoutEffect, useState } from 'react';

function useWindowSize() {
    const [size, setSize] = useState({ width: 0, height: 0 });

    const updateSize = () => setSize({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useLayoutEffect(() => {
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return size;
};

export default useWindowSize;
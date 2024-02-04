import { useState, useCallback } from 'react';

const useMousePositionEdge = (edgeThreshold = 5) => {
    const [edge, setEdge] = useState(null);

    const onMouseMove = useCallback((e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - left;
        const mouseY = e.clientY - top;

        let newEdge = null;

        const nearTop = mouseY < edgeThreshold;
        const nearBottom = mouseY > height - edgeThreshold;
        const nearLeft = mouseX < edgeThreshold;
        const nearRight = mouseX > width - edgeThreshold;

        if (nearTop && nearLeft) newEdge = 'top-left';
        else if (nearTop && nearRight) newEdge = 'top-right';
        else if (nearBottom && nearLeft) newEdge = 'bottom-left';
        else if (nearBottom && nearRight) newEdge = 'bottom-right';
        else if (nearTop) newEdge = 'top';
        else if (nearBottom) newEdge = 'bottom';
        else if (nearLeft) newEdge = 'left';
        else if (nearRight) newEdge = 'right';

        setEdge(newEdge);
    }, [edgeThreshold]);

    return { edge, onMouseMove };
};

export default useMousePositionEdge;
import { useState, useEffect, useRef, useCallback } from 'react';

function useResizable(ref, initialWidth, initialHeight, edgeThreshold = 5) {
    const resizableRef = ref || useRef();
    const mouseDelta = useRef();

    const [mouseEdge, setMouseEdge] = useState(null);
    const [isResizing, setResizing] = useState(false);
    const [size, setSize] = useState({ width: initialWidth, height: initialHeight });

    const onMouseDown = (e) => {
        if (mouseEdge) {
            mouseDelta.current = {
                x: e.clientX - ref.current.offsetLeft,
                y: e.clientY - ref.current.offsetTop
            };
            setResizing(true);
        }
    };

    const onMouseUp = () => {
        mouseDelta.current = null;
        setResizing(false);
    };

    const onMouseMove = (e) => {
        const { left, top, width, height } = resizableRef.current.getBoundingClientRect();
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

        setMouseEdge(newEdge);

        if (mouseDelta.current) {
            const newWidth = e.clientX - left;
            const newHeight = e.clientY - top;
            setSize({ width: newWidth, height: newHeight });
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    return { size, mouseEdge, isResizing, resizableRef, onMouseDown };
};

export default useResizable;
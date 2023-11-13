import { useState, useEffect, useRef } from "react";

function useDrag(elementRef, initialPosition) {
    const ref = elementRef.current ? elementRef : { current: elementRef };
    const mouseDelta = useRef();

    const [isDragging, setDragging] = useState(false);
    // improve by centering the component or use initial position
    const [position, setPosition] = useState({
        x: initialPosition?.x ?? 0,
        y: initialPosition?.y ?? 0
    });

    const onMouseDown = (e) => {
        mouseDelta.current = {
            x: e.clientX - ref.current.offsetLeft,
            y: e.clientY - ref.current.offsetTop
        };
        setDragging(true);
    };

    const onMouseUp = () => {
        mouseDelta.current = null;
        setDragging(false);
    };

    const onMouseMove = (e) => {
        if (!mouseDelta.current) return;
        setDragging(true);
        setPosition({
            x: e.clientX - mouseDelta.current.x,
            y: e.clientY - mouseDelta.current.y
        });
    };

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    return {
        isDragging,
        position,
        onMouseDown
    };
};

export default useDrag;
'use client';

import { useState, useContext, createContext } from "react";

const getMouseEdge = (x, y, left, top, width, height, threshold = 5) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const mouseX = x - left;
    const mouseY = y - top;

    let newEdge = null;

    const nearTop = mouseY < threshold;
    const nearBottom = mouseY > height - threshold;
    const nearLeft = mouseX < threshold;
    const nearRight = mouseX > width - threshold;

    if (nearTop && nearLeft) newEdge = 'top-left';
    else if (nearTop && nearRight) newEdge = 'top-right';
    else if (nearBottom && nearLeft) newEdge = 'bottom-left';
    else if (nearBottom && nearRight) newEdge = 'bottom-right';
    else if (nearTop) newEdge = 'top';
    else if (nearBottom) newEdge = 'bottom';
    else if (nearLeft) newEdge = 'left';
    else if (nearRight) newEdge = 'right';

    return newEdge;
};

const WindowContext = createContext();

export const WindowProvider = ({ children }) => {
    const refs = useRef([]);
    const [windows, setWindows] = useState({});

    const registerWindow = (id, defaults) => {
        const newWindow = {
            id,
            open: !!defaults.open,
            maximized: !!defaults.maximized,
            isDragging: false,
            position: {
                x: defaults.position?.x,
                y: defaults.position?.y
            },
            size: {
                width: defaults.size?.width,
                height: defaults.size?.height
            },
            mouseEdge: null
        };
        setWindows((prevState) => ({ ...prevState, [id]: newWindow }));

        refs.current.push({
            id,
            containerRef: useRef(),
            tabRef: useRef(),
            containerRef: useRef(),
            mouseDelta: useRef()
        });
    };

    const unregisterWindow = (id) => setWindows((prevState) => prevState.filter((window) => window.id !== id));

    const setWindow = (id, window) => {
        setWindows((prevState) => prevState.map((w) => {
            if (w.id === id) return window;
            return w;
        }));
    };

    const setOpen = (id, open) => {
        setWindows((prevState) => prevState.map((window) => {
            if (window.id === id) window.open = open;
            return window;
        }));
    };

    const setMaximized = (id, maximized) => {
        setWindows((prevState) => prevState.map((window) => {
            if (window.id === id) window.maximized = maximized;
            return window;
        }));
    };

    const bringToFront = (id) => {
        const { zIndex } = windows.find((window) => window.id === id);
        setWindows((prevState) => {
            prevState.map((window) => {
                if (window.id === id) window.zIndex = prevState.length;
                else if (window.zIndex > zIndex) window.zIndex -= 1;
                return window;
            });
        });
    };

    // ON RESIZE
    const onMouseDown = (e) => {
        if (mouseEdge) {
            mouseDelta.current = {
                x: e.clientX - ref.current.offsetLeft,
                y: e.clientY - ref.current.offsetTop
            };
            setResizing(true);
        }
    };

    // ON RESIZE
    const onMouseUp = () => {
        mouseDelta.current = null;
        setResizing(false);
    };

    // ON RESIZE
    const onMouseMove = (e) => {
        const { left, top, width, height } = resizableRef.current.getBoundingClientRect();
        const mouseX = e.clientX - left;
        const mouseY = e.clientY - top;

        const newEdge = getMouseEdge (mouseX, mouseY, left, top, width, height);
        setMouseEdge(newEdge);

        if (mouseDelta.current) {
            const newWidth = e.clientX - left;
            const newHeight = e.clientY - top;
            setSize({ width: newWidth, height: newHeight });
        }
    };

    // ON DRAG
    const onMouseDown = (e) => {
        mouseDelta.current = {
            x: e.clientX - ref.current.offsetLeft,
            y: e.clientY - ref.current.offsetTop
        };
        setDragging(true);
    };

    // ON DRAG
    const onMouseUp = () => {
        mouseDelta.current = null;
        setDragging(false);
    };

    // ON DRAG
    const onMouseMove = (e) => {
        if (!mouseDelta.current) return;

        setDragging(true);
        setPosition({
            x: e.clientX - mouseDelta.current.x,
            y: e.clientY - mouseDelta.current.y
        });
    };

    // ON DRAG
    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);


    return (
        <WindowContext.Provider value={{
            windows,
            registerWindow,
            unregisterWindow,
            setWindow,
            setOpen,
            setMaximized,
            bringToFront
        }}>
            {children}
        </WindowContext.Provider>
    );
};

export const WindowConsumer = WindowContext.Consumer;

export const useWindowManager = () => useContext(WindowContext);

export const useWindow = (id) => {
    const {
        windows,
        setWindow: setWindowById,
        setOpen: setOpenById,
        setMaximized: setMaximizedById,
        bringToFront: bringToFrontById
    } = useContext(WindowContext);

    const window = useMemo(() => windows.find(
        (window) => window.id === id
    ), [windows, id]);

    const setWindow = useCallback((window) => setWindowById(id, window), [windows, id]);

    const setOpen = useCallback((open) => setOpenById(id, open), [windows, id]);

    const setMaximized = useCallback((maximized) => setMaximizedById(id, maximized), [windows, id]);

    const bringToFront = useCallback(() => bringToFrontById(id), [windows, id]);

    return {
        ...window,
        setWindow,
        setOpen,
        setMaximized,
        bringToFront
    };
};
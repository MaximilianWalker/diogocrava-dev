export default function FadeContainer({ children, className, style, sides, width = 10 }) {
    const getMaskStyle = (sides, width) => {
        let masks = [];

        if (sides.includes('top'))
            masks.push(`linear-gradient(to bottom, transparent, black ${width}px)`);
        if (sides.includes('bottom'))
            masks.push(`linear-gradient(to top, transparent, black ${width}px)`);
        if (sides.includes('left'))
            masks.push(`linear-gradient(to right, transparent, black ${width}px)`);
        if (sides.includes('right'))
            masks.push(`linear-gradient(to left, transparent, black ${width}px)`);

        if (masks.length === 0)
            return 'none';
        else if (masks.length === 1)
            return masks[0];
        else
            return masks.join(', ');
    };

    const maskStyle = getMaskStyle(sides, width);

    return (
        <div
            className={className}
            style={{
                maskImage: maskStyle,
                maskMode: 'alpha',
                maskRepeat: 'no-repeat',
                maskSize: '100% 100%',
                WebkitMaskImage: maskStyle,
                WebkitMaskMode: 'alpha',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskSize: '100% 100%',
                ...style
            }}
        >
            {children}
        </div>
    );
}
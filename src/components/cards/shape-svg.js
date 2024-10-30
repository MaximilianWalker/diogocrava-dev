const parseCutSize = (size, w, h) => {
    if (typeof size === 'string' && size.endsWith('%')) {
        const percentage = parseFloat(size) / 100;
        return {
            x: w * percentage,
            y: h * percentage,
        };
    } else {
        // Assume px
        const value = parseFloat(size);
        return { x: value, y: value };
    }
};

const buildPathData = (w, h, offset, cut) => {
    const pathData = [];

    const { size, topLeft, topRight, bottomLeft, bottomRight } = cut;
    const cutSizes = parseCutSize(size ?? 0, w, h);

    // For each corner, calculate the x and y cut sizes
    const cTL = topLeft ? { x: cutSizes.x, y: cutSizes.y } : { x: 0, y: 0 };
    const cTR = topRight ? { x: cutSizes.x, y: cutSizes.y } : { x: 0, y: 0 };
    const cBR = bottomRight ? { x: cutSizes.x, y: cutSizes.y } : { x: 0, y: 0 };
    const cBL = bottomLeft ? { x: cutSizes.x, y: cutSizes.y } : { x: 0, y: 0 };

    // Move to starting point (Top-left corner)
    pathData.push(`M ${cTL.x + offset},${0 + offset}`);

    // Top edge
    pathData.push(`L ${w - cTR.x - offset},${0 + offset}`);

    // Top-right cut
    if (topRight) {
        pathData.push(`L ${w - offset},${cTR.y + offset}`);
    }

    // Right edge
    pathData.push(`L ${w - offset},${h - cBR.y - offset}`);

    // Bottom-right cut
    if (bottomRight) {
        pathData.push(`L ${w - cBR.x - offset},${h - offset}`);
    }

    // Bottom edge
    pathData.push(`L ${cBL.x + offset},${h - offset}`);

    // Bottom-left cut
    if (bottomLeft) {
        pathData.push(`L ${0 + offset},${h - cBL.y - offset}`);
    }

    // Left edge
    pathData.push(`L ${0 + offset},${cTL.y + offset}`);

    // Top-left cut
    if (topLeft) {
        pathData.push(`L ${cTL.x + offset},${0 + offset}`);
    }

    pathData.push('Z'); // Close path

    return pathData.join(' ');
};

const CutCornerRectangle = ({
    width = 200,
    height = 100,
    cut = {
        size: 0,
        topLeft: false,
        topRight: false,
        bottomLeft: false,
        bottomRight: false,
    },
    background = 'white',
    borderWidth = '0',
    borderColor = 'black',
    backgroundGradient = null,
    borderGradient = null,
}) => {
    const w = parseFloat(width);
    const h = parseFloat(height);
    const bw = parseFloat(borderWidth);

    const pathStringBorder = buildPathData(w, h, 0, cut);
    const pathStringFill = buildPathData(w - bw, h - bw, bw, cut);

    const uniqueId = Math.random().toString(36).substr(2, 9);
    const backgroundGradientId = `backgroundGradient-${uniqueId}`;
    const borderGradientId = `borderGradient-${uniqueId}`;

    return (
        <svg width={w} height={h}>
            <defs>
                {backgroundGradient && (
                    <linearGradient id={backgroundGradientId} {...backgroundGradient.props}>
                        {backgroundGradient.stops.map((stop, index) => (
                            <stop key={index} {...stop} />
                        ))}
                    </linearGradient>
                )}
                {borderGradient && (
                    <linearGradient id={borderGradientId} {...borderGradient.props}>
                        {borderGradient.stops.map((stop, index) => (
                            <stop key={index} {...stop} />
                        ))}
                    </linearGradient>
                )}
            </defs>
            {/* Border Path */}
            {bw > 0 && (
                <path
                    d={pathStringBorder}
                    fill={borderGradient ? `url(#${borderGradientId})` : borderColor}
                />
            )}
            {/* Fill Path */}
            <path
                d={pathStringFill}
                fill={backgroundGradient ? `url(#${backgroundGradientId})` : background}
            />
        </svg>
    );
};

export default CutCornerRectangle;

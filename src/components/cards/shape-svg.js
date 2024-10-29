const CutCornerRectangle = ({
    width = 200,
    height = 100,
    cutTopLeft = false,
    cutTopRight = false,
    cutBottomLeft = false,
    cutBottomRight = false,
    cutSize = '0',
    background = 'white',
    borderWidth = '0',
    borderColor = 'black',
    backgroundGradient = null,
    borderGradient = null,
}) => {
    // Helper function to parse size strings into x and y components
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

    const w = parseFloat(width);
    const h = parseFloat(height);
    const bw = parseFloat(borderWidth);

    const cutSizes = parseCutSize(cutSize, w, h);

    // For each corner, calculate the x and y cut sizes
    const cTL = cutTopLeft ? { x: cutSizes.x, y: cutSizes.y } : { x: 0, y: 0 };
    const cTR = cutTopRight ? { x: cutSizes.x, y: cutSizes.y } : { x: 0, y: 0 };
    const cBR = cutBottomRight ? { x: cutSizes.x, y: cutSizes.y } : { x: 0, y: 0 };
    const cBL = cutBottomLeft ? { x: cutSizes.x, y: cutSizes.y } : { x: 0, y: 0 };

    // Function to build path data with offset
    const buildPathData = (offset = 0) => {
        const pathData = [];

        // Move to starting point (Top-left corner)
        pathData.push(`M ${cTL.x + offset},${0 + offset}`);

        // Top edge
        pathData.push(`L ${w - cTR.x - offset},${0 + offset}`);

        // Top-right cut
        if (cutTopRight) {
            pathData.push(`L ${w - offset},${cTR.y + offset}`);
        }

        // Right edge
        pathData.push(`L ${w - offset},${h - cBR.y - offset}`);

        // Bottom-right cut
        if (cutBottomRight) {
            pathData.push(`L ${w - cBR.x - offset},${h - offset}`);
        }

        // Bottom edge
        pathData.push(`L ${cBL.x + offset},${h - offset}`);

        // Bottom-left cut
        if (cutBottomLeft) {
            pathData.push(`L ${0 + offset},${h - cBL.y - offset}`);
        }

        // Left edge
        pathData.push(`L ${0 + offset},${cTL.y + offset}`);

        // Top-left cut
        if (cutTopLeft) {
            pathData.push(`L ${cTL.x + offset},${0 + offset}`);
        }

        pathData.push('Z'); // Close path

        return pathData.join(' ');
    };

    // Build path data for border and fill
    const pathStringBorder = buildPathData(0);
    const pathStringFill = buildPathData(bw / 2);

    // Generate unique IDs for gradients to prevent ID collision when multiple instances are used
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

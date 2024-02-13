export const distance = (p1, p2) => {
    const xDist = p2.x - p1.x;
    const yDist = p2.y - p1.y;
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
};

// export const areaOfTriangle = (p1, p2, p3) => {
//     return 0.5 * Math.abs(p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));
// };

export const areaOfTriangle = (side1, side2, side3) => {
    const s = (side1 + side2 + side3) / 2;
    return Math.sqrt(s * (s - side1) * (s - side2) * (s - side3));
}
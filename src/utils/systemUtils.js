export function generateSystemTree(objects, referenceName = '_id', parentName = 'parent') {
    const map = new Map();
    objects.forEach(obj => map.set(obj[referenceName], obj));

    for(const obj of objects) {
        if (obj[parentName]) {
            const parent = map.get(obj[parentName]);
            if (parent) {
                if (!parent.children) parent.children = [];
                parent.children.push(obj);
            }
        }
    }

    return objects;
}

export function getCursorForEdgePosition(edgePosition) {
    switch (edgePosition) {
        case 'top':
        case 'bottom':
            return 'ns-resize'; // North-South resize cursor
        case 'left':
        case 'right':
            return 'ew-resize'; // East-West resize cursor
        case 'top-left':
        case 'bottom-right':
            return 'nwse-resize'; // Diagonal resize cursor (NorthWest-SouthEast)
        case 'top-right':
        case 'bottom-left':
            return 'nesw-resize'; // Diagonal resize cursor (NorthEast-SouthWest)
        default:
            return 'default'; // Default cursor
    }
};
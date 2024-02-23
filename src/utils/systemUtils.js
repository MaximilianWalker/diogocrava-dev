export function generateSystemTree(objects, referenceName = '_id', parentName = 'parent') {
    const map = new Map();
    objects.forEach(obj => map.set(obj[referenceName], obj));

    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        if (obj[parentName]) {
            objects.splice(i--, 1);
            const parent = map.get(obj[parentName]);
            if (parent) {
                if (!parent.children) parent.children = [];
                parent.children.push(obj);
            } else {
                throw new Error(`Parent not found: ${obj[parentName]}`);
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
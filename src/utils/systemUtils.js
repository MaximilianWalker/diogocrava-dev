export function generateSystemTree(objects, referenceName = '_id') {
    const map = new Map();
    objects.forEach(obj => map.set(obj[referenceName], obj));

    objects.forEach(obj => {
        if (obj.children)
            obj.children = obj.children.map(childId => map.get(childId));
    });

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
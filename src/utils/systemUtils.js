export function generateSystemTree(objects, referenceName = '_id') {
    const map = new Map();
    objects.forEach(obj => map.set(obj[referenceName], obj));

    objects.forEach(obj => {
        if (obj.children)
            obj.children = obj.children.map(childId => map.get(childId));
    });

    return objects;
}
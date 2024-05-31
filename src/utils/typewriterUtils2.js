import { cloneElement, isValidElement, Children, Fragment } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function addIdsToElements(elements) {
    const _addIdsToElements = (element) => {
        if (!isValidElement(element)) return element;

        const id = uuidv4();
        return cloneElement(element, {
            id,
            key: id,
            children: Children.map(element.props.children, _addIdsToElements)
        });
    };

    return Array.isArray(elements) ? Children.map(elements, _addIdsToElements) : _addIdsToElements(elements);
}

export function* iterateElements(elements, method = 'depth') {
    if (method !== 'depth' && method !== 'breadth')
        throw new Error('Method must be depth or breadth');

    let index = 0;

    const toProcess = typeof elements === 'string' ? [elements] : Children.map(elements, child => ({ element: child, depth: 0 }));

    while (toProcess.length > 0) {
        const { element, parent, depth } = method === 'depth' ? toProcess.pop() : toProcess.shift();

        if (!element) continue;
        yield { element, parent, index, depth };

        index++;

        if (isValidElement(element) && element.props.children) {
            const entries = Children.map(
                element.props.children,
                child => ({
                    element: child,
                    parent: element,
                    depth: depth + 1
                })
            );

            if (method === 'depth')
                toProcess.push(...entries.reverse());
            else
                toProcess.push(...entries);
        }
    }
}

export function* iterateElementsText(elements) {
    for (const { element } of iterateElements(elements)) {
        if (typeof element === 'string')
            yield element;
        else if (isValidElement(element) && element.props.children)
            yield* iterateElementsText(element.props.children);
    }
}

export function mapElements(elements, transform) {
    const result = [];
    for (const entry of iterateElements(elements))
        result.push(transform(entry));
    return result;
}

export function getElementsList(elements, method = 'depth') {
    const elementsList = [];
    for (const [element, index, depth] of iterateElements(elements, method)) {
        elementsList.push({ element, index, depth });
    }
    return elementsList;
}

export function generateLineBreaks(text) {
    const parts = text.split('\n');
    return (
        <>
            {parts.map((part, index) => (
                <Fragment key={index}>
                    {part}
                    {index < parts.length - 1 ? <br /> : null}
                </Fragment>
            ))}
        </>
    );
}

export function countCharacters(nodes) {
    let _count = 0;

    const _countCharacters = (nodes) => Children.forEach(nodes, (child) => {
        if (typeof child === 'string')
            _count += child.length;
        else if (isValidElement(child) && child.props.children)
            _countCharacters(child.props.children);
    });

    _countCharacters(nodes);
    return _count;
}

export function findElementAtIndex(parentNode, index) {
    if (!parentNode || typeof parentNode !== 'object' || !isValidElement(parentNode))
        throw new Error('Parent node is not a valid React element');

    let _currentIndex = 0;
    let _node = null;

    const _findElementAtIndex = (node) => Children.forEach(node.props.children, (child) => {
        if (typeof child === 'string') {
            if (_currentIndex <= index && index < _currentIndex + child.length)
                _node = node;
            _currentIndex += child.length;
        } else if (isValidElement(child)) {
            const result = _findElementAtIndex(child);
            if (result)
                _node = result;
        }
    });

    _findElementAtIndex(parentNode);
    return _node;
}

const shouldInsertLeftMost = ({ currentElement, index, currentIndex }) => (
    typeof currentElement === 'string' &&
    ((index === 0 && currentIndex === 0) || index > currentIndex) &&
    index <= currentIndex + currentElement.length
);

const shouldInsertRightMost = ({ currentElement, index, currentIndex, totalLength }) => (
    typeof currentElement === 'string' &&
    index >= currentIndex &&
    ((index === totalLength && currentIndex + currentElement.length === totalLength) || index < currentIndex + currentElement.length)
);

const shouldInsertOuterMost = ({ elements, currentElement, currentElementIndex, index, currentIndex, depth, totalLength, contentLength }) => (
    (
        typeof currentElement === 'string' &&
        index >= currentIndex &&
        (
            index < currentIndex + currentElement.length ||
            (
                index === currentIndex + currentElement.length &&
                (
                    depth === 0 ||
                    (
                        Array.isArray(elements) && typeof
                        elements[currentElementIndex + 1] != null
                    )
                )
            )
        )
    ) ||
    (
        isValidElement(currentElement) &&
        index === currentIndex &&
        (
            depth === 0 ||
            (
                Array.isArray(elements) &&
                typeof elements[currentElementIndex + 1] !== 'string'
            )
        )
    )
);

const shouldInsertById = ({ currentElement, parent, id, index, currentIndex, depth }) => (
    (
        (parent != null && parent.props.id === id) ||
        (parent == null && depth === 0)
    ) &&
    (
        (typeof currentElement === 'string' && index >= currentIndex && index <= currentIndex + child.length) ||
        (isValidElement(currentElement) && index === currentIndex)
    )
);

// export function insertContent(elements, content, index = 0, shouldInsert = shouldInsertLeftMost) {
//     const totalLength = countCharacters(elements);
//     const contentLength = countCharacters(content);

//     let currentIndex = 0;

//     const _insertContent = (elements, parent = null, depth = 0) => {
//         const newElements = [];

//         Children.forEach(elements, (currentElement, currentElementIndex) => {
//             const _shouldInsert = () => shouldInsert({
//                 elements,
//                 parent,
//                 currentElement,
//                 currentElementIndex,
//                 index,
//                 currentIndex,
//                 depth,
//                 totalLength,
//                 contentLength
//             });

//             if (typeof currentElement === 'string') {
//                 if (_shouldInsert()) {
//                     const firstSlice = currentElement.slice(0, index - currentIndex);
//                     const lastSlice = currentElement.slice(index - currentIndex);

//                     if (typeof content === 'string') {
//                         newElements.push(`${firstSlice}${content}${lastSlice}`);
//                     } else if (isValidElement(content)) {
//                         if (firstSlice) newElements.push(firstSlice);
//                         newElements.push(content);
//                         if (lastSlice) newElements.push(lastSlice);
//                     }

//                     currentIndex += contentLength;
//                 } else {
//                     newElements.push(currentElement);
//                 }

//                 currentIndex += currentElement.length;
//             } else if (isValidElement(currentElement) && currentElement.props.children) {
//                 if (_shouldInsert()) {
//                     newElements.push(content);
//                     currentIndex += contentLength;
//                 }

//                 const id = currentElement.props.id ?? uuidv4();
//                 newElements.push(cloneElement(
//                     currentElement,
//                     { id, key: id },
//                     _insertContent(currentElement.props.children, currentElement, depth + 1)
//                 ));

//                 if (_shouldInsert()) {
//                     newElements.push(content);
//                     currentIndex += contentLength;
//                 }
//             } else {
//                 newElements.push(currentElement);
//             }
//         });

//         return newElements.length === 1 ? newElements[0] : newElements;
//     };

//     const result = _insertContent(elements);
//     return result.length === 1 ? result[0] : result;
// }

export function insertContent(elements, content, index = 0, shouldInsert = shouldInsertLeftMost) {
    const totalLength = countCharacters(elements);
    const contentLength = countCharacters(content);

    let currentIndex = 0;

    const result = mapElements(elements, ({ element, parent, depth }) => {

        const _shouldInsert = () => shouldInsert({
            elements,
            parent,
            currentElement,
            currentElementIndex,
            index,
            currentIndex,
            depth,
            totalLength,
            contentLength
        });

        const newElements = [];

        if (typeof currentElement === 'string') {
            if (_shouldInsert()) {
                const firstSlice = currentElement.slice(0, index - currentIndex);
                const lastSlice = currentElement.slice(index - currentIndex);

                if (typeof content === 'string') {
                    newElements.push(`${firstSlice}${content}${lastSlice}`);
                } else if (isValidElement(content)) {
                    if (firstSlice) newElements.push(firstSlice);
                    newElements.push(content);
                    if (lastSlice) newElements.push(lastSlice);
                }

                currentIndex += contentLength;
            } else {
                newElements.push(currentElement);
            }

            currentIndex += currentElement.length;
        } else if (isValidElement(currentElement) && currentElement.props.children) {
            if (_shouldInsert()) {
                newElements.push(content);
                currentIndex += contentLength;
            }

            const id = currentElement.props.id ?? uuidv4();
            newElements.push(cloneElement(
                currentElement,
                { id, key: id },
                _insertContent(currentElement.props.children, currentElement, depth + 1)
            ));

            if (_shouldInsert()) {
                newElements.push(content);
                currentIndex += contentLength;
            }
        } else {
            newElements.push(currentElement);
        }

        return newElements;
    });

    return result.length === 1 ? result[0] : result;
}

export function insertContentById(elements, id, content, index = 0) {
    return insertContent(elements, content, index, shouldInsertById);
}

export function insertContentByPreference(elements, content, index = 0, insertionPreference = 'outerMost') {
    let shouldInsert;

    if (insertionPreference === 'leftMost') shouldInsert = shouldInsertLeftMost;
    else if (insertionPreference === 'rightMost') shouldInsert = shouldInsertRightMost;
    else if (insertionPreference === 'outerMost') shouldInsert = shouldInsertOuterMost;
    else throw new Error('Ivalid option!');

    return insertContent(elements, content, index, shouldInsert);
}

export function removeContent(nodes, startIndex, endIndex = null, removeEmptyNodes = true) {
    let _currentIndex = 0;

    const _removeContent = (nodes) => Children.map(nodes, (child) => {
        if (typeof child === 'string') {
            if (_currentIndex + child.length <= startIndex) {
                _currentIndex += child.length;
                return child;
            } else if (!endIndex || _currentIndex >= endIndex) {
                _currentIndex += child.length;
                return child;
            } else {
                const startSlice = Math.max(startIndex - _currentIndex, 0);
                const endSlice = endIndex ? Math.min(endIndex - _currentIndex, child.length) : null;
                _currentIndex += child.length;
                const newChild = child.slice(0, startSlice) + child.slice(endSlice);
                return !removeEmptyNodes || newChild ? newChild : null;
            }
        } else if (isValidElement(child) && child.props.children) {
            const updatedChildren = _removeContent(child.props.children);
            return !removeEmptyNodes || updatedChildren ?
                cloneElement(child,
                    {
                        key: uuidv4(),
                        children: updatedChildren
                    })
                :
                null;
        }
        return child;
    });

    const result = _removeContent(nodes);
    return result.length !== 0 ? result.length === 1 ? result[0] : result : null;
}
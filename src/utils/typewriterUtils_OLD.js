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

export function insertContentToElement(nodes, content, index = 0) {

}

// export function insertContent(nodes, content, index = 0) {
//     let _currentIndex = 0;
//     let _inserted = false;

//     const _insertContent = (nodes) => Children.map(nodes, (child) => {
//         if (_inserted) return child;

//         if (typeof child === 'string') {
//             if (_currentIndex <= index && index < _currentIndex + child.length) {
//                 child = `${child.slice(0, index - _currentIndex)}${content}${child.slice(index - _currentIndex)}`;
//                 _inserted = true;
//             }
//             _currentIndex += child.length;
//         } else if (isValidElement(child) && child.props.children) {
//             child = cloneElement(child, {
//                 key: uuidv4(),
//                 children: _insertContent(child.props.children)
//             });
//         }
//         return child;
//     });

//     const result = _insertContent(nodes);
//     return result.length === 1 ? result[0] : result;
// }

const shouldInsertLeftMost = (elements, index, content, currentIndex) => (

);

const shouldInserRightMost = (elements, index, content, currentIndex) => (

);

const shouldInserOuterMost = (elements, index, content, currentIndex) => (

);

export function insertContent(elements, content, index = 0, shouldInsert = null) {
    let _currentIndex = 0;
    const _contentCount = countCharacters(content);

    const _insertContent = (elements) => {
        const newChildren = [];
        Children.forEach(elements, (child) => {
            if (typeof child === 'string') {

                if (child.props.id === id && _currentIndex <= index && index <= _currentIndex + child.length) {
                    const firstSlice = child.slice(0, index - _currentIndex);
                    const lastSlice = child.slice(index - _currentIndex);

                    if (typeof content === 'string') {
                        newChildren.push(`${firstSlice}${content}${lastSlice}`);
                    } else if (isValidElement(content)) {
                        if (firstSlice) newChildren.push(firstSlice);
                        newChildren.push(content);
                        if (lastSlice) newChildren.push(lastSlice);
                    }
                }

                _currentIndex += child.length;
            } else if (isValidElement(child) && child.props.children) {
                if (child.props.id === id && _currentIndex === index) {
                    newChildren.push(content);
                    _currentIndex += _contentCount;
                }

                newChildren.push(
                    cloneElement(child, {
                        key: uuidv4(),
                        children: _insertContent(child.props.children)
                    })
                );

                if (child.props.id === id && _currentIndex === index) {
                    newChildren.push(content);
                    _currentIndex += _contentCount;
                }
            } else {
                newChildren.push(child);
            }
        });

        return newChildren.length === 1 ? newChildren[0] : newChildren;
    };

    const result = _insertContent(elements);
    return result.length === 1 ? result[0] : result;
}

export function insertContentById(elements, id, content, index = 0) {
    let _currentIndex = 0;
    const _contentCount = countCharacters(content);

    const _insertContent = (elements) => {
        const newChildren = [];
        Children.forEach(elements, (child) => {
            if (typeof child === 'string') {

                if (child.props.id === id && _currentIndex <= index && index <= _currentIndex + child.length) {
                    const firstSlice = child.slice(0, index - _currentIndex);
                    const lastSlice = child.slice(index - _currentIndex);

                    if (typeof content === 'string') {
                        newChildren.push(`${firstSlice}${content}${lastSlice}`);
                    } else if (isValidElement(content)) {
                        if (firstSlice) newChildren.push(firstSlice);
                        newChildren.push(content);
                        if (lastSlice) newChildren.push(lastSlice);
                    }
                }

                _currentIndex += child.length;
            } else if (isValidElement(child) && child.props.children) {
                if (child.props.id === id && _currentIndex === index) {
                    newChildren.push(content);
                    _currentIndex += _contentCount;
                }

                newChildren.push(
                    cloneElement(child, {
                        key: uuidv4(),
                        children: _insertContent(child.props.children)
                    })
                );

                if (child.props.id === id && _currentIndex === index) {
                    newChildren.push(content);
                    _currentIndex += _contentCount;
                }
            } else {
                newChildren.push(child);
            }
        });

        return newChildren.length === 1 ? newChildren[0] : newChildren;
    };

    const result = _insertContent(elements);
    return result.length === 1 ? result[0] : result;
}

// export function insertContentByPreference(elements, content, index = 0, insertionPreference = 'middle') {
//     const _totalCount = insertionPreference === 'rightMost' ? countCharacters(elements) : 0;
//     let _currentIndex = 0;
//     let _inserted = false;

//     const _insertContent = (elements, depth = 0) => {
//         if (typeof elements === 'string')
//             elements = [elements];

//         const newChildren = [];

//         Children.forEach(elements, (child, childIndex) => {
//             if (_inserted) {
//                 newChildren.push(child);
//                 return;
//             }

//             if (typeof child === 'string') {
//                 const startValidation = insertionPreference === 'leftMost' && index !== 0 ? _currentIndex < index : _currentIndex <= index;
//                 const endValidation = insertionPreference === 'rightMost' && index !== _totalCount ? index < _currentIndex + child.length : index <= _currentIndex + child.length;
//                 const edgeCase = insertionPreference !== 'middle' || index !== _currentIndex + child.length || depth === 0 || elements[childIndex + 1] != null;

//                 if (startValidation && endValidation && edgeCase) {

//                     const firstSlice = child.slice(0, index - _currentIndex);
//                     const lastSlice = child.slice(index - _currentIndex);

//                     if (typeof content === 'string') {
//                         child = `${firstSlice}${content}${lastSlice}`;
//                     } else if (isValidElement(content)) {
//                         child = [];
//                         if (firstSlice) child.push(firstSlice);
//                         child.push(content);
//                         if (lastSlice) child.push(lastSlice);
//                     }
//                     _inserted = true;
//                 } else {
//                     _currentIndex += child.length;
//                 }
//             } else if (insertionPreference === 'middle' && _currentIndex === index) {
//                 child = [content, child];
//                 _inserted = true;
//             } else if (isValidElement(child) && child.props.children) {
//                 child = cloneElement(child, {
//                     key: uuidv4(),
//                     children: _insertContent(child.props.children, depth + 1)
//                 });
//             }

//             if (Array.isArray(child))
//                 newChildren.push(...child);
//             else
//                 newChildren.push(child);
//         });

//         return newChildren.length === 1 ? newChildren[0] : newChildren;
//     };

//     let result = _insertContent(elements);

//     if (!_inserted) {
//         result = (
//             Array.isArray(elements) ?
//                 [...elements, content]
//                 :
//                 cloneElement(elements, {
//                     key: uuidv4(),
//                     children: [
//                         ...Children.toArray(elements.props.children),
//                         content
//                     ]
//                 })
//         );
//     }

//     return result.length === 1 ? result[0] : result;
// }

export function insertContentByPreference(elements, content, index = 0, insertionPreference = 'middle') {
    const _totalCount = insertionPreference === 'rightMost' ? countCharacters(elements) : 0;
    const _contentCount = countCharacters(content);
    let _currentIndex = 0;

    const _insertContent = (elements, depth = 0) => {
        if (typeof elements === 'string')
            elements = [elements];

        const newChildren = [];

        Children.forEach(elements, (child, childIndex) => {
            if (typeof child === 'string') {
                const startValidation = insertionPreference === 'leftMost' && index !== 0 ? _currentIndex < index : _currentIndex <= index;
                const endValidation = insertionPreference === 'rightMost' && index !== _totalCount ? index < _currentIndex + child.length : index <= _currentIndex + child.length;
                const edgeCase = insertionPreference !== 'middle' || index !== _currentIndex + child.length || depth === 0 || elements[childIndex + 1] != null;

                if (startValidation && endValidation && edgeCase) {

                    const firstSlice = child.slice(0, index - _currentIndex);
                    const lastSlice = child.slice(index - _currentIndex);

                    if (typeof content === 'string') {
                        newChildren.push(`${firstSlice}${content}${lastSlice}`);
                    } else if (isValidElement(content)) {
                        if (firstSlice) newChildren.push(firstSlice);
                        newChildren.push(content);
                        if (lastSlice) newChildren.push(lastSlice);
                    }

                    _currentIndex += _contentCount;
                } else {
                    newChildren.push(child);
                }

                _currentIndex += child.length;
            } else if (isValidElement(child) && child.props.children) {
                if (_currentIndex === index && insertionPreference === 'middle' && (
                    depth === 0 || (
                        elements[childIndex + 1] != null &&
                        typeof elements[childIndex + 1] !== 'string'
                    )
                )) {
                    newChildren.push(content);
                    _currentIndex += _contentCount;
                }

                newChildren.push(
                    cloneElement(child, {
                        key: uuidv4(),
                        children: _insertContent(child.props.children, depth + 1)
                    })
                );

                if (_currentIndex === index && insertionPreference === 'middle' && (
                    depth === 0 || (
                        elements[childIndex + 1] != null &&
                        typeof elements[childIndex + 1] !== 'string'
                    )
                )) {
                    newChildren.push(content);
                    _currentIndex += _contentCount;
                }
            } else {
                newChildren.push(child);
            }
        });

        return newChildren.length === 1 ? newChildren[0] : newChildren;
    };

    let result = _insertContent(elements);
    return result.length === 1 ? result[0] : result;
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
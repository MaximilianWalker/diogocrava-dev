import { cloneElement, isValidElement, Children, Fragment } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Transforms a React element into a JSON representation.
 * @param {React.ReactElement} element - The React element to transform.
 * @returns {object} The JSON representation of the React element.
 */
export function elementToJson(element) {
    if (typeof element !== 'object' || element === null) {
        return element;
    }

    const type = element.type;
    const props = element.props;

    const elementType = typeof type === 'function'
        ? type.name || 'Anonymous'
        : type;

    const children = Children
        .map(props.children, child => elementToJson(child))
        .filter(child => child !== undefined);

    return {
        type: elementType,
        props: { ...props, children: children.length === 0 ? undefined : children },
    };
}

export function addIdsToElements(elements) {
    if (typeof elements === 'string')
        return elements;

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

    if (elements == null) return elements;

    let index = 0;

    const toProcess = typeof elements === 'string' ?
        [{ element: elements, depth: 0 }]
        :
        Children.map(elements, child => ({ element: child, depth: 0 }));

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

export function getElementsList(elements, method = 'depth') {
    return Array.from(iterateElements(elements, method));
}

export function generateElements(entries) {
    const recreate = (element) => {
        if (!isValidElement(element)) {
            return element;
        }

        const newChildren = Children.map(element.props.children, child => recreate(child));

        return cloneElement(
            element,
            { ...element.props },
            newChildrenGenerator(element, newChildren)
        );
    };

    return Children.map(elements, element => recreate(element));
}

export function* iterateText(elements) {
    for (const { element } of iterateElements(elements)) {
        if (typeof element === 'string')
            yield element;
        else if (isValidElement(element) && element.props.children)
            yield* iterateText(element.props.children);
    }
}

export function* iterateAnimation(elements) {
    let index = 0;
    let entries = [];

    for (let entry of iterateElements(elements)) {
        if (typeof entry.element === 'string') {
            let newElement = entry.element[0];
            for (const e of entries)
                newElement = cloneElement(e.element, null, newElement);

            yield {
                index,
                element: newElement,
                parentId: entries.length > 0 ? entries.at(-1)?.parent?.props.id : entry.parent?.props.id
            };

            entries = [];
            index++;

            for (let i = 1; i < entry.element.length; i++) {
                yield {
                    index,
                    element: entry.element[i],
                    parentId: entry.parent?.props.id
                };
                index++;
            }
        } else if (isValidElement(entry.element)) {
            entries.unshift(entry);
        }
    }
}

export function getAnimationList(elements) {
    return Array.from(iterateAnimation(elements));
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

export function countCharacters(elements) {
    let _count = 0;

    const _countCharacters = (elements) => Children.forEach(elements, (child) => {
        if (typeof child === 'string')
            _count += child.length;
        else if (isValidElement(child) && child.props.children)
            _countCharacters(child.props.children);
    });

    _countCharacters(elements);
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

const shouldInsertOuterMost = ({ elements, currentElement, currentElementIndex, index, currentIndex, depth }) => (
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
                        Array.isArray(elements) &&
                        elements[currentElementIndex + 1] != null
                    )
                )
            )
        )
    )
    ||
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
        id == null || (parent != null && parent.props.id === id)
    )
    &&
    (
        (typeof currentElement === 'string' && index >= currentIndex && index <= currentIndex + currentElement.length) ||
        (isValidElement(currentElement) && index === currentIndex)
    )
);

export function insertContent(elements, content, index = 0, shouldInsert = shouldInsertLeftMost) {
    const totalLength = countCharacters(elements);
    const contentLength = countCharacters(content);

    if (index < 0)
        index = contentLength + index;
    else if (index == null)
        index = contentLength;

    let currentIndex = 0;

    const _insertContent = (elements, parent = null, depth = 0) => {
        const newElements = [];

        Children.forEach(elements, (currentElement, currentElementIndex) => {
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
        });

        return newElements.length === 1 ? newElements[0] : newElements;
    };

    const result = _insertContent(elements);
    return result.length === 1 ? result[0] : result;
}

export function insertContentById(elements, id, content, index = 0) {
    return insertContent(elements, content, index, (entry) => shouldInsertById({ ...entry, id }));
}

export function insertContentByPreference(elements, content, index = 0, insertionPreference = 'outerMost') {
    let shouldInsert;

    if (insertionPreference === 'leftMost') shouldInsert = shouldInsertLeftMost;
    else if (insertionPreference === 'rightMost') shouldInsert = shouldInsertRightMost;
    else if (insertionPreference === 'outerMost') shouldInsert = shouldInsertOuterMost;
    else throw new Error('Ivalid option!');

    return insertContent(elements, content, index, shouldInsert);
}

export function removeContent(elements, startIndex, endIndex = null, removeEmptyElements = true) {
    let _currentIndex = 0;

    const _removeContent = (elements) => Children.map(elements, (child) => {
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
                return !removeEmptyElements || newChild ? newChild : null;
            }
        } else if (isValidElement(child) && child.props.children) {
            const updatedChildren = _removeContent(child.props.children);
            return !removeEmptyElements || updatedChildren ?
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

    const result = _removeContent(elements);
    return result.length !== 0 ? result.length === 1 ? result[0] : result : null;
}

// review
export function removeElement(element, targetId) {
    const _removeElement = (currentElement) => {
        if (!isValidElement(currentElement) || !currentElement.props)
            return currentElement;

        if (currentElement.props.id === targetId)
            return null;

        if (currentElement.props.children) {
            const newChildren = Children.map(currentElement.props.children, child => {
                return _removeElement(child);
            }).filter(child => child !== null);

            if (newChildren.length !== Children.count(currentElement.props.children)) {
                return cloneElement(currentElement, {}, ...newChildren);
            }
        }

        return currentElement;
    }

    return _removeElement(element);
}

export function processEvent(event) {
    const { type, value, instant } = event;
    if (type === 'type') {
        const newElements = addIdsToElements(value);
        event = {
            ...event,
            value: newElements,
            animation: !instant ? {
                elements: getAnimationList(newElements),
                index: 0,
                size: countCharacters(newElements)
            } : null,
        };
    } else if (['delete', 'move'].includes(event.type)) {
        event = {
            ...event,
            animationSize: !instant ? value : null
        };
    }
    return event;
}

export function processEvents(events) {
    return events.map(processEvent);
}

export function resetEvent(event) {
    const { type, animation } = event;
    if (animation && ['type', 'move', 'delete'].includes(type)) {
        event = {
            ...event,
            animation: {
                ...animation,
                index: 0
            }
        };
    }
    return event;
}

export function resetEvents(events) {
    return events.map(resetEvent);
}
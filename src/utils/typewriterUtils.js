import { cloneElement, isValidElement, Children, Fragment } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function* iterateElements(elements, method = 'depth') {
    if (method !== 'depth' && method !== 'breadth')
        throw new Error('Method must be depth or breadth');

    let index = 0;

    const toProcess = typeof elements === 'string' ? [elements] : Children.map(elements, child => ({ element: child, depth: 0 }));

    while (toProcess.length > 0) {
        const { element: current, depth } = method === 'depth' ? toProcess.pop() : toProcess.shift();

        if (!current) continue;
        yield [current, index, depth];

        index++;

        if (isValidElement(current) && current.props.children) {
            const entries = Children.map(
                current.props.children,
                child => ({ element: child, depth: depth + 1 })
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

export function addCharacters(nodes, chars, index = 0) {
    let _currentIndex = 0;

    const _addCharacters = (nodes) => Children.map(nodes, (child) => {
        if (typeof child === 'string') {
            if (_currentIndex <= index && index < _currentIndex + child.length)
                return `${child.slice(0, index - _currentIndex)}${chars}${child.slice(index - _currentIndex)}`;
            _currentIndex += child.length;
            return child;
        } else if (isValidElement(child) && child.props.children) {
            return cloneElement(child, {
                ...child.props,
                key: uuidv4(),
                children: _addCharacters(child.props.children)
            });
        }
        return child;
    });

    const result = _addCharacters(nodes);
    return result.length === 1 ? result[0] : result;
}

export function addCharactersAdvanced(elements, chars, insertionIndex = 0, insertionPreference = 'middle') {
    const _totalCount = insertionPreference === 'rightMost' ? countCharacters(elements) : 0;
    let _currentIndex = 0;
    let _inserted = false;

    const _addCharacters = (elements, depth = 0) => {
        if (typeof elements === 'string')
            elements = [elements];

        const newChildren = [];

        Children.forEach(elements, (child, childIndex) => {
            if (_inserted) {
                newChildren.push(child);
                return;
            }

            if (typeof child === 'string') {
                const startValidation = insertionPreference === 'leftMost' && insertionIndex !== 0 ? _currentIndex < insertionIndex : _currentIndex <= insertionIndex;
                const endValidation = insertionPreference === 'rightMost' && insertionIndex !== _totalCount ? insertionIndex < _currentIndex + child.length : insertionIndex <= _currentIndex + child.length;
                const edgeCase = insertionPreference !== 'middle' || insertionIndex !== _currentIndex + child.length || depth === 0 || elements[childIndex + 1] != null;

                if (startValidation && endValidation && edgeCase) {

                    const firstSlice = child.slice(0, insertionIndex - _currentIndex);
                    const lastSlice = child.slice(insertionIndex - _currentIndex);

                    if (typeof chars === 'string') {
                        child = `${firstSlice}${chars}${lastSlice}`;
                    } else if (isValidElement(chars)) {
                        child = [];
                        if (firstSlice) child.push(firstSlice);
                        child.push(chars);
                        if (lastSlice) child.push(lastSlice);
                    }
                    _inserted = true;
                } else {
                    _currentIndex += child.length;
                }
            } else if (insertionPreference === 'middle' && _currentIndex === insertionIndex) {
                child = [chars, child];
                _inserted = true;
            } else if (isValidElement(child) && child.props.children) {
                child = cloneElement(child, {
                    ...child.props,
                    key: uuidv4(),
                    children: _addCharacters(child.props.children, depth + 1)
                });
            }

            if (Array.isArray(child))
                newChildren.push(...child);
            else
                newChildren.push(child);
        });

        return newChildren.length === 1 ? newChildren[0] : newChildren;
    };

    let result = _addCharacters(elements);

    if (!_inserted) {
        result = (
            Array.isArray(elements) ?
                [...elements, chars]
                :
                cloneElement(elements, {
                    ...elements.props,
                    key: uuidv4(),
                    children: [
                        ...Children.toArray(elements.props.children),
                        chars
                    ]
                })
        );
    }

    return result.length === 1 ? result[0] : result;
}

export function removeCharacters(nodes, startIndex, endIndex = null, removeEmptyNodes = true) {
    let _currentIndex = 0;

    const _removeCharacters = (nodes) => Children.map(nodes, (child) => {
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
            const updatedChildren = _removeCharacters(child.props.children);
            return !removeEmptyNodes || updatedChildren ?
                cloneElement(child,
                    {
                        ...child.props,
                        key: uuidv4(),
                        children: updatedChildren
                    })
                :
                null;
        } else {
            return child;
        }
    });

    const result = _removeCharacters(nodes);
    return result.length !== 0 ? result.length === 1 ? result[0] : result : null;
}
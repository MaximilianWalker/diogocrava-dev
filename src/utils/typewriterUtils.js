import { cloneElement, isValidElement, Children, Fragment } from 'react';

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

    const _countCharacters = (nodes) => {
        Children.forEach(nodes, (child) => {
            if (typeof child === 'string')
            _count += child.length;
            else if (isValidElement(child) && child.props.children)
                _countCharacters(child.props.children);
        });
    };

    _countCharacters(nodes);
    return _count;
}

export function findElementAtIndex(element, targetIndex) {
    let currentIndex = 0;  // Tracks the current index in text

    // Recursive function to traverse React children
    function traverseChildren(children) {
        for (const child of Children.toArray(children)) {
            if (typeof child === 'string') {
                // Calculate the new index if we add this text's length
                if (currentIndex + child.length > targetIndex) {
                    // If the target index is within this text, return this text
                    return child;
                }
                currentIndex += child.length;  // Update current index
            } else if (isValidElement(child) && child.props.children) {
                // Recurse into the child's children if it is a valid React element with children
                const result = traverseChildren(child.props.children);
                if (result) return result;  // If the result is found, bubble it up
            }
        }
        return null;  // Return null if we don't find anything
    }

    // Start the traversal from the root element's children
    return traverseChildren(element.props.children);
}

export function addCharacters(nodes, chars, index = 0) {
    let _currentIndex = 0;

    const _addCharacters = (nodes) => {
        return Children.map(nodes, (child) => {
            if (typeof child === 'string') {
                if (_currentIndex <= index && index < _currentIndex + child.length)
                    return `${child.slice(0, index - _currentIndex)}${chars}${child.slice(index - _currentIndex)}`;
                _currentIndex += child.length;
                return child;
            } else if (isValidElement(child) && child.props.children) {
                return cloneElement(child, { ...child.props, children: _addCharacters(child.props.children) });
            } else {
                return child;
            }
        });
    }

    return _addCharacters(nodes);
}

export function removeCharacters(nodes, startIndex, endIndex) {
    let _currentIndex = 0;  // Tracks the current index across recursive calls

    const _removeCharacters = (nodes) => {
        return Children.map(nodes, (child) => {
            if (typeof child === 'string') {
                if (_currentIndex + child.length <= startIndex) {
                    _currentIndex += child.length;
                    return child;
                } else if (_currentIndex >= endIndex) {
                    _currentIndex += child.length;
                    return child;
                } else {
                    // Current string overlaps with the start and end indices
                    const startSlice = Math.max(startIndex - _currentIndex, 0);
                    const endSlice = Math.max(endIndex - _currentIndex, 0);
                    const firstPart = child.slice(0, startSlice);
                    const secondPart = child.slice(endSlice);
                    _currentIndex += child.length;
                    return firstPart + secondPart;
                }
            } else if (isValidElement(child) && child.props.children) {
                // Recursively remove characters from child components
                const updatedChildren = _removeCharacters(child.props.children);
                return cloneElement(child, { ...child.props, children: updatedChildren });
            } else {
                return child;
            }
        });
    };

    return _removeCharacters(nodes);
}
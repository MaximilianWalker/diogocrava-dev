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

    const _countCharacters = (nodes) => Children.forEach(nodes, (child) => {
        if (typeof child === 'string')
            _count += child.length;
        else if (isValidElement(child) && child.props.children)
            _countCharacters(child.props.children);
    });

    _countCharacters(nodes);
    return _count;
}

// export function findElementAtIndex(parentNode, index) {
//     if (!parentNode || typeof parentNode !== 'object' || !isValidElement(parentNode)) {
//         throw new Error('Parent node is not a valid React element');
//     }

//     let currentIndex = 0;

//     function traverse(children, parent) {
//         const childArray = Children.toArray(children);
//         for (let i = 0; i < childArray.length; i++) {
//             const child = childArray[i];
//             if (typeof child === 'string') {
//                 if (currentIndex <= index && index < currentIndex + child.length) {
//                     return parent; // Return the parent component containing the text
//                 }
//                 currentIndex += child.length;
//             } else if (isValidElement(child)) {
//                 const result = traverse(child.props.children, child);
//                 if (result) return result; // Return early if the node is found
//             }
//         }
//         return null;
//     }

//     return traverse(parentNode.props.children, parentNode);
// }

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
            return cloneElement(child, { ...child.props, children: _addCharacters(child.props.children) });
        }
        return child;
    });

    const result = _addCharacters(nodes);
    return result.length === 1 ? result[0] : result;
}

export function removeCharacters(nodes, startIndex, endIndex) {
    let _currentIndex = 0;

    const _removeCharacters = (nodes) => Children.map(nodes, (child) => {
        if (typeof child === 'string') {
            if (_currentIndex + child.length <= startIndex) {
                _currentIndex += child.length;
                return child;
            } else if (_currentIndex >= endIndex) {
                _currentIndex += child.length;
                return child;
            } else {
                const startSlice = Math.max(startIndex - _currentIndex, 0);
                const endSlice = Math.min(endIndex - _currentIndex, child.length);
                _currentIndex += child.length;
                return `${child.slice(0, startSlice)}${child.slice(endSlice)}`;
            }
        } else if (isValidElement(child) && child.props.children) {
            const updatedChildren = _removeCharacters(child.props.children);
            return cloneElement(child, { ...child.props, children: updatedChildren });
        } else {
            return child;
        }
    });

    const result = _removeCharacters(nodes);
    return result.length === 1 ? result[0] : result;
}
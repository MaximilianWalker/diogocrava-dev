import { cloneElement, isValidElement, Children, Fragment } from 'react';

export function* iterateElements(elements, method = 'depth') {
    if (method !== 'depth' && method !== 'breadth')
        throw new Error('Method must be depth or breadth');

    const toProcess = Children.map(elements, child => ({ element: child, depth: 0 }));

    while (toProcess.length > 0) {
        const { element: current, depth } = method === 'depth' ? toProcess.pop() : toProcess.shift();

        if (!current) continue;
        yield { element: current, depth };

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

// ações: left, right, top / outside
// se prioritizar outside: se for o elemento de um dos extremos, vai para o nivel superior, repete o processo, se continua a ser um dos extremos, vai para o outro
// se o deph for 0, é colocado ai
// cuidado com o caso em que o input é só um elemento, o texto tem de ser colocado num nivel que já tenha texto (talvez)

// export function addCharacters(nodes, chars, index = 0) {
//     let _currentIndex = 0;

//     const _addCharacters = (nodes) => Children.map(nodes, (child) => {
//         if (typeof child === 'string') {
//             if (_currentIndex <= index && index < _currentIndex + child.length)
//                 return `${child.slice(0, index - _currentIndex)}${chars}${child.slice(index - _currentIndex)}`;
//             _currentIndex += child.length;
//             return child;
//         } else if (isValidElement(child) && child.props.children) {
//             return cloneElement(child, { ...child.props, children: _addCharacters(child.props.children) });
//         }
//         return child;
//     });

//     const result = _addCharacters(nodes);
//     return result.length === 1 ? result[0] : result;
// }

// insertionPreference: 'middle', 'leftMost', 'rightMost'
export function addCharacters(nodes, chars, index = 0, insertionPreference = 'middle') {
    let _currentIndex = 0;

    const _addCharacters = (nodes) => Children.map(nodes, (child) => {
        const isStartIndex = _currentIndex === index;
        const isEndIndex = _currentIndex + child.length === index;

        if (typeof child === 'string') {
            if (_currentIndex <= index && index <= _currentIndex + child.length)
                child = `${child.slice(0, index - _currentIndex)}${chars}${child.slice(index - _currentIndex)}`;
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
            return !removeEmptyNodes || updatedChildren ? cloneElement(child, { ...child.props, children: updatedChildren }) : null;
        } else {
            return child;
        }
    });

    const result = _removeCharacters(nodes);
    return result.length === 1 ? result[0] : result;
}
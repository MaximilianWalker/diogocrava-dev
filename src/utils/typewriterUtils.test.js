import { render } from '@testing-library/react';
import {
    generateLineBreaks,
    countCharacters,
    findElementAtIndex,
    addCharacters,
    removeCharacters
} from './typewriterUtils';

describe('generateLineBreaks', () => {
    it('should handle input without line breaks correctly', () => {
        const input = "Hello World";
        const { container } = render(generateLineBreaks(input));
        expect(container.getElementsByTagName('br').length).toBe(0);
    });

    it('should handle multiple line breaks correctly', () => {
        const input = "Hello\nWorld\nTest";
        const { container } = render(generateLineBreaks(input));
        expect(container.getElementsByTagName('br').length).toBe(2);
    });

    it('should handle empty input correctly', () => {
        const input = "";
        const { container } = render(generateLineBreaks(input));
        expect(container.textContent).toBe("");
    });
});


describe('countCharacters', () => {
    it('counts characters in simple text nodes', () => {
        const nodes = "Hello, world!";
        expect(countCharacters(nodes)).toBe(13);
    });

    it('counts characters in nested elements', () => {
        const nodes = (<div><span>Hello</span><span>World</span></div>);
        expect(countCharacters(nodes)).toBe(10);
    });

    it('handles empty nodes correctly', () => {
        const nodes = (<div></div>);
        expect(countCharacters(nodes)).toBe(0);
    });

    it('ignores non-text children', () => {
        const nodes = (<div>{123}{true}{null}</div>);
        expect(countCharacters(nodes)).toBe(0);
    });
});

describe('findElementAtIndex', () => {
    // Test 1: Simple component
    it('returns the parent component containing the specified index in a non-nested structure', () => {
        const structure = (<span>Hello world</span>);
        const result = findElementAtIndex(structure, 6); // 'w' in "world"
        expect(result.type).toEqual('span');
        expect(result.props.children).toEqual('Hello world');
    });

    // Test 2: Nested components
    it('returns the nested component containing the specified index', () => {
        const structure = (
            <div>
                <span>Hello </span>
                <span>world</span>
            </div>
        );
        const result = findElementAtIndex(structure, 7); // 'w' in "world"
        expect(result.type).toEqual('span');
        expect(result.props.children).toEqual('world');
    });

    // Test 3: Edge Cases - Component boundaries
    it('returns the correct component at the boundary of nested elements', () => {
        const structure = (
            <div>
                <span>Hello </span>
                <span>world</span>
            </div>
        );
        const result = findElementAtIndex(structure, 6); // Space after "Hello "
        expect(result.type).toEqual('span');
        expect(result.props.children).toEqual('world');
    });

    // Test 4: Invalid Inputs
    it('throws an error if the parent node is not a valid React element', () => {
        const textNode = "Just a string";
        expect(() => findElementAtIndex(textNode, 0)).toThrow('Parent node is not a valid React element');
    });

    // Test 5: Index Out of Bounds
    it('returns null if the index is out of bounds', () => {
        const structure = (
            <div>
                <span>Hello</span>
                <span> world</span>
            </div>
        );
        const result = findElementAtIndex(structure, 100);  // Index way out of range
        expect(result).toBeNull();
    });
});


describe('addCharacters', () => {
    it('inserts characters at specified index in a simple string', () => {
        const nodes = "Hello, world!";
        const modified = addCharacters(nodes, " test", 5);
        expect(modified).toBe("Hello test, world!");
    });

    it('inserts characters at boundaries', () => {
        const nodes = "Hello";
        const modified = addCharacters(nodes, " test", 0);
        expect(modified).toBe(" testHello");
    });

    it('handles nested structures correctly: leftMost', () => {
        const nodes = (<div><span>Hello</span><span> world!</span></div>);
        const { container } = render(addCharacters(nodes, ", test", 5, "leftMost"));
        const [firstSpan, secondSpan] = container.getElementsByTagName('span');
        // expect(container.textContent).toBe("Hello, test world!");
        expect(container.getElementsByTagName('span').length).toBe(2);
        expect(firstSpan.textContent).toBe("Hello, test");
        expect(secondSpan.textContent).toBe(" world!");
    });

    it('handles nested structures correctly: middle', () => {
        const nodes = (<div><span>Hello</span><span> world!</span></div>);
        const { container } = render(addCharacters(nodes, ", test", 5, "middle"));
        const [firstSpan, middleText, secondSpan] = container.props.children;
        expect(firstSpan.textContent).toBe("Hello");
        expect(middleText.textContent).toBe(", test");
        expect(secondSpan.textContent).toBe(" world!");
    });

    it('handles nested structures correctly: rightMost', () => {
        const nodes = (<div><span>Hello</span><span> world!</span></div>);
        const { container } = render(addCharacters(nodes, ", test", 5, "rightMost"));
        const [firstSpan, secondSpan] = container.getElementsByTagName('span');
        // expect(container.textContent).toBe("Hello, test world!");
        expect(container.getElementsByTagName('span').length).toBe(2);
        expect(firstSpan.textContent).toBe("Hello");
        expect(secondSpan.textContent).toBe(", test world!");
    });
});

describe('removeCharacters', () => {
    it('removes characters between specified indexes in a simple string', () => {
        const nodes = "Hello, world!";
        const modified = removeCharacters(nodes, 5, 7);
        expect(modified).toBe("Helloworld!");
    });

    it('handles removal across boundaries in nested elements', () => {
        const nodes = (<div><span>Hello, </span><span>world!</span></div>);
        const { container } = render(removeCharacters(nodes, 3, 9));
        expect(container.textContent).toBe("Helrld!");
    });

    it('handles complete removal', () => {
        const nodes = "Hello, world!";
        const modified = removeCharacters(nodes, 0, 13);
        expect(modified).toBe("");
    });
});
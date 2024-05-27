import { render, prettyDOM } from '@testing-library/react';
import {
    generateLineBreaks,
    countCharacters,
    findElementAtIndex,
    addCharacters,
    addCharactersAdvanced,
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
    it('inserts characters in the middle of a text node', () => {
        const nodes = (<div>Hello world!</div>);
        const { container } = render(addCharacters(nodes, ", test", 5));
        expect(container.textContent).toBe("Hello, test world!");
    });

    it('inserts characters at the start of a text node', () => {
        const nodes = (<div>Hello world!</div>);
        const { container } = render(addCharacters(nodes, "Start ", 0));
        expect(container.textContent).toBe("Start Hello world!");
    });

    it('inserts characters at the end of a text node', () => {
        const nodes = (<div>Hello world!</div>);
        const { container } = render(addCharacters(nodes, " End", 11));
        expect(container.textContent).toBe("Hello world! End");
    });

    it('handles nested elements correctly', () => {
        const nodes = (<div><span>Hello</span><span> world!</span></div>);
        const { container } = render(addCharacters(nodes, ", test", 5));
        const [firstSpan, middleText, secondSpan] = container.children;
        expect(firstSpan.textContent).toBe("Hello");
        expect(middleText.textContent).toBe(", test");
        expect(secondSpan.textContent).toBe(" world!");
    });

    it('handles multiple nested elements correctly', () => {
        const nodes = (<div><span>Hello</span> world! <span>How</span> are you?</div>);
        const { container } = render(addCharacters(nodes, ", test", 12));
        expect(container.textContent).toBe("Hello world!, test How are you?");
    });

    it('handles empty elements correctly', () => {
        const nodes = (<div></div>);
        const { container } = render(addCharacters(nodes, ", test", 0));
        expect(container.textContent).toBe(", test");
    });

    it('inserts a React element in the middle of a text node', () => {
        const nodes = (<div>Hello world!</div>);
        const reactElement = (<span>React</span>);
        const { container } = render(addCharacters(nodes, reactElement, 5));
        const [beforeSpan, insertedSpan, afterSpan] = container.children;
        expect(beforeSpan.textContent).toBe("Hello");
        expect(insertedSpan.textContent).toBe("React");
        expect(afterSpan.textContent).toBe(" world!");
    });

    it('inserts a React element at the start of a text node', () => {
        const nodes = (<div>Hello world!</div>);
        const reactElement = (<span>Start</span>);
        const { container } = render(addCharacters(nodes, reactElement, 0));
        const [insertedSpan, afterSpan] = container.children;
        expect(insertedSpan.textContent).toBe("Start");
        expect(afterSpan.textContent).toBe("Hello world!");
    });

    it('inserts a React element at the end of a text node', () => {
        const nodes = (<div>Hello world!</div>);
        const reactElement = (<span>End</span>);
        const { container } = render(addCharacters(nodes, reactElement, 11));
        const [beforeSpan, insertedSpan] = container.children;
        expect(beforeSpan.textContent).toBe("Hello world!");
        expect(insertedSpan.textContent).toBe("End");
    });

    it('handles deeply nested structures correctly', () => {
        const nodes = (
            <div>
                <div>
                    <span>Hello</span>
                    <div>
                        <span> world!</span>
                    </div>
                </div>
            </div>
        );
        const { container } = render(addCharacters(nodes, ", test", 5));
        const firstSpan = container.querySelector('span');
        const insertedText = container.querySelector('div div').childNodes[1];
        const secondSpan = container.querySelector('div div div span');

        expect(firstSpan.textContent).toBe("Hello");
        expect(insertedText.textContent).toBe(", test");
        expect(secondSpan.textContent).toBe(" world!");
    });

    it('does not modify the original structure when index is out of bounds', () => {
        const nodes = (<div>Hello world!</div>);
        const { container } = render(addCharacters(nodes, ", test", 50));
        expect(container.textContent).toBe("Hello world!");
    });
});

describe('addCharactersAdvanced', () => {
    it('inserts characters at specified index in a simple string', () => {
        const nodes = "Hello, world!";
        const modified = addCharactersAdvanced(nodes, " test", 5);
        expect(modified).toBe("Hello test, world!");
    });

    it('inserts characters at the start', () => {
        const nodes = "Hello";
        const modified = addCharactersAdvanced(nodes, " test", 0);
        expect(modified).toBe(" testHello");
    });

    it('inserts characters at the end', () => {
        const nodes = "Hello";
        const modified = addCharactersAdvanced(nodes, " test", 5);
        expect(modified).toBe("Hello test");
    });

    // perceber pq demora mais que os outros: 24 ms
    it('handles nested structures correctly: leftMost', () => {
        const nodes = (<div><span>Hello</span><span> world!</span></div>);
        const { container } = render(addCharactersAdvanced(nodes, ", test", 5, "leftMost"));
        const [firstSpan, secondSpan] = container.getElementsByTagName('span');
        expect(container.getElementsByTagName('span').length).toBe(2);
        expect(firstSpan.textContent).toBe("Hello, test");
        expect(secondSpan.textContent).toBe(" world!");
    });

    it('handles nested structures correctly: leftMost edge case', () => {
        const nodes = (<div><span>Hello</span></div>);
        const { container } = render(addCharactersAdvanced(nodes, ", test", 0, "leftMost"));
        const [span] = container.getElementsByTagName('span');
        expect(span.textContent).toBe(", testHello");
    });

    it('handles nested structures correctly: middle 1', () => {
        const nodes = (<div><span>Hello</span><span> world!</span></div>);
        const { container } = render(addCharactersAdvanced(nodes, ", test", 5, "middle"));
        const [firstSpan, middleText, secondSpan] = container.firstChild.childNodes;
        expect(firstSpan.textContent).toBe("Hello");
        expect(middleText.textContent).toBe(", test");
        expect(secondSpan.textContent).toBe(" world!");
    });
    
    it('handles nested structures correctly: middle 2', () => {
        const nodes = (<div>Hello<span> world!</span></div>);
        const { container } = render(addCharactersAdvanced(nodes, ", test", 5, "middle"));
        const [text, span] = container.firstChild.childNodes;
        expect(text.textContent).toBe("Hello, test");
        expect(span.textContent).toBe(" world!");
    });
    
    it('handles nested structures correctly: middle 3', () => {
        const nodes = (<div><span>Hello</span> world!</div>);
        const { container } = render(addCharactersAdvanced(nodes, ", test", 5, "middle"));
        const [span, text] = container.firstChild.childNodes;
        expect(span.textContent).toBe("Hello");
        expect(text.textContent).toBe(", test world!");
    });
    
    it('handles nested structures correctly: middle 4', () => {
        const nodes = (<div><span>Hello</span></div>);
        const { container } = render(addCharactersAdvanced(nodes, ", test", 5, "middle"));
        const [firstSpan, middleText] = container.firstChild.childNodes;
        expect(firstSpan.textContent).toBe("Hello");
        expect(middleText.textContent).toBe(", test");
    });

    it('handles nested structures correctly: middle 5: inserting react elements', () => {
        const nodes = (<div><span>Hello</span></div>);
        const insertingNodes = (<span> world!</span>);
        const { container } = render(addCharactersAdvanced(nodes, insertingNodes, 5, "middle"));
        const [firstSpan, secondSpan] = container.firstChild.childNodes;
        expect(firstSpan.textContent).toBe("Hello");
        expect(secondSpan.textContent).toBe(" world!");
    });

    it('handles nested structures correctly: rightMost', () => {
        const nodes = (<div><span>Hello</span><span> world!</span></div>);
        const { container } = render(addCharactersAdvanced(nodes, ", test", 5, "rightMost"));
        const [firstSpan, secondSpan] = container.getElementsByTagName('span');
        expect(container.getElementsByTagName('span').length).toBe(2);
        expect(firstSpan.textContent).toBe("Hello");
        expect(secondSpan.textContent).toBe(", test world!");
    });

    it('handles nested structures correctly: rightMost edge case', () => {
        const nodes = (<div><span>Hello</span></div>);
        const { container } = render(addCharactersAdvanced(nodes, ", test", 5, "rightMost"));
        const [span] = container.getElementsByTagName('span');
        expect(span.textContent).toBe("Hello, test");
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
        expect(modified).toBeNull();
    });
});
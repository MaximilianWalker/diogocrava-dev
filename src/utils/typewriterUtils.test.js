import { render, prettyDOM } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';
import {
    addIdsToElements,
    generateLineBreaks,
    countCharacters,
    findElementAtIndex,
    insertContent,
    insertContentByPreference,
    removeContent
} from './typewriterUtils';


jest.mock('uuid', () => ({
    v4: jest.fn(() => 'unique-id'),
}));

describe('addIdsToElements', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('adds ids to a single valid element', () => {
        const element = <div />;
        const result = addIdsToElements(element);
        
        expect(result.props.id).toBe('unique-id');
        expect(result.key).toBe('unique-id');
    });

    test('adds ids to all elements in an array', () => {
        const elements = [<div key="1" />, <span key="2" />];
        const result = addIdsToElements(elements);

        result.forEach((element) => {
            expect(element.props.id).toBe('unique-id');
            expect(element.key).toBe('unique-id');
        });
    });

    test('adds ids recursively to child elements', () => {
        const element = (
            <div>
                <span />
            </div>
        );
        const result = addIdsToElements(element);

        expect(result.props.id).toBe('unique-id');
        expect(result.key).toBe('unique-id');
        expect(result.props.children.props.id).toBe('unique-id');
        expect(result.props.children.key).toBe('unique-id');
    });

    test('returns the element unchanged if it is not a valid element', () => {
        const element = 'string';
        const result = addIdsToElements(element);

        expect(result).toBe(element);
    });

    test('handles nested arrays of elements', () => {
        const elements = [
            <div key="1">
                <span key="1-1" />
                <p key="1-2" />
            </div>,
            <ul key="2">
                <li key="2-1" />
            </ul>,
        ];

        const result = addIdsToElements(elements);

        const [firstElement, secondElement] = result;

        // First element assertions
        expect(firstElement.props.id).toBe('unique-id');
        expect(firstElement.key).toBe('unique-id');
        firstElement.props.children.forEach((child) => {
            expect(child.props.id).toBe('unique-id');
            expect(child.key).toBe('unique-id');
        });

        // Second element assertions
        expect(secondElement.props.id).toBe('unique-id');
        expect(secondElement.key).toBe('unique-id');
        secondElement.props.children.forEach((child) => {
            expect(child.props.id).toBe('unique-id');
            expect(child.key).toBe('unique-id');
        });
    });
});

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

// describe('insertContent', () => {
//     it('inserts characters in the middle of a text node', () => {
//         const nodes = (<div>Hello world!</div>);
//         const { container } = render(insertContent(nodes, ", test", 5));
//         expect(container.textContent).toBe("Hello, test world!");
//     });

//     it('inserts characters at the start of a text node', () => {
//         const nodes = (<div>Hello world!</div>);
//         const { container } = render(insertContent(nodes, "Start ", 0));
//         expect(container.textContent).toBe("Start Hello world!");
//     });

//     it('inserts characters at the end of a text node', () => {
//         const nodes = (<div>Hello world!</div>);
//         const { container } = render(insertContent(nodes, " End", 11));
//         expect(container.textContent).toBe("Hello world! End");
//     });

//     it('handles nested elements correctly', () => {
//         const nodes = (<div><span>Hello</span><span> world!</span></div>);
//         const { container } = render(insertContent(nodes, ", test", 5));
//         const [firstSpan, middleText, secondSpan] = container.children;
//         expect(firstSpan.textContent).toBe("Hello");
//         expect(middleText.textContent).toBe(", test");
//         expect(secondSpan.textContent).toBe(" world!");
//     });

//     it('handles multiple nested elements correctly', () => {
//         const nodes = (<div><span>Hello</span> world! <span>How</span> are you?</div>);
//         const { container } = render(insertContent(nodes, ", test", 12));
//         expect(container.textContent).toBe("Hello world!, test How are you?");
//     });

//     it('handles empty elements correctly', () => {
//         const nodes = (<div></div>);
//         const { container } = render(insertContent(nodes, ", test", 0));
//         expect(container.textContent).toBe(", test");
//     });

//     it('inserts a React element in the middle of a text node', () => {
//         const nodes = (<div>Hello world!</div>);
//         const reactElement = (<span>React</span>);
//         const { container } = render(insertContent(nodes, reactElement, 5));
//         const [beforeSpan, insertedSpan, afterSpan] = container.children;
//         expect(beforeSpan.textContent).toBe("Hello");
//         expect(insertedSpan.textContent).toBe("React");
//         expect(afterSpan.textContent).toBe(" world!");
//     });

//     it('inserts a React element at the start of a text node', () => {
//         const nodes = (<div>Hello world!</div>);
//         const reactElement = (<span>Start</span>);
//         const { container } = render(insertContent(nodes, reactElement, 0));
//         const [insertedSpan, afterSpan] = container.children;
//         expect(insertedSpan.textContent).toBe("Start");
//         expect(afterSpan.textContent).toBe("Hello world!");
//     });

//     it('inserts a React element at the end of a text node', () => {
//         const nodes = (<div>Hello world!</div>);
//         const reactElement = (<span>End</span>);
//         const { container } = render(insertContent(nodes, reactElement, 11));
//         const [beforeSpan, insertedSpan] = container.children;
//         expect(beforeSpan.textContent).toBe("Hello world!");
//         expect(insertedSpan.textContent).toBe("End");
//     });

//     it('handles deeply nested structures correctly', () => {
//         const nodes = (
//             <div>
//                 <div>
//                     <span>Hello</span>
//                     <div>
//                         <span> world!</span>
//                     </div>
//                 </div>
//             </div>
//         );
//         const { container } = render(insertContent(nodes, ", test", 5));
//         const firstSpan = container.querySelector('span');
//         const insertedText = container.querySelector('div div').childNodes[1];
//         const secondSpan = container.querySelector('div div div span');

//         expect(firstSpan.textContent).toBe("Hello");
//         expect(insertedText.textContent).toBe(", test");
//         expect(secondSpan.textContent).toBe(" world!");
//     });

//     it('does not modify the original structure when index is out of bounds', () => {
//         const nodes = (<div>Hello world!</div>);
//         const { container } = render(insertContent(nodes, ", test", 50));
//         expect(container.textContent).toBe("Hello world!");
//     });
// });

describe('insertContentByPreference', () => {
    it('inserts characters at specified index in a simple string', () => {
        const nodes = "Hello, world!";
        const modified = insertContentByPreference(nodes, " test", 5);
        expect(modified).toBe("Hello test, world!");
    });

    it('inserts characters at the start', () => {
        const nodes = "Hello";
        const modified = insertContentByPreference(nodes, " test", 0);
        expect(modified).toBe(" testHello");
    });

    it('inserts characters at the end', () => {
        const nodes = "Hello";
        const modified = insertContentByPreference(nodes, " test", 5);
        expect(modified).toBe("Hello test");
    });

    // perceber pq demora mais que os outros: 24 ms
    it('handles nested structures correctly: leftMost', () => {
        const nodes = (<div><span>Hello</span><span> world!</span></div>);
        const { container } = render(insertContentByPreference(nodes, ", test", 5, "leftMost"));
        const [firstSpan, secondSpan] = container.getElementsByTagName('span');
        expect(container.getElementsByTagName('span').length).toBe(2);
        expect(firstSpan.textContent).toBe("Hello, test");
        expect(secondSpan.textContent).toBe(" world!");
    });

    it('handles nested structures correctly: leftMost edge case', () => {
        const nodes = (<div><span>Hello</span></div>);
        const { container } = render(insertContentByPreference(nodes, ", test", 0, "leftMost"));
        const [span] = container.getElementsByTagName('span');
        expect(span.textContent).toBe(", testHello");
    });

    it('handles nested structures correctly: middle 1', () => {
        const nodes = (<div><span>Hello</span><span> world!</span></div>);
        const { container } = render(insertContentByPreference(nodes, ", test", 5, "middle"));
        const [firstSpan, middleText, secondSpan] = container.firstChild.childNodes;
        expect(firstSpan.textContent).toBe("Hello");
        expect(middleText.textContent).toBe(", test");
        expect(secondSpan.textContent).toBe(" world!");
    });
    
    it('handles nested structures correctly: middle 2', () => {
        const nodes = (<div>Hello<span> world!</span></div>);
        const { container } = render(insertContentByPreference(nodes, ", test", 5, "middle"));
        const [text, span] = container.firstChild.childNodes;
        expect(text.textContent).toBe("Hello, test");
        expect(span.textContent).toBe(" world!");
    });
    
    it('handles nested structures correctly: middle 3', () => {
        const nodes = (<div><span>Hello</span> world!</div>);
        const { container } = render(insertContentByPreference(nodes, ", test", 5, "middle"));
        const [span, text] = container.firstChild.childNodes;
        expect(span.textContent).toBe("Hello");
        expect(text.textContent).toBe(", test world!");
    });
    
    it('handles nested structures correctly: middle 4', () => {
        const nodes = (<span>Hello</span>);
        const { container } = render(insertContentByPreference(nodes, ", test", 5, "middle"));
        const [firstSpan, middleText] = container.childNodes;
        expect(firstSpan.textContent).toBe("Hello");
        expect(middleText.textContent).toBe(", test");
    });

    it('handles nested structures correctly: middle 5: inserting react elements', () => {
        const nodes = (<span>Hello</span>);
        const insertingNodes = (<span> world!</span>);
        const { container } = render(insertContentByPreference(nodes, insertingNodes, 5, "middle"));
        const [firstSpan, secondSpan] = container.childNodes;
        expect(firstSpan.textContent).toBe("Hello");
        expect(secondSpan.textContent).toBe(" world!");
    });

    it('handles nested structures correctly: rightMost', () => {
        const nodes = (<div><span>Hello</span><span> world!</span></div>);
        const { container } = render(insertContentByPreference(nodes, ", test", 5, "rightMost"));
        const [firstSpan, secondSpan] = container.getElementsByTagName('span');
        expect(container.getElementsByTagName('span').length).toBe(2);
        expect(firstSpan.textContent).toBe("Hello");
        expect(secondSpan.textContent).toBe(", test world!");
    });

    it('handles nested structures correctly: rightMost edge case', () => {
        const nodes = (<div><span>Hello</span></div>);
        const { container } = render(insertContentByPreference(nodes, ", test", 5, "rightMost"));
        const [span] = container.getElementsByTagName('span');
        expect(span.textContent).toBe("Hello, test");
    });
});

describe('removeContent', () => {
    it('removes characters between specified indexes in a simple string', () => {
        const nodes = "Hello, world!";
        const modified = removeContent(nodes, 5, 7);
        expect(modified).toBe("Helloworld!");
    });

    it('handles removal across boundaries in nested elements', () => {
        const nodes = (<div><span>Hello, </span><span>world!</span></div>);
        const { container } = render(removeContent(nodes, 3, 9));
        expect(container.textContent).toBe("Helrld!");
    });

    it('handles complete removal', () => {
        const nodes = "Hello, world!";
        const modified = removeContent(nodes, 0, 13);
        expect(modified).toBeNull();
    });
});
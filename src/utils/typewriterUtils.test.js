import { render, prettyDOM } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';
import {
    elementToJson,
    addIdsToElements,
    getAnimationList,
    iterateAnimation,
    generateLineBreaks,
    countCharacters,
    findElementAtIndex,
    insertContent,
    insertContentByPreference,
    insertContentById,
    removeContent
} from './typewriterUtils';

jest.mock('uuid', () => {
    let callCount = 0;
    return {
        v4: jest.fn(() => `mock-uuid-${callCount++}`)
    };
});

beforeEach(() => {
    jest.clearAllMocks();
    let callCount = 0;
    uuidv4.mockImplementation(() => `mock-uuid-${callCount++}`);
});

describe('addIdsToElements', () => {
    it('should add unique IDs to each element and its children', () => {
        const elements = (
            <div>
                <span>Hello</span>
                <span>World</span>
            </div>
        );

        const elementsWithIds = addIdsToElements(elements);

        const { container } = render(elementsWithIds);
        const div = container.querySelector('div');
        const spans = container.querySelectorAll('span');

        expect(div.id).toBe('mock-uuid-0');
        expect(spans[0].id).toBe('mock-uuid-1');
        expect(spans[1].id).toBe('mock-uuid-2');
    });

    it('should handle arrays of elements', () => {
        const elements = [
            <span key="1">Hello</span>,
            <span key="2">World</span>
        ];

        const elementsWithIds = addIdsToElements(elements);

        const { container } = render(<>{elementsWithIds}</>);
        const spans = container.querySelectorAll('span');

        expect(spans[0].id).toBe('mock-uuid-0');
        expect(spans[1].id).toBe('mock-uuid-1');
    });

    it('addIdsToElements: stress test', () => {
        // Creating a large complex HTML structure with many nested and sibling elements
        const complexStructure = (
            <div>
                <div>
                    <span>First level - span</span>
                    <div>Second level - div containing more spans</div>
                    <div>
                        <span>Nested span within second-level div</span>
                        {Array.from({ length: 500 }, (_, index) => (
                            <span key={index}>Span {index + 1}</span>
                        ))}
                    </div>
                </div>
                <ul>
                    {Array.from({ length: 1000 }, (_, index) => (
                        <li key={index}>List Item {index + 1}</li>
                    ))}
                </ul>
                <p>A paragraph with <b>bold</b> and <i>italic</i> elements nested within.</p>
            </div>
        );

        const elementsWithIds = addIdsToElements(complexStructure);

        const { container } = render(<>{elementsWithIds}</>);
        const allElements = container.querySelectorAll('*');

        const ids = new Set();

        for (let element of allElements) {
            expect(element.id).toMatch(/mock-uuid-\d+/);
            ids.add(element.id);
        }

        expect(ids.size).toBe(allElements.length);
    });
});

describe('iterateAnimation', () => {
    const animationToJson = (list) => list.map((el) => ({
        ...el,
        element: elementToJson(el.element)
    }));

    it('should handle nested React elements correctly', () => {
        const elements = addIdsToElements(
            <div>
                <span>
                    kek
                </span>
                lol
            </div>
        );

        const expectedOutput = [
            {
                index: 0,
                element: (
                    <div id="mock-uuid-0">
                        <span id="mock-uuid-1">k</span>
                    </div>
                ),
                parentId: undefined
            },
            {
                index: 1,
                element: 'e',
                parentId: "mock-uuid-1"
            },
            {
                index: 2,
                element: 'k',
                parentId: "mock-uuid-1"
            },
            {
                index: 3,
                element: 'l',
                parentId: "mock-uuid-0"
            },
            {
                index: 4,
                element: 'o',
                parentId: "mock-uuid-0"
            },
            {
                index: 5,
                element: 'l',
                parentId: "mock-uuid-0"
            },
        ];

        const result = getAnimationList(elements);
        expect(animationToJson(result)).toMatchObject(animationToJson(expectedOutput));
    });

    it('should handle single string element', () => {
        const elements = 'hello';
        const expectedOutput = [
            {
                index: 0,
                element: 'h',
                parentId: undefined
            },
            {
                index: 1,
                element: 'e',
                parentId: undefined
            },
            {
                index: 2,
                element: 'l',
                parentId: undefined
            },
            {
                index: 3,
                element: 'l',
                parentId: undefined
            },
            {
                index: 4,
                element: 'o',
                parentId: undefined
            }
        ];

        const result = getAnimationList(elements);
        expect(animationToJson(result)).toEqual(animationToJson(expectedOutput));
    });

    it('should handle empty element', () => {
        const elements = null;
        const expectedOutput = [];

        const result = getAnimationList(elements);
        expect(result).toEqual(expectedOutput);
    });

    it('should handle deeply nested React elements', () => {
        const elements = addIdsToElements(
            <div>
                <div>
                    <span>
                        abc
                    </span>
                    xyz
                </div>
                123
            </div>
        );

        const expectedOutput = [
            {
                index: 0,
                element: (
                    <div id="mock-uuid-0">
                        <div id="mock-uuid-1">
                            <span id="mock-uuid-2">a</span>
                        </div>
                    </div>
                ),
                parentId: undefined
            },
            {
                index: 1,
                element: 'b',
                parentId: "mock-uuid-2"
            },
            {
                index: 2,
                element: 'c',
                parentId: "mock-uuid-2"
            },
            {
                index: 3,
                element: 'x',
                parentId: "mock-uuid-1"
            },
            {
                index: 4,
                element: 'y',
                parentId: "mock-uuid-1"
            },
            {
                index: 5,
                element: 'z',
                parentId: "mock-uuid-1"
            },
            {
                index: 6,
                element: '1',
                parentId: "mock-uuid-0"
            },
            {
                index: 7,
                element: '2',
                parentId: "mock-uuid-0"
            },
            {
                index: 8,
                element: '3',
                parentId: "mock-uuid-0"
            }
        ];

        const result = getAnimationList(elements);
        expect(animationToJson(result)).toEqual(animationToJson(expectedOutput));
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

    test('countCharacters: stress test', () => {
        const complexStructure = addIdsToElements(
            <div>
                <ul>
                    {Array.from({ length: 10000 }, (_, i) => (
                        <li key={i}>0123456789</li>
                    ))}
                </ul>
            </div>
        );

        const counter = countCharacters(complexStructure);
        expect(counter).toEqual(10000 * 10);
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

    it('handles nested structures correctly: leftMost', () => {
        const nodes = addIdsToElements(<div><span>Hello</span><span> world!</span></div>);
        const { container } = render(insertContentByPreference(nodes, ", test", 5, "leftMost"));
        const [firstSpan, secondSpan] = container.getElementsByTagName('span');
        expect(container.getElementsByTagName('span').length).toBe(2);
        expect(firstSpan.textContent).toBe("Hello, test");
        expect(secondSpan.textContent).toBe(" world!");
    });

    it('handles nested structures correctly: leftMost edge case', () => {
        const nodes = addIdsToElements(<div><span>Hello</span></div>);
        const { container } = render(insertContentByPreference(nodes, ", test", 0, "leftMost"));
        const [span] = container.getElementsByTagName('span');
        expect(span.textContent).toBe(", testHello");
    });

    it('handles nested structures correctly: middle 1', () => {
        const nodes = addIdsToElements(<div><span>Hello</span><span> world!</span></div>);
        const { container } = render(insertContentByPreference(nodes, ", test", 5, "outerMost"));
        const [firstSpan, middleText, secondSpan] = container.firstChild.childNodes;
        expect(firstSpan.textContent).toBe("Hello");
        expect(middleText.textContent).toBe(", test");
        expect(secondSpan.textContent).toBe(" world!");
    });

    it('handles nested structures correctly: middle 2', () => {
        const nodes = addIdsToElements(<div>Hello<span> world!</span></div>);
        const { container } = render(insertContentByPreference(nodes, ", test", 5, "outerMost"));
        const [text, span] = container.firstChild.childNodes;
        expect(text.textContent).toBe("Hello, test");
        expect(span.textContent).toBe(" world!");
    });

    it('handles nested structures correctly: middle 3', () => {
        const nodes = addIdsToElements(<div><span>Hello</span> world!</div>);
        const { container } = render(insertContentByPreference(nodes, ", test", 5, "outerMost"));
        const [span, text] = container.firstChild.childNodes;
        expect(span.textContent).toBe("Hello");
        expect(text.textContent).toBe(", test world!");
    });

    it('handles nested structures correctly: middle 4', () => {
        const nodes = addIdsToElements(<span>Hello</span>);
        const { container } = render(insertContentByPreference(nodes, ", test", 5, "outerMost"));
        const [firstSpan, middleText] = container.childNodes;
        expect(firstSpan.textContent).toBe("Hello");
        expect(middleText.textContent).toBe(", test");
    });

    it('handles nested structures correctly: middle 5: inserting react elements', () => {
        const nodes = addIdsToElements(<span>Hello</span>);
        const insertingNodes = addIdsToElements(<span> world!</span>);
        const { container } = render(insertContentByPreference(nodes, insertingNodes, 5, "outerMost"));
        const [firstSpan, secondSpan] = container.childNodes;
        expect(firstSpan.textContent).toBe("Hello");
        expect(secondSpan.textContent).toBe(" world!");
    });

    it('handles nested structures correctly: rightMost', () => {
        const nodes = addIdsToElements(<div><span>Hello</span><span> world!</span></div>);
        const { container } = render(insertContentByPreference(nodes, ", test", 5, "rightMost"));
        const [firstSpan, secondSpan] = container.getElementsByTagName('span');
        expect(container.getElementsByTagName('span').length).toBe(2);
        expect(firstSpan.textContent).toBe("Hello");
        expect(secondSpan.textContent).toBe(", test world!");
    });

    it('handles nested structures correctly: rightMost edge case', () => {
        const nodes = addIdsToElements(<div><span>Hello</span></div>);
        const { container } = render(insertContentByPreference(nodes, ", test", 5, "rightMost"));
        const [span] = container.getElementsByTagName('span');
        expect(span.textContent).toBe("Hello, test");
    });

    it('insertContentByPreference: stress test', () => {
        const complexStructure = addIdsToElements(
            <div>
                <p>This is a paragraph with some text, and more text follows.</p>
                <div>
                    <span>Nested span element</span>
                    <p>Another paragraph</p>
                </div>
                <ul>
                    {Array.from({ length: 10000 }, (_, i) => (
                        <li key={i}>Item {i + 1} in a very long list to increase complexity and text length</li>
                    ))}
                </ul>
            </div>
        );

        const modifiedStructure = insertContentByPreference(complexStructure, 'X', 5000, 'leftMost'); // Assuming the 500th position is the target
        expect(modifiedStructure).not.toBeNull();
    });
});

describe('insertContentById', () => {
    it('should insert content into a string when input is a string and id is null', () => {
        const element = "Hello World";
        const updatedElement = insertContentById(element, null, ' Inserted', 5);
        expect(updatedElement).toBe('Hello Inserted World');
    });

    it('should insert content at the first text index when ID is null', () => {
        const elements = addIdsToElements(
            <div>
                <span>Hello</span>
                <span>World</span>
            </div>
        );

        const updatedElements = insertContentById(elements, null, ' Inserted', 5);

        const { container } = render(updatedElements);
        const spans = container.querySelectorAll('span');

        expect(spans[0].textContent).toBe('Hello Inserted');
        expect(spans[1].textContent).toBe('World');
    });

    it('should insert content at the specified text index within the element with the given ID', () => {
        const elements = addIdsToElements(
            <div>
                <span>Hello</span>
            </div>
        );

        const updatedElements = insertContentById(elements, 'mock-uuid-1', ' Inserted', 5);

        const { container } = render(updatedElements);
        const span = container.querySelector('span');

        expect(span.textContent).toBe('Hello Inserted');
    });

    it('should not modify elements with different IDs', () => {
        const elements = addIdsToElements(
            <div>
                <span>Hello</span>
                <span> World</span>
            </div>
        );

        const updatedElements = insertContentById(elements, 'mock-uuid-2', ' Inserted', 11);
        const { container } = render(updatedElements);
        const spans = container.querySelectorAll('span');

        expect(spans[0].textContent).toBe('Hello');
        expect(spans[1].textContent).toBe(' World Inserted');
    });

    it('should handle nested elements', () => {
        const elements = addIdsToElements(
            <div>
                <span>Hello <b>World</b></span>
            </div>
        );

        const updatedElements = insertContentById(elements, 'mock-uuid-1', ' Inserted', 5);

        const { container } = render(updatedElements);
        const span = container.querySelector('span');

        expect(span.textContent).toBe('Hello Inserted World');
    });

    it('insertContentById: stress test', () => {
        const complexStructure = addIdsToElements(
            <div>
                <div>
                    <span>First level - span</span>
                    <div>Second level - div</div>
                    <span> on span</span>
                </div>
                <ul>
                    {Array.from({ length: 1000 }, (_, i) => (
                        <li key={i}>Item {i + 1}</li>
                    ))}
                </ul>
                <p>Another paragraph here with more content to increase complexity.</p>
            </div>
        );

        const specificId = 'mock-uuid-4';
        const insertPosition = 36;

        const modifiedStructure = insertContentById(complexStructure, specificId, 'Inserted content here', insertPosition);

        const { container } = render(modifiedStructure);

        const elementWithInsertedContent = container.querySelector(`#${specificId}`);

        expect(elementWithInsertedContent.textContent).toEqual('Inserted content here on span');
    });
});

describe('removeContent', () => {
    it('removes characters between specified indexes in a simple string', () => {
        const nodes = "Hello, world!";
        const modified = removeContent(nodes, 5, 7);
        expect(modified).toBe("Helloworld!");
    });

    it('handles removal across boundaries in nested elements', () => {
        const nodes = addIdsToElements(<div><span>Hello, </span><span>world!</span></div>);
        const { container } = render(removeContent(nodes, 3, 9));
        expect(container.textContent).toBe("Helrld!");
    });

    it('handles complete removal', () => {
        const nodes = "Hello, world!";
        const modified = removeContent(nodes, 0, 13);
        expect(modified).toBeNull();
    });

    it('removeContent: stress test', () => {
        const complexStructure = addIdsToElements(
            <div>
                <p>This is a paragraph with some text, and more text follows.</p>
                <div>
                    <span>Nested span element</span>
                    <p>Another paragraph</p>
                </div>
                <ul>
                    {Array.from({ length: 10000 }, (_, i) => (
                        <li key={i}>Item {i + 1} in a very long list to increase complexity and text length</li>
                    ))}
                </ul>
            </div>
        );

        const modifiedStructure = removeContent(complexStructure, 500, 1000);
        expect(modifiedStructure).not.toBeNull();
    });

    it('removeContent: stress test 2', () => {
        const complexStructure = addIdsToElements(
            <div>
                <p>This is a paragraph with some text, and more text follows.</p>
                <div>
                    <span>Nested span element</span>
                    <p>Another paragraph</p>
                </div>
                <ul>
                    {Array.from({ length: 10000 }, (_, i) => (
                        <li key={i}>Item {i + 1} in a very long list to increase complexity and text length</li>
                    ))}
                </ul>
            </div>
        );

        const modifiedStructure = removeContent(complexStructure, 5);
        expect(modifiedStructure).not.toBeNull();
    });
});
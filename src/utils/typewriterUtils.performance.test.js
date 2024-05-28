// import { render, prettyDOM } from '@testing-library/react';
// import {
//     insertContentByPreference,
//     removeContent
// } from './typewriterUtils';

// describe('Performance comparison between insertContentByPreference and removeContent', () => {
//   // Define a complex React node structure
//   const complexStructure = (
//     <div>
//       <p>This is a paragraph with some text, and more text follows.</p>
//       <div>
//         <span>Nested span element</span>
//         <p>Another paragraph</p>
//       </div>
//       <ul>
//         {Array.from({ length: 10000 }, (_, i) => (
//           <li key={i}>Item {i + 1} in a very long list to increase complexity and text length</li>
//         ))}
//       </ul>
//     </div>
//   );

//   // Test to add a single character
//   test('insertContentByPreference should correctly add a character', () => {
//     const start = performance.now();
//     const modifiedStructure = insertContentByPreference(complexStructure, 'X', 5000, 'leftMost'); // Assuming the 500th position is the target
//     const duration = performance.now() - start;
//     console.log('insertContentByPreference Duration:', duration);
//     expect(modifiedStructure).not.toBeNull();
//     // Additional checks to verify that 'X' has been added could be implemented here
//   });

//   // Test to remove multiple characters
//   test('removeContent should correctly remove characters', () => {
//     const start = performance.now();
//     const modifiedStructure = removeContent(complexStructure, 100); // Removing characters from index 100 to 200
//     const duration = performance.now() - start;
//     console.log('removeContent Duration:', duration);
//     expect(modifiedStructure).not.toBeNull();
//     // Additional checks to verify that characters have been removed could be implemented here
//   });
// });

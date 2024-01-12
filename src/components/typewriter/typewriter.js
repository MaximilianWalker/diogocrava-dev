import { forwardRef, useState } from 'react';
import './typewriter.css';

const ACTIONS = [
    'type',
    'delete',
];

export default forwardRef(({
    children,
    showCursor,
    cursorCharacter,

}, ref) => {
    const [queue, setQueue] = useState([]);
    const [instantQueue, setInstantQueue] = useState([]);
    const [options, setOptions] = useState({

    });
    const [play, setPlay] = useState(false);
    // const [repeat, setRepeat] = useState(false);

    const addToQueue = (e) => setQueue([...queue, e]);

    const start = () => setPlay(true);

    const stop = () => setPlay(false);

    return (

    );
});

// posso aceitar children e depois manipular os filhos
// problema: passar refs a esses mesmos filhos e detectar alterações vai ser complicado
// aceitar html e fazer eu a transformação
// aceitar texto normal

// Example on how to manipulate children in React

function manipulateChildren(children) {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        // If the child is a React element, clone it with modified props or content
        return React.cloneElement(child, {
          children: manipulateChildren(child.props.children), // Recursively process children
        });
      } else if (typeof child === 'string') {
        // If the child is a string, manipulate its content
        return child.replace(/your-regexp-pattern/g, 'new-text');
      } else {
        return child;
      }
    });
  }
  
  function YourComponent({ children }) {
    const manipulatedChildren = manipulateChildren(children);
  
    return <div>{manipulatedChildren}</div>;
  }
  
//   export default YourComponent;
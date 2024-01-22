import { createElement, forwardRef, useState } from 'react';
import './typewriter.css';

const ACTIONS = [
	'type',
	'delete',
];

const Item = ({ type, children }) => createElement(
	type,
	{}, // props
	children.map(child => createElement(Item, child))
);

export default forwardRef(({
	component,
	children,
	showCursor,
	cursorCharacter,

}, ref) => {
	const [queue, setQueue] = useState([]);
	const [queueIndex, setQueueIndex] = useState(0);

	const [instantQueue, setInstantQueue] = useState([]);
	const [instantQueueIndex, setInstantQueueIndex] = useState(0);

	const [options, setOptions] = useState({

	});

	const [play, setPlay] = useState(false);
	const [iteration, setIteration] = useState(0);

	// const [repeat, setRepeat] = useState(false);

	const addToQueue = (action) => setQueue([...queue, action]);

	const start = () => setPlay(true);

	const stop = () => setPlay(false);

	const type = (text, options) => addToQueue({
		action: 'type',
		value: text
	});

	const newLine = (text, options) => addToQueue({
		action: 'type',
		value: text
	});

	const move = (delta, options) => addToQueue({
		action: 'move',
		value: delta
	});

	const remove = (n, options) => addToQueue({
		action: 'delete',
		value: n
	});

	const pause = (time) => {
		stop();
		setTimeout(start, time);
	};

	// pensar em como fazer o cursor
	return <Item type={component} />;
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
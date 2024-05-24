import { useState, forwardRef, isValidElement, cloneElement, Children, Fragment } from 'react';
import PropTypes from 'prop-types';
import './typewriter.css';

const ACTIONS = [
	'type',
	'move',
	'delete',
	
];

const Typewriter = forwardRef(({
	component: Component = Fragment,
	children,
	play = true,
	showCursor = true,
	cursorCharacter = '|',
	blinkingSpeed = 500,
	instant = false,
	typingSpeed = 50,
	deleteSpeed = 50
}, ref) => {
	const [content, setContent] = useState([]);
	const [cursorIndex, setCursorIndex] = useState(0);

	useEffect(() => {
		const chars = [];
		const extractText = (child) => {
			if (typeof child === 'string') {
				return [...child];
			} else if (isValidElement(child) && child.props.children) {
				const nestedChars = Children.toArray(child.props.children).flatMap(extractText);
				return cloneElement(child, { ...child.props, key: chars.length }, nestedChars);
			}
			return child;
		};

		Children.forEach(children, child => {
			chars.push(...extractText(child));
		});

		let index = 0;
		const interval = setInterval(() => {
			setContent(current => [...current, chars[index]]);
			index++;
			if (index === chars.length) {
				clearInterval(interval);
				setCursorVisible(false); // Optionally hide cursor at end
			}
		}, typingSpeed);

		return () => clearInterval(interval);
	}, [children, typingSpeed, setCursorVisible]);

	useEffect(() => {
		let index = 0;
		const interval = setInterval(() => {
			setContent(current => [...current, chars[index]]);
			index++;
			if (index === chars.length) {
				clearInterval(interval);
				setCursorVisible(false); // Optionally hide cursor at end
			}
		}, typingSpeed);

		return () => clearInterval(interval);
	}, [children, typingSpeed, setCursorVisible]);

	return (
		<Component>
			{
				content.slice(0, cursorIndex).map((node, index) => (
					typeof node === 'string' ? <span key={index}>{node}</span> : node
				))
			}
			{showCursor && <span className="typewriter__cursor">{cursorCharacter}</span>}
			{
				content.slice(cursorIndex).map((node, index) => (
					typeof node === 'string' ? <span key={index}>{node}</span> : node
				))
			}
		</Component>
	);
});

export default Typewriter;
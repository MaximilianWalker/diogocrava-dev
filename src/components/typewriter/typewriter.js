import { useState, useRef, useMemo, useImperativeHandle, forwardRef, isValidElement, cloneElement, Children } from 'react';
import PropTypes from 'prop-types';
import './typewriter.css';

const instruction = {
	action: 'type',
	value: 'hello',
	options: {
		speed: 50
	},
	remove: true
}

const ACTIONS = {
	TYPE: 'type',
	DELETE: 'delete'
};

const Typewriter = forwardRef(({
	events,
	component: Component = 'div',
	showCursor,
	cursorCharacter,
	...props
}, ref) => {
	const intervalRef = useRef();

	const [play, setPlay] = useState(true);

	const [eventQueue, setEventQueue] = useState(events ?? []);
	const [queueIndex, setQueueIndex] = useState(0);
	const currentEvent = useMemo(() => queue[queueIndex], [queue, queueIndex]);
	const eventNodes = useMemo(() => getEventNodes(currentEvent.content), [currentEvent]);
	const [nodeIndex, setNodeIndex] = useState(0);

	const [options, setOptions] = useState({

	});

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

	const changeOptions = (options) => setOptions(options);

	const getEventNodes = (nodes) => {
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

		const nodes = [];
		Children.forEach(nodes, (child) => {
			if (typeof child === 'string') {
				return [...child];
			} else if (isValidElement(child) && child.props.children) {
				const nestedNodes = getEventNodes(child.props.children);
				return cloneElement(child, { ...child.props, key: chars.length }, nestedNodes);
			}
			return child;
		});
		return nodes;
	};

	const onAnimation = () => {
		switch (currentEvent.type) {
			case 'type':
				setContent(current => [...current, eventNodes[nodeIndex]]);
				if (nodeIndex === eventNodes.length)
					setQueueIndex(prevIndex => ++prevIndex);
				break;
			case 'delete':
				setContent(current => [...current, eventNodes[nodeIndex]]);
				if (nodeIndex === eventNodes.length)
					setQueueIndex(prevIndex => ++prevIndex);
				break;
			case 'pause':
				setContent(current => [...current, eventNodes[nodeIndex]]);
				if (nodeIndex === eventNodes.length)
					setQueueIndex(prevIndex => ++prevIndex);
				break;
		}
	};

	useImperativeHandle(ref, () => ({
		start,
		stop,
		type,
		newLine,
		move,
		remove,
		pause,
		changeOptions
	}));

	useEffect(() => {
		if (play)
			onAnimation();
		else
			clearInterval(intervalRef.current);
		return () => clearInterval(intervalRef.current);
	}, [play]);

	return (
		<Component {...props}>
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

Typewriter.propTypes = {

};

export default Typewriter;
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
	const currentEvent = useMemo(() => queue[queueIndex], [eventQueue, queueIndex]);
	const [eventIndex, setEventIndex] = useState(0);

	const nodes = useMemo(() => getEventNodes(currentEvent.content), [currentEvent]);

	// const [options, setOptions] = useState({

	// });

	// const [iteration, setIteration] = useState(0);

	// const [repeat, setRepeat] = useState(false);

	const addToQueue = (action) => setQueue([...queue, action]);

	const start = () => setPlay(true);

	const stop = () => setPlay(false);

	const type = (text, options) => addToQueue({
		action: 'type',
		value: text
	});

	const onType = () => {
		setContent(current => [
			...current.slice(0, nodeIndex),
			eventNodes[nodeIndex],
			...current.slice(nodeIndex)
		]);

		if (nodeIndex < eventNodes.length - 1) {
			setNodeIndex(nodeIndex => ++nodeIndex);
		} else {
			setNodeIndex(0);
			setEventQueue(prevIndex => ++prevIndex);
		}
	};

	const move = (delta, options) => addToQueue({
		action: 'move',
		value: delta
	});

	const onMove = () => {
		setNodeIndex(prevIndex => prevIndex + currentEvent.value);
	};

	const remove = (n, options) => addToQueue({
		action: 'delete',
		value: n
	});

	const pause = (time) => {
		stop();
		setTimeout(start, time);
	};

	const onPause = () => {
		if (currentEvent.value)
			setTimeout(onAnimation, currentEvent.value);
		else
			setPlay(false);
	};

	const loop = () => {
		setNodeIndex(currentEvent.value ?? 0);
		setEventQueue(currentEvent.value ?? 0);
	};

	const changeOptions = (options) => setOptions(options);

	// desenhar o flow de animação
	const onAnimation = () => {
		if (play) {
			let animationFunction;
			let animationSpeed;
			switch (currentEvent.type) {
				case 'type':
					animationFunction = onType;
					animationSpeed = currentEvent.options.speed;
					break;
				case 'move':
					animationFunction = onMove;
					animationSpeed = currentEvent.value;
					break;
				case 'delete':
					animationFunction = onPause;
					animationSpeed = currentEvent.value;
					break;
				case 'pause':
					animationFunction = onPause;
					animationSpeed = currentEvent.value;
					break;
				case 'loop':
					animationFunction = onPause;
					animationSpeed = currentEvent.value;
					break;
			}
			intervalRef.current = setInterval(animationFunction, animationSpeed);
		}
	};

	useImperativeHandle(ref, () => ({
		start,
		stop,
		type,
		move,
		remove,
		pause,
		changeOptions
	}));

	useEffect(() => {
		if (play)
			onAnimation();
		else {}
			clearInterval(intervalRef.current);
		return () => clearInterval(intervalRef.current);
	}, [play, currentEvent, nodeIndex]);

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
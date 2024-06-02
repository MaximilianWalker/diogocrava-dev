import { useState, useRef, useMemo, useImperativeHandle, forwardRef, isValidElement, cloneElement, Children, useEffect } from 'react';
import PropTypes from 'prop-types';
import './typewriter.css';
import { addIdsToElements, countCharacters, processEvent } from '@/utils/typewriterUtils';

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
	play = true,
	events: eventsProp,
	component: Component = 'div',
	showCursor,
	cursorCharacter,
	...props
}, ref) => {
	const intervalRef = useRef();
	const eventIteratorRef = useRef();

	const cursor = useMemo(() => (
		<span id="cursor" key="cursor" className="typewriter__cursor">
			{cursorCharacter}
		</span>
	), [cursorCharacter]);

	// const [play, setPlay] = useState(true);
	const [elements, setElements] = useState([cursor]);

	const [events, setEvents] = useState(events ?? []);
	const [eventsIndex, setEventsIndex] = useState(0);
	const currentEvent = useMemo(() => queue[eventsIndex], [events, eventsIndex]);
	// const [eventIndex, setEventIndex] = useState(0);
	// const eventElements = useMemo(() => getEventNodes(currentEvent.content), [currentEvent]);

	// const [options, setOptions] = useState({

	// });

	// const [iteration, setIteration] = useState(0);

	// const [repeat, setRepeat] = useState(false);

	const addEvent = (event) => setEvents(prevEvents => [
		...prevEvents,
		processEvent(event)
	]);

	const addImmediateEvent = (event) => {
		
		setEvents(prevEvents => {
			const newEvents = [...prevEvents];
			newEvents.splice(eventsIndex, event);
		});
	};

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

	const onMove = () => {
		setNodeIndex(prevIndex => prevIndex + currentEvent.value);
	};

	const onPause = () => {
		if (currentEvent.value)
			setTimeout(onAnimation, currentEvent.value);
		else
			setPlay(false);
	};

	const onLoop = () => {
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

	useEffect(() => {
		if (play)
			onAnimation();
		else { }
		clearInterval(intervalRef.current);
		return () => clearInterval(intervalRef.current);
	}, [play, currentEvent, nodeIndex]);

	useEffect(() => {
		
	}, [currentEvent]);

	return (
		<Component {...props}>
			{elements}
		</Component>
	);
});

Typewriter.propTypes = {

};

export default Typewriter;
import { useState } from 'react';
import Window from '../system/common/window';
import AnimatedIDE from '../system/windows/animated-ide';
import './technologies.css';

const Technologies = ({ children, ...props }) => {
    const [technologies, setTechnologies] = useState();
    const [selectedTechnology, setSelectedTechnology] = useState();
    const [codeSnippet, setCodeSnippet] = useState('');

    return (
        <div className="technologies__container">
            <Window
                className="frontend-window"
                id="frontend-window"
                name="Frontend"
                defaultOpen
                draggable
                resizable
            >
            </Window>
            <Window
                className="backend-window"
                id="backend-window"
                name="Backend"
                defaultOpen
                draggable
                resizable
            >
            </Window>
            <Window
                className="databases-window"
                id="databases-window"
                name="Databases"
                defaultOpen
                draggable
                resizable
            >
            </Window>

            <AnimatedIDE 
                className="ide-window"
                defaultOpen
                draggable
                resizable
            />
        </div>
    );
};

export default Technologies;
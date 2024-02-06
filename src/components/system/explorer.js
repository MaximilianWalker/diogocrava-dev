// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef, useMemo } from "react";
import { Home, ChevronLeft, ChevronRight } from 'react-feather';
import usePrevious from '@/hooks/usePrevious';
import Window from './window';
import FileViewer from './file-viewer';
import './explorer.css';

const fileExample = {
    type: 'file',
    name: 'cv.txt',
    icon: '',
    access: false
}

const folderExample = {
    type: 'file',
    name: 'Home',
    icon: '',
    access: false,
    children: []
}

const mimeTypeToIcon = {
    'text/plain': '', // replace empty string with actual icon representation for text/plain
    'text/html': '', // replace with icon for text/html
    'image/jpeg': '', // replace with icon for image/jpeg
    'image/png': '', // replace with icon for image/png
    // ... add more mappings as needed
};

const Explorer = forwardRef(({
    className,
    rootDirectory,
    draggable,
    resizable,
    props
}, ref) => {
    const [currentDirectory, setCurrentDirectory] = useState(rootDirectory);
    const [selectedItems, setSelectedItems] = useState([]);
    const [history, setHistory] = useState([currentDirectory]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const itemsRefs = useMemo(() => currentDirectory?.children.map(() => useRef()), [currentDirectory]);

    const [openFiles, setOpenFiles] = useState([]);

    const onItemClick = (item) => setSelectedChild([]);

    const onItemDoubleClick = (item) => item.type === 'folder' ? onFolderClick(item) : onFileClick(item);

    const onFolderClick = (folder) => {
        setCurrentDirectory(folder);
        history.splice(0, historyIndex);
        const newHistory = [folder, ...history];
        setHistory(newHistory);
        setHistoryIndex(0);
    };

    const onFileClick = () => {

    };

    const onHomeClick = () => {

    }

    const onBackClick = () => {

    }

    const onForwardClick = () => {

    }

    useEffect(() => {

    }, [currentDirectory]);

    // meter seta para a direita no fim do path para poderem navegar para o novo endereço com o rato
    // meter o icon do folder icon no inicio do path
    // meter icon de pesquisa
    // meter os paddings correctos
    return (
        <>
            <Window
                ref={ref}
                className={`explorer ${className}`}
                name=">_ Explorer"
                draggable={draggable}
                resizable={resizable}
                {...props}
            >
                <div className="explorer__topbar">
                    <button onClick={onHomeClick}>
                        <Home />
                    </button>
                    <button onClick={onBackClick}>
                        <ChevronLeft />
                    </button>
                    <button
                        disabled={historyIndex === 0}
                        onClick={onForwardClick}
                    >
                        <ChevronRight />
                    </button>
                    <input className="explorer__path" type="text" />
                    <input className="explorer__search" type="text" />
                </div>
                <div style={{ display: 'flex' }}>
                    <div className="explorer__sidebar">

                    </div>
                    <div className="explorer__content">
                        {
                            currentDirectory?.children.map((child, index) => (
                                <div
                                    key={index}
                                    ref={itemsRefs[index]}
                                    className="explorer__item"
                                    onClick={() => onSelect(child)}
                                    onDoubleClick={() => onOpen(child)}
                                >
                                    {
                                        child.icon ?
                                            <child.icon />
                                            :
                                            child.type === 'folder' ?
                                                <folder />
                                                :
                                                <file />
                                    }
                                    <span>{child.name}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </Window>
            {
                openFiles.map((file) => (
                    <FileViewer name={file.name} />
                ))
            }
        </>
    );
});



export default Explorer;
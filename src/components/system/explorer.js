// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef, useMemo } from "react";
import { Home, ChevronLeft, ChevronRight, Folder, Search, RefreshCcw } from 'react-feather';
import usePrevious from '@/hooks/usePrevious';
import Window from './window';
import FileViewer from './file-viewer';
import './explorer.css';
import Input from "./input";

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
    // substituir o topo das windows por icons em vez de ">_"
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
                    <div className="explorer__button-group">
                        <button
                            className="window__icon-button"
                            onClick={onHomeClick}
                        >
                            <Home />
                        </button>
                        <button
                            className="window__icon-button"
                            onClick={onBackClick}
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            className="window__icon-button"
                            disabled={historyIndex === 0}
                            onClick={onForwardClick}
                        >
                            <ChevronRight />
                        </button>
                        <button
                            className="window__icon-button"
                            disabled={historyIndex === 0}
                            onClick={onForwardClick}
                        >
                            <RefreshCcw />
                        </button>
                    </div>
                    <Input
                        className="explorer__path"
                        startIcon={Folder}
                    />
                    <Input
                        className="explorer__search"
                        startIcon={Search}
                    />
                </div>
                <div className="explorer__container">
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
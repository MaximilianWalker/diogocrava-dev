// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef, useMemo } from "react";
import { Home, ChevronLeft, ChevronRight, Folder, Search, RefreshCcw } from 'react-feather';
import usePrevious from '@/hooks/usePrevious';
import Window from '../common/window';
import FileViewer from './file-viewer';
import Input from "../common/input";
import Loading from "@/components/type-it/loading";
import { getIconByName, getIconByMimetype } from '@/utils/iconUtils';
import './explorer.css';

// const fileExample = {
//     type: 'file',
//     name: 'cv.txt',
//     icon: '',
//     access: false
// }

// const folderExample = {
//     type: 'file',
//     name: 'Home',
//     icon: '',
//     access: false,
//     children: []
// }

const Explorer = forwardRef(({
    className,
    // rootDirectory,
    draggable,
    resizable,
    ...props
}, ref) => {
    // System Data
    const [sections, setSections] = useState();
    const [system, setSystem] = useState();

    // Control
    const [loading, setLoading] = useState(false);
    const [currentDirectory, setCurrentDirectory] = useState();
    const [selectedItems, setSelectedItems] = useState([]);

    // Inputs
    const [path, setPath] = useState('/');
    const [search, setSearch] = useState('');

    // History
    const [history, setHistory] = useState(['/']);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Windows
    const [openFiles, setOpenFiles] = useState([]);

    const itemsRefs = useRef({});

    const getSystemData = async () => {
        const response = await fetch('/api/system/directories');
        const result = await response.json();
        setSystem(result);
        setCurrentDirectory(result);
    };

    const changeDirectory = () => {
        const directories = path.split('/');
        let currentDirectory = system;
        for (const directory of directories) {
            const subDirectory = currentDirectory.children.find((child) => child.name === directory);
            if (subDirectory)
                currentDirectory = subDirectory;
            else
                throwErrorWindow('Directory not found!');
        }
    };

    const onItemClick = (e, index) => {
        e.stopPropagation();
        setSelectedItems([index]);
    };

    const onItemDoubleClick = (item) => item.type === 'folder' ? onFolderClick(item) : onFileClick(item);

    const removeSelectedItems = (e) => {
        setSelectedItems([]);
    };

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

    };

    const onBackClick = () => {

    };

    const onForwardClick = () => {

    };

    const throwErrorWindow = (error) => {

    };

    useEffect(() => {
        getSystemData();
    }, []);

    console.log(selectedItems)

    // meter seta para a direita no fim do path para poderem navegar para o novo endereço com o rato
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
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') changeDirectory(path);
                        }}
                    />
                    <Input
                        className="explorer__search"
                        startIcon={Search}
                    />
                </div>
                <div className="explorer__container">
                    <div className="explorer__sidebar">

                    </div>
                    <div
                        className="explorer__content"
                        onClick={(e) => removeSelectedItems(e)}
                    >
                        {
                            currentDirectory ?
                                currentDirectory.map((child, index) => {
                                    const Icon = (
                                        child.icon ?
                                            getIconByName(child.icon) :
                                            child.type === 'file' ?
                                                getIconByMimetype(child.mimetype) :
                                                getIconByName('DarkFolder')
                                    );
                                    return (
                                        <div
                                            key={index}
                                            ref={(ref) => itemsRefs.current[index] = ref}
                                            className="explorer__item"
                                            data-selected={selectedItems.includes(index)}
                                            onClick={(e) => onItemClick(e, index)}
                                            onDoubleClick={() => onOpen(child)}
                                        >
                                            <Icon />
                                            <span>{child.name}</span>
                                        </div>
                                    );
                                })
                                :
                                <Loading />
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
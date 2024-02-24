// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef, useMemo } from "react";
import { Home, ChevronLeft, ChevronRight, Folder, Search, RefreshCcw } from 'react-feather';
import usePrevious from '@/hooks/usePrevious';
import Window from '../common/window';
import { default as ErrorWindow } from './error';
import FileViewer from './file-viewer';
import Input from "../common/input";
import Loading from "@/components/type-it/loading";
import { getIconByName, getIconByMimetype } from '@/utils/iconUtils';
import { DarkFileManager } from "@/icons/system";
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
    const defaultPath = '/home/diogo';

    // System Data
    const [sections, setSections] = useState();
    const [system, setSystem] = useState();

    // Control
    const [loading, setLoading] = useState(false);
    const [currentDirectory, setCurrentDirectory] = useState();
    const [selectedItems, setSelectedItems] = useState([]);

    // Inputs
    const [path, setPath] = useState(defaultPath);
    const [search, setSearch] = useState('');

    // History
    const [history, setHistory] = useState([defaultPath]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Windows
    const [openFiles, setOpenFiles] = useState([]);
    const [errors, setErrors] = useState([]);

    const itemsRefs = useRef({});

    const getSystemData = async () => {
        const response = await fetch('/api/system/directories');
        const result = await response.json();
        setSystem(result);
        setCurrentDirectory(result);
    };

    const getDirectory = (path) => {
        if (path === '/') return system;

        const directories = path.substring(1).split('/');
        let currentDirectory = system;
        for (const directory of directories) {
            const subDirectory = currentDirectory.find((child) => child.name === directory);
            if (subDirectory)
                currentDirectory = subDirectory.children ?? [];
            else
                return;
        }
        return currentDirectory;
    }

    const changeDirectory = (newPath) => {
        if (newPath === path) return;

        const currentDirectory = getDirectory(newPath);
        if (!currentDirectory) {
            setPath(history[historyIndex]);
            throwErrorWindow('Error Code: 404', 'Directory not found!');
        } else {
            setCurrentDirectory(currentDirectory);
            setPath(newPath);
            setHistory(prevHistory => [...prevHistory.slice(0, historyIndex + 1), newPath]);
            setHistoryIndex(prevIndex => prevIndex + 1);
        }
    };

    const onItemClick = (e, index) => {
        e.stopPropagation();
        setSelectedItems([index]);
    };

    const onItemDoubleClick = (item) => {
        if (item.access) {
            if (item.type === 'folder')
                onFolderClick(item);

            if (item.type === 'file')
                onFileClick(item);
        } else {
            throwErrorWindow('Error Code: 401', 'You don\'t have access to this item!');
        }
    };

    const removeSelectedItems = (e) => {
        setSelectedItems([]);
    };

    const onFolderClick = (folder) => changeDirectory(path.length === 1 ? `/${folder.name}` : `${path}/${folder.name}`);

    const onFileClick = () => {

    };

    const onHomeClick = () => {

    };

    const onBackClick = () => {
        if (historyIndex === 0) return;

        const previousPath = history[historyIndex - 1];
        const directory = getDirectory(previousPath);
        setCurrentDirectory(directory);
        setPath(previousPath);
        setHistoryIndex(prevIndex => prevIndex - 1);
    };

    const onForwardClick = () => {
        if (historyIndex === history.length - 1) return;

        const nextPath = history[historyIndex + 1];
        const directory = getDirectory(nextPath);
        setCurrentDirectory(directory);
        setPath(nextPath);
        setHistoryIndex(prevIndex => prevIndex + 1);
    };

    const throwErrorWindow = (title, message) => setErrors(prevErrors => [...prevErrors, { title, message }]);

    const closeErrorWindow = (index) => setErrors(prevErrors => prevErrors.filter((_, i) => i !== index));

    useEffect(() => {
        getSystemData();
    }, []);

    useEffect(() => {
        if (system)
            setCurrentDirectory(getDirectory(defaultPath));
    }, [system]);

    console.log(history, historyIndex);

    // meter seta para a direita no fim do path para poderem navegar para o novo endereço com o rato
    // meter os paddings correctos
    // meter a palavra empty caso a pasta seja vazia
    return (
        <>
            <Window
                ref={ref}
                className={`explorer ${className}`}
                icon={DarkFileManager}
                name="Explorer"
                draggable={draggable}
                resizable={resizable}
                {...props}
            >
                <div className="explorer__topbar">
                    <div className="explorer__button-group">
                        {/* <button
                            className="window__icon-button"
                            onClick={onHomeClick}
                        >
                            <Home />
                        </button> */}
                        <button
                            className="window__icon-button"
                            disabled={historyIndex === 0}
                            onClick={onBackClick}
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            className="window__icon-button"
                            disabled={historyIndex === history.length - 1}
                            onClick={onForwardClick}
                        >
                            <ChevronRight />
                        </button>
                        {/* <button
                            className="window__icon-button"
                            disabled={historyIndex === 0}
                            onClick={onForwardClick}
                        >
                            <RefreshCcw />
                        </button> */}
                    </div>
                    <Input
                        className="explorer__path"
                        startIcon={Folder}
                        value={path}
                        onChange={(e) => setPath(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') changeDirectory(path);
                        }}
                    />
                    <Input
                        className="explorer__search"
                        startIcon={Search}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter');
                        }}
                    />
                </div>
                <div className="explorer__sidebar">

                </div>
                <div
                    className="explorer__content"
                    onClick={(e) => removeSelectedItems(e)}
                >
                    {
                        currentDirectory ?
                            currentDirectory.map((child, index) => {
                                const Icon = getIconByName(child.icon) ?? (child.type === 'file' ? getIconByMimetype(child.mimetype) : getIconByName('DarkFolder'));
                                return (
                                    <div
                                        key={index}
                                        ref={(ref) => itemsRefs.current[index] = ref}
                                        className="explorer__item"
                                        data-selected={selectedItems.includes(index)}
                                        onClick={(e) => onItemClick(e, index)}
                                        onDoubleClick={() => onItemDoubleClick(child)}
                                    >
                                        <Icon />
                                        <span>{child.name}</span>
                                    </div>
                                );
                            })
                            :
                            <Loading className="explorer__loading" />
                    }
                </div>
            </Window>
            {
                openFiles.map((file, index) => (
                    <FileViewer
                        key={`file-${index}`}
                        {...file}
                    />
                ))
            }
            {
                errors.map((error, index) => (
                    <ErrorWindow
                        key={`error-${index}`}
                        onClose={() => closeErrorWindow(index)}
                        {...error}
                    />
                ))
            }
        </>
    );
});



export default Explorer;
// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef, useMemo, Fragment } from "react";
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

const ExplorerItem = forwardRef(({ icon, name, type, mimetype, selected, onClick, onDoubleClick }, ref) => {
    const Icon = getIconByName(icon) ?? (
        type === 'file' ?
            getIconByMimetype(mimetype)
            :
            getIconByName('DarkFolder')
    );
    console.log(mimetype)
    console.log(Icon)
    return (
        <div
            ref={ref}
            className="explorer__item"
            data-selected={selected}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
        >
            <Icon />
            <span>{name}</span>
        </div>
    );
});

const SidebarLink = forwardRef(({ name, icon, onClick }, ref) => {
    const Icon = getIconByName(icon);
    return (
        <button
            className="explorer__sidebar__link"
            onClick={onClick}
        >
            <Icon />
            <span>{name}</span>
        </button>
    );
});

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

    const getData = async () => {
        let response = await fetch('/api/system/directories');
        let result = await response.json();
        setSystem(result);
        setCurrentDirectory(result.sort(sortDirectories));

        response = await fetch('/api/system/explorer-sections');
        result = await response.json();
        setSections(result);
    };

    const sortDirectories = (a, b) => {
        // sort by type: folder and file first and then name
        if (a.type === b.type) return a.name.localeCompare(b.name);
        else return a.type === 'folder' ? -1 : 1;
    }

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
        if (newPath === history[historyIndex]) return;
        if (newPath.replace(' ', '') === '') newPath = '/';

        const currentDirectory = getDirectory(newPath);
        if (!currentDirectory) {
            setPath(history[historyIndex]);
            throwErrorWindow('Error Code: 404', 'Directory not found!');
        } else {
            setCurrentDirectory(currentDirectory.sort(sortDirectories));
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

    const onSectionClick = (index) => {
        setSections((prevSections) => (
            prevSections.map((section, i) => (
                i === index ? { ...section, open: !section.open } : section
            ))
        ));
    };

    // const onHomeClick = () => {

    // };

    const onBackClick = () => {
        if (historyIndex === 0) return;

        const previousPath = history[historyIndex - 1];
        const directory = getDirectory(previousPath);
        setCurrentDirectory(directory.sort(sortDirectories));
        setPath(previousPath);
        setHistoryIndex(prevIndex => prevIndex - 1);
    };

    const onForwardClick = () => {
        if (historyIndex === history.length - 1) return;

        const nextPath = history[historyIndex + 1];
        const directory = getDirectory(nextPath);
        setCurrentDirectory(directory.sort(sortDirectories));
        setPath(nextPath);
        setHistoryIndex(prevIndex => prevIndex + 1);
    };

    const throwErrorWindow = (title, message) => setErrors(prevErrors => [...prevErrors, { title, message }]);

    const closeErrorWindow = (index) => setErrors(prevErrors => prevErrors.filter((_, i) => i !== index));

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (system)
            setCurrentDirectory(getDirectory(defaultPath));
    }, [system]);

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
                        onBlur={() => setPath(history[historyIndex])}
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
                    {
                        sections?.map((section, i) => (
                            <Fragment key={`section-${i}`}>
                                <span className="explorer__sidebar__section">
                                    {section.name}
                                </span>
                                {
                                    section.links.map((link, j) => (
                                        <SidebarLink
                                            key={`link-${j}`}
                                            className="explorer__sidebar__link"
                                            onClick={() => changeDirectory(link.path)}
                                            {...link}
                                        />
                                    ))
                                }
                            </Fragment>
                        ))
                    }
                </div>
                <div
                    className="explorer__content"
                    onClick={(e) => removeSelectedItems(e)}
                >
                    {
                        currentDirectory ?
                            currentDirectory.length > 0 ?
                                <div className="explorer__grid">
                                    {
                                        currentDirectory.map((child, index) => (
                                            <ExplorerItem
                                                key={`item-${index}`}
                                                ref={(ref) => itemsRefs.current[index] = ref}
                                                className="explorer__item"
                                                selected={selectedItems.includes(index)}
                                                onClick={(e) => onItemClick(e, index)}
                                                onDoubleClick={() => onItemDoubleClick(child)}
                                                {...child}
                                            />
                                        ))
                                    }
                                </div>
                                :
                                <Loading className="explorer__loading" message="Empty" />
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
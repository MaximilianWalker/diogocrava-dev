// https://sdk.vercel.ai/docs
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import parse from 'html-react-parser';
import './terminal-input.css';

export default function TerminalInput({
    prefix,
    isPrefixHtml = false,
    cursorCharacter,
    value,
    onChange,
    onSubmit
}) {
    const textareaRef = useRef();
    const textRef = useRef();

    const [selection, setSelection] = useState();

    const preText = useMemo(() => {
        if (!selection)
            return value;
        else if (selection.start === selection.end || selection.direction === 'forward')
            return value.slice(0, selection.start);

        return (
            <>
                {value.slice(0, selection?.start)}
                <span className="selected">
                    {value.slice(selection.start, selection.end)}
                </span>
            </>
        );
    }, [value, selection]);

    const postText = useMemo(() => {
        if (!selection)
            return '';
        else if (selection.start === selection.end || selection.direction === 'backward')
            return value.slice(selection.end);

        return (
            <>
                <span className="selected">
                    {value.slice(selection.start, selection.end)}
                </span>
                {value.slice(selection.end)}
            </>
        );
    }, [value, selection]);

    const onInput = useCallback((e) => {
        onChange(e);
        setSelection({
            start: e.target.selectionStart,
            end: e.target.selectionEnd,
            direction: e.target.selectionDirection
        });
    }, [onChange, setSelection]);

    const onKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            setSelection({
                start: 0,
                end: 0,
                direction: null
            });
            onSubmit(e);
        } else {
            setSelection({
                start: e.target.selectionStart,
                end: e.target.selectionEnd,
                direction: e.target.selectionDirection
            });
        }
    }, [setSelection, onSubmit]);

    const onKeyUp = useCallback((e) => {
        setSelection({
            start: e.target.selectionStart,
            end: e.target.selectionEnd,
            direction: e.target.selectionDirection
        });
    }, [setSelection]);

    useEffect(() => {
        if (!textareaRef.current) return;

        const handleFocus = (e) => {
            if (!e.ctrlKey && !e.metaKey && !e.altKey)
                textareaRef.current.focus();
        };

        window.addEventListener('keydown', handleFocus);
        window.addEventListener('keyup', handleFocus);
        return () => {
            window.removeEventListener('keydown', handleFocus);
            window.removeEventListener('keyup', handleFocus);
        };
    }, [textareaRef.current]);

    useEffect(() => {
        if (!textareaRef.current) return;

        const handleSelection = (e) => {
            const { selectionStart, selectionEnd, selectionDirection } = textareaRef.current;
            const cursorPosition = selectionDirection === 'forward' ? selectionStart : selectionEnd;
            textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
            setSelection({
                start: cursorPosition,
                end: cursorPosition,
                direction: selectionDirection
            });
        };

        window.addEventListener('mousedown', handleSelection);
        return () => {
            window.removeEventListener('mousedown', handleSelection);
        };
    }, [textareaRef.current, setSelection]);

    return (
        <div className="terminal-input">
            <textarea
                ref={textareaRef}
                autoFocus
                value={value}
                onInput={onInput}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
            />
            <pre ref={textRef}>
                <span>{isPrefixHtml ? parse(prefix) : prefix}</span>
                {preText}
                <span className="cursor">{cursorCharacter}</span>
                {postText}
            </pre>
        </div>
    );
}
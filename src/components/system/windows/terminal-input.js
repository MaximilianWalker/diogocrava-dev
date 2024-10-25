// https://sdk.vercel.ai/docs
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import parse from 'html-react-parser';
import { useChat } from 'ai/react';
import './terminal-input.css';

export default function TerminalInput({
    prefix,
    isPrefixHtml = false,
    cursorCharacter
}) {
    const textareaRef = useRef();
    const textRef = useRef();

    const {
        input,
        handleInputChange,
        handleSubmit
    } = useChat();

    const [cursorPosition, setCursorPosition] = useState();
    const [selection, setSelection] = useState();

    const selectText = useCallback((start, end, direction = 'forward') => {
        const selection = window.getSelection();
        selection.removeAllRanges();

        const preElement = textRef.current;
        const [prefixSpan, beforeCursorText, cursorSpan, afterCursorText] = preElement.childNodes;

        // Adjust start and end positions to account for the prefix length
        const prefixLength = prefix.length;
        const adjustedStart = start + prefixLength;
        const adjustedEnd = end + prefixLength;

        // Determine anchor and focus nodes and offsets based on direction
        let anchorNode, anchorOffset, focusNode, focusOffset;

        // Since we have a predictable structure, we can map positions to nodes
        if (direction === 'forward') {
            anchorNode = beforeCursorText;
            anchorOffset = adjustedStart - prefixLength;
            focusNode = beforeCursorText;
            focusOffset = adjustedEnd - prefixLength;
        } else if (direction === 'backward') {
            anchorNode = beforeCursorText;
            anchorOffset = adjustedEnd - prefixLength;
            focusNode = beforeCursorText;
            focusOffset = adjustedStart - prefixLength;
        }

        // Handle cases where selection spans into the afterCursorText
        if (adjustedEnd > (beforeCursorText.textContent.length + prefixLength)) {
            focusNode = afterCursorText;
            focusOffset = adjustedEnd - beforeCursorText.textContent.length - prefixLength;
        }

        if (anchorNode && focusNode) {
            selection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
        }
    }, [prefix]);

    function selectContents(el) {
        let range = document.createRange();
        range.selectNodeContents(el);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    const onInput = useCallback((e) => {
        handleInputChange(e);
        setCursorPosition(e.target.selectionStart);
    }, [setCursorPosition]);

    const onKeyDown = useCallback((e) => {
        setCursorPosition(e.target.selectionStart);
    }, [setCursorPosition]);

    const onKeyUp = useCallback((e) => {
        const { selectionStart, selectionEnd, selectionDirection } = e.target;
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
            handleInputChange('');
            setCursorPosition(0);
        }
        setCursorPosition(e.target.selectionStart);
        setSelection({
            start: selectionStart,
            end: selectionEnd,
            direction: selectionDirection
        });
        // selectContents(textRef.current.firstChild);
        // selectText(selectionStart, selectionEnd, selectionDirection);
    }, [input, cursorPosition, setCursorPosition, handleSubmit, handleInputChange]);

    // Handle textareas focus
    useEffect(() => {
        const handleFocus = (e) => {
            if (!e.ctrlKey && !e.metaKey && !e.altKey) {
                textareaRef.current.focus();
                console.log('focus')
            }
        }
        window.addEventListener('keydown', handleFocus);
        window.addEventListener('keyup', handleFocus);
        // handle mouse click on
        // window.addEventListener('click', handleFocus);
        return () => window.removeEventListener('keydown', handleFocus);
    }, []);

    // useEffect(() => {
    //     if (selection)
    //         selectText(selection.start, selection.end, selection.direction);
    // }, [selection]);

    return (
        <div className="terminal-input">
            <textarea
                ref={textareaRef}
                autoFocus
                value={input}
                onInput={onInput}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
            // onBlur={() => textareaRef.current.focus()}
            />
            <pre ref={textRef}>
                <span>{isPrefixHtml ? parse(prefix) : prefix}</span>
                {input.slice(0, cursorPosition ?? input.length)}
                <span className="cursor">{cursorCharacter}</span>
                {input.slice(cursorPosition ?? input.length)}
            </pre>
        </div>
    );
}
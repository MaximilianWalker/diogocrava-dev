// https://sdk.vercel.ai/docs
'use client';

import { useId, forwardRef } from "react";
import { Home, ChevronLeft, ChevronRight } from 'react-feather';
import Window from "../common/window";
import { DialogError } from '@/icons/system';
import './error.css';
import MenuButton from "@/components/buttons/menu-button";

const Error = forwardRef(({ className, title, message, onClose, props }, ref) => {
    const id = useId();
    return (
        <Window
            ref={ref}
            id={id}
            className={`error-window ${className}`}
            name="Error"
            defaultOpen
            draggable
            {...props}
        >
            <div className="error-container">
                <DialogError />
                <div className="error-text-container">
                    <p className="error-title">{title}</p>
                    <p className="error-message">{message}</p>
                </div>
            </div>
            <MenuButton
                className="error-button"
                text="OK!"
                onClick={onClose}
            />
        </Window>
    );
});

export default Error;
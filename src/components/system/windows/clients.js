// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import { MapPin } from 'react-feather';
import Window from "@/components/system/common/window";
import './location.css';

const Clients = forwardRef(({ className, ...props }, ref) => {
    return (
        <Window
            ref={ref}
            className={`clients ${className}`}
            id="clients-window"
            name="Recommendations"
            defaultOpen
            draggable
            resizable
            {...props}
        >
        </Window>
    );
});

export default Clients;
// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import { MapPin } from 'react-feather';
import Window from "@/components/system/common/window";
import GoogleMap from "@/components/map";
import './location.css';

const Location = forwardRef(({ className, ...props }, ref) => {
    return (
        <Window
            ref={ref}
            className={`location ${className}`}
            id="location-window"
            name="Location"
            icon={MapPin}
            defaultOpen
            draggable
            resizable
            {...props}
        >
            <GoogleMap />
        </Window>
    );
});

export default Location;
// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import PropTypes from "prop-types";
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

Clients.propTypes = {

};

export default Clients;
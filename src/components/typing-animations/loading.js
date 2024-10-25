'use client';

import { useState, useEffect, memo } from "react";
import { TypeWave } from '@typewavejs/react';
import './loading.css';

const getEvents = (text) => [
    {
        type: "type",
        instant: true,
        value: text
    },
    {
        type: "type",
        value: "..."
    },
    {
        type: "delete",
        value: 3
    },
    {
        type: "loop",
        value: 1
    }
];

const Loading = ({ className, message = "LOADING" }) => (
    <h1 className={`loading__container ${className}`}>
        <TypeWave
            className="loading__text"
            events={getEvents(message)}
            showCursor={false}
            typeSpeed={600}
            deleteSpeed={600}
        />
    </h1>
);

export default memo(Loading);
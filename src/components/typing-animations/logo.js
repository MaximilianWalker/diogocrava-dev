'use client';

import { useState, useEffect } from "react";
import { TypeWave } from '@typewavejs/react';
import './logo.css';

const LOOP_PAUSE = 5000;

const events = [
    {
        type: "type",
        value: "<DiogoCrava />"
    },
    {
        type: "pause",
        value: LOOP_PAUSE
    },
    {
        type: "delete"
    },
    {
        type: "type",
        value: "<FullStack />"
    },
    {
        type: "pause",
        value: LOOP_PAUSE
    },
    {
        type: "delete"
    },
    {
        type: "type",
        value: "<Dev />"
    },
    {
        type: "pause",
        value: LOOP_PAUSE
    },
    {
        type: "delete"
    },
    {
        type: "type",
        value: "<Code />"
    },
    {
        type: "pause",
        value: LOOP_PAUSE
    },
    {
        type: "delete"
    },
    {
        type: "loop",
        value: 0
    }
];

export default () => (
    <TypeWave
        className="logo"
        component="h1"
        events={events}
        deleteSpeed={50}
        cursorCharacter="_"
    />
);
// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import PropTypes from "prop-types";
import Window from "@/components/system/common/window";
import Code from "@/components/common/code";
import './animated-ide.css';

const AnimatedIDE = forwardRef(({ className, language, code, ...props }, ref) => {
    return (
        <Window
            ref={ref}
            className={`animated-ide ${className}`}
            id="animated-ide"
            name="IDE"
            {...props}
        >
            <Code
                language={language}
                code={code}
                showLineNumbers={false}
            />
        </Window>
    );
});

AnimatedIDE.propTypes = {

};

export default AnimatedIDE;
// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import PropTypes from "prop-types";
import dynamic from "next/dynamic";
import Window from "@/components/system/common/window";
import './animated-ide.css';

const Code = dynamic(() => import('@/components/common/code'), { ssr: false });

const AnimatedIDE = forwardRef(({ className, language, code, ...props }, ref) => {
    return (
        <Window
            ref={ref}
            className={`animated-ide ${className ?? ''}`}
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
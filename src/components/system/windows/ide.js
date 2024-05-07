// https://sdk.vercel.ai/docs
'use client';

import { forwardRef } from "react";
import PropTypes from "prop-types";
import Code from "@/components/common/code";
import { getProgrammingLanguage } from "@/utils/mimeToLanguage";
import './ide.css';

const IDE = forwardRef(({ className, mimetype, data, ...props }, ref) => {
    console.log(mimetype);
    console.log(data);
    console.log(getProgrammingLanguage(mimetype))
    return (
        <Code
            ref={ref}
            className={`ide ${className}`}
            language={getProgrammingLanguage(mimetype)}
            code={data}
        />
    );
});

IDE.propTypes = {

};

export default IDE;
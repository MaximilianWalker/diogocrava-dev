// https://sdk.vercel.ai/docs
'use client';

import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import { MDXRemote } from 'next-mdx-remote/rsc';
import './markdown-viewer.css';

const FileViewer = forwardRef(({ className, mimetype, data, ...props }, ref) => {
    return (
        <MDXRemote source={data} />
    );
});

export default FileViewer;
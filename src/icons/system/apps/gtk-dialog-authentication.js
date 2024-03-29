export default () => (
    <svg viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="a" x="-.036" y="-.036" width="1.072" height="1.072" colorInterpolationFilters="sRGB">
                <feGaussianBlur stdDeviation="0.9" />
            </filter>
        </defs>
        <g transform="translate(1)" opacity=".15">
            <path d="m31 3c-16.569 0-30 13.431-30 30s13.431 30 30 30 30-13.431 30-30-13.431-30-30-30z" strokeWidth="2" />
            <path d="m31 55c-12.15 0-22-9.85-22-22s9.85-22 22-22 22 9.85 22 22-9.85 22-22 22z" strokeWidth="2" />
            <path d="m31.5 23a5.5 5.5 0 0 0-5.5 5.5c0 2.28 1.366 4.224 3.34 5.06l-3.34 11.44h11l-3.34-11.44a5.47 5.47 0 0 0 3.34-5.06 5.5 5.5 0 0 0-5.5-5.5z" overflow="visible" strokeWidth="2.182" />
        </g>
        <g transform="translate(1,-1)">
            <g strokeWidth="2">
                <path d="m31 3c-16.569 0-30 13.431-30 30s13.431 30 30 30 30-13.431 30-30-13.431-30-30-30z" filter="url(#a)" opacity=".15" />
                <path d="m31 3c-16.569 0-30 13.431-30 30s13.431 30 30 30 30-13.431 30-30-13.431-30-30-30z" fill="#e6e6e6" />
                <path d="m31 55c-12.15 0-22-9.85-22-22s9.85-22 22-22 22 9.85 22 22-9.85 22-22 22z" fill="#ccc" />
            </g>
            <path d="m31.5 23a5.5 5.5 0 0 0-5.5 5.5c0 2.28 1.366 4.224 3.34 5.06l-3.34 11.44h11l-3.34-11.44a5.47 5.47 0 0 0 3.34-5.06 5.5 5.5 0 0 0-5.5-5.5z" fill="#4d4d4d" overflow="visible" strokeWidth="2.182" />
        </g>
    </svg>
);
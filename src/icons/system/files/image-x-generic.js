export default (props) => (
    <svg
        viewBox="0 0 16.933 16.933"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <defs>
            <filter
                id="a"
                x={-0.033428}
                y={-0.039001}
                width={1.0669}
                height={1.078}
                colorInterpolationFilters="sRGB"
            >
                <feGaussianBlur stdDeviation={0.20637525} />
            </filter>
        </defs>
        <path
            d="m15.875 3.7982c0-0.73289-0.59001-1.3229-1.3229-1.3229h-12.171c-0.73289 0-1.3229 0.59001-1.3229 1.3229v10.054c0 0.73289 0.59001 1.3229 1.3229 1.3229h10.319l3.175-3.175z"
            fillRule="evenodd"
            filter="url(#a)"
            opacity={0.15}
            strokeWidth={0.26458}
            style={{
                paintOrder: "stroke fill markers",
            }}
        />
        <path
            d="m15.875 3.4395c0-0.73289-0.59001-1.3229-1.3229-1.3229h-12.171c-0.73289 0-1.3229 0.59001-1.3229 1.3229v10.054c0 0.73289 0.59001 1.3229 1.3229 1.3229h10.319l3.175-3.175z"
            fill="#c34fc1"
            fillRule="evenodd"
            strokeWidth={0.26458}
            style={{
                paintOrder: "stroke fill markers",
            }}
        />
        <g fill="#fff">
            <path
                d="m12.7 14.816 3.1749-3.1749h-1.852c-0.73288 0-1.3229 0.59001-1.3229 1.3229z"
                fillRule="evenodd"
                opacity={0.35}
                style={{
                    paintOrder: "stroke fill markers",
                }}
            />
            <path
                d="m7.0373 6.7966-2.8039 5.3739h6.776l-2.0725-3.9721-0.58413 1.1196z"
                color="#000000"
                opacity={0.6}
            />
            <path
                d="m11.377 4.7625c-0.73061 0-1.3229 0.59226-1.3229 1.3228 0 0.73059 0.59228 1.3228 1.3229 1.3228 0.73061 0 1.3229-0.59226 1.3229-1.3228 0-0.73059-0.59228-1.3228-1.3229-1.3228z"
                color="#000000"
                opacity={0.6}
            />
        </g>
    </svg>
);
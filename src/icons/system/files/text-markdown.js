export default (props) => (
    <svg
        viewBox="0 0 16.933 16.933"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <defs>
            <filter
                id="a"
                x={-0.039001}
                y={-0.033428}
                width={1.078}
                height={1.0669}
                colorInterpolationFilters="sRGB"
            >
                <feGaussianBlur stdDeviation={0.20637525} />
            </filter>
        </defs>
        <path
            d="m3.4395 1.3543c-0.73289 0-1.3229 0.59001-1.3229 1.3229v12.171c0 0.73289 0.59001 1.3229 1.3229 1.3229h10.054c0.73289 0 1.3229-0.59001 1.3229-1.3229v-10.319l-3.175-3.175z"
            filter="url(#a)"
            opacity={0.15}
            strokeWidth={0.26458}
            style={{
                paintOrder: "stroke fill markers",
            }}
        />
        <g fillRule="evenodd">
            <path
                transform="scale(.26458)"
                d="m13 4c-2.77 0-5 2.23-5 5v46c0 2.77 2.23 5 5 5h38c2.77 0 5-2.23 5-5v-39l-12-12h-31z"
                fill="#f4f4f4"
                style={{
                    paintOrder: "stroke fill markers",
                }}
            />
            <path
                d="m14.816 4.2332-3.1749-3.1749v1.852c0 0.73288 0.59001 1.3229 1.3229 1.3229z"
                fill="#bbb"
                style={{
                    paintOrder: "stroke fill markers",
                }}
            />
        </g>
        <g transform="translate(-20.849 -2.0766)">
            <rect
                x={25.876}
                y={8.691}
                width={6.879}
                height={3.7041}
                rx={0.26458}
                ry={0.26458}
                enableBackground="new"
                fill="none"
                stroke="#455a64"
                strokeWidth={0.52916}
            />
            <path
                d="m26.934 11.601v-2.1166h0.52916l0.66144 0.82681 0.66145-0.82681h0.52916v2.1166h-0.52916v-1.2898l-0.66145 0.82681-0.66144-0.82681v1.2898z"
                enableBackground="new"
                fill="#455a64"
            />
            <path
                d="m30.903 11.601-0.79373-1.0583h0.52916v-1.0583h0.52916v1.0583h0.52916z"
                enableBackground="new"
                fill="#455a64"
            />
        </g>
        <path
            d="m11.641 2.9104v0.15451c0 0.79397 0.59 1.433 1.3229 1.433h1.852l1.42e-4 -0.26463-1.8522 5e-5c-0.73289 1.98e-5 -1.3229-0.59001-1.3229-1.3229z"
            opacity={0.1}
            strokeWidth={1.0408}
            style={{
                paintOrder: "stroke fill markers",
            }}
        />
    </svg>
);
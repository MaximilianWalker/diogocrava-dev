export default function FadeCojntainer({ children, className }) {
    return (
        <div
            style={{
                mask: 
            }}
        >
            {children}
        </div>
    );
}

// marginLeft: `-${fade}px`,
//     marginRight: `-${fade}px`,
//     mask: `linear-gradient(
//         to right, 
//         transparent, 
//         black ${fade}px, 
//         black calc(100% - ${fade}px), 
//         transparent
//     )`

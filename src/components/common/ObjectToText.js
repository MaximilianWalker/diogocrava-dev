import { useEffect } from "react";
import './ObjectToText.css';

function TextObject({ className, value, depth = 0 }) {
    switch (typeof value) {
        case 'object':
            return Object.entries(value).map(([key, val]) => (
                <>
                    <div className="property-container">
                        <span className="key" data-depth={depth}>{key}: </span>
                        {
                            typeof val != 'object' && typeof val != 'array' &&
                            <span className="value" data-depth={depth}>{val}</span>
                        }
                    </div>
                    {
                        typeof val === 'object' || typeof val === 'array' &&
                        <TextObject className={className} value={val} depth={depth + 1} />
                    }
                </>
            ));
        case 'array':
            return value.map((val) => (
                <TextObject className={className} value={val} depth={depth + 1} />
            ));
        default:
            return <span className="value">{value}</span>;
    }
}

export default function JsonToText({ className, value }) {
    return (
        <div className={`container ${className ?? ''}`}>
            <TextObject className={className} value={value} />
        </div>
    );
}
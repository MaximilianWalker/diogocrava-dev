import { useEffect } from "react";
import './object-to-text.css';

function PropertyElement({ className, name, value, depth = 0 }) {
    const style = {
        marginLeft: `calc(${depth} * var(--line-padding))`
    };
    if (!name) {
        return (
            <div className="object-to-text__line" style={style}>
                <span className="object-to-text__value">{value}</span>
            </div>
        );
    } else if (typeof value === 'string') {
        return (
            <div className="object-to-text__line" style={style}>
                <span className="object-to-text__name">{name}:</span>
                <span className="object-to-text__value">{value}</span>
            </div>
        );
    } else if (typeof value === 'object') {
        return (
            <>
                <div className="object-to-text__line" style={style}>
                    <span className="object-to-text__name">{name}</span>
                </div>
                <ObjectEelement className={className} value={value} depth={depth + 1} />
            </>
        );
    } else if (typeof value === 'array') {
        return (
            <>
                <div className="object-to-text__line" style={style}>
                    <span className="object-to-text__name">{name}:</span>
                </div>
                {
                    value.map((val, i) => (
                        <PropertyElement className={className} name={i} value={val} depth={depth + 1} />
                    ))
                }
            </>
        );
    }
}

function ObjectEelement({ className, value, depth = 0 }) {
    if (!value) return null;

    if (typeof value !== 'object')
        throw new Error('value must be an object');

    return (
        <>
            {
                Object.entries(value).map(([key, val]) => (
                    <PropertyElement className={className} name={key} value={val} depth={depth} />
                ))
            }
        </>
    );
}

export default function ObjectToText({ className, value }) {
    return (
        <div className={`object-to-text__container ${className ?? ''}`}>
            <ObjectEelement className={className} value={value} />
        </div>
    );
}
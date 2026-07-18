import React from "react";
import "./ui.css";

export default function Skeleton({
    variant = "text", // text, title, avatar, rect
    className = "",
    width,
    height,
    ...props
}) {
    const style = { width, height };
    return (
        <div
            className={`skeleton skeleton-${variant} animate-pulse ${className}`}
            style={style}
            {...props}
        />
    );
}

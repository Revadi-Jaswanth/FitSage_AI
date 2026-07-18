import React from "react";
import "./ui.css";

export default function Badge({
    children,
    variant = "primary", // primary, secondary, success, warning, danger, outline
    className = "",
    ...props
}) {
    return (
        <span className={`badge badge-${variant} ${className}`} {...props}>
            {children}
        </span>
    );
}
